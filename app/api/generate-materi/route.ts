import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OfficeParser } from 'officeparser';
import { YoutubeTranscript } from 'youtube-transcript';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const link = formData.get('link') as string | null;
    const userId = formData.get('user_id') as string;
    
    if (!file && !link) {
      return NextResponse.json({ error: 'File atau Link wajib disertakan.' }, { status: 400 });
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID tidak ditemukan. Harap login ulang.' }, { status: 401 });
    }

    // --- CHECK QUOTA LIMIT (MAX 3 PER DAY) ---
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const authHeader = request.headers.get('Authorization') || '';
    
    // Gunakan fungsi custom fetch untuk menghindari policy RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options) => {
            const headers = new Headers(options?.headers);
            headers.set('Authorization', authHeader);
            return fetch(url, { ...options, headers });
          }
        }
      }
    );

    const { count: usageCount, error: countError } = await supabase
      .from('materials')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfDay.toISOString());

    if (countError) {
      console.error('Failed to check quota:', countError);
      return NextResponse.json({ error: 'Gagal mengecek kuota pengguna.' }, { status: 500 });
    }

    if ((usageCount || 0) >= 3) {
      return NextResponse.json({ 
        error: 'Kuota harian Anda telah habis (Maks. 3 kali sehari). Silakan kembali besok.' 
      }, { status: 429 });
    }
    // --- END CHECK QUOTA ---

    let extractedText = '';
    let sourceType = 'other';
    let title = 'Materi Baru';
    let fileSizeBytes = 0;
    
    // Siapkan object untuk Native PDF upload ke Gemini
    let inlinePdfData: { inlineData: { data: string, mimeType: string } } | null = null;

    if (file) {
      // Limit file size (25 MB max untuk Audio/Whisper, 10 MB untuk Dokumen)
      const isAudio = file.name.match(/\.(mp3|mp4|mpeg|mpga|m4a|wav|webm)$/i);
      const MAX_SIZE = isAudio ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: `Ukuran dokumen/audio melebihi batas (${isAudio ? '25MB' : '10MB'})!` }, { status: 400 });
      }

      fileSizeBytes = file.size;
      title = file.name;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = file.name.toLowerCase();

      try {
        if (fileName.endsWith('.pdf')) {
          sourceType = 'pdf';
          // Gemini mendukung file PDF asli secara langsung tanpa perlu PDF parse tambahan
          inlinePdfData = {
            inlineData: {
              data: buffer.toString('base64'),
              mimeType: 'application/pdf'
            }
          };
          // Set extracted text dummy agar bisa lolos validasi teks kosong di baris bawah
          extractedText = '[PDF Processing - Dihandle secara native oleh Gemini AI]';
        } else if (fileName.endsWith('.docx') || fileName.endsWith('.pptx')) {
          sourceType = fileName.endsWith('.docx') ? 'docx' : 'ppt';
          // Menggunakan officeparser untuk mengekstrak teks dari buffer dokumen
          const ast = await OfficeParser.parseOffice(buffer);
          extractedText = typeof ast.toText === 'function' ? ast.toText() : JSON.stringify(ast);
        } else if (fileName.match(/\.(mp3|mp4|mpeg|mpga|m4a|wav|webm)$/)) {
          sourceType = 'audio';
          
          // Menggunakan Groq Whisper untuk Transkripsi Audio ke Teks
          const audioFormData = new FormData();
          // Gunakan blob karena kita ada buffer
          const mimeType = file.type || 'audio/mpeg';
          const audioBlob = new Blob([buffer], { type: mimeType });
          audioFormData.append('file', audioBlob, fileName);
          audioFormData.append('model', 'whisper-large-v3');
          audioFormData.append('language', 'id'); // opsional, dipaksa agar transkrip dalam bahasa indonesia
          
          const groqResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: audioFormData
          });

          if (!groqResponse.ok) {
            const errBase = await groqResponse.text();
            console.error('Groq Transcribe Error:', errBase);
            throw new Error(`Gagal mengubah audio menjadi teks. Groq Error: ${errBase}`);
          }
          const result = await groqResponse.json();
          extractedText = result.text;
          
        } else {
          return NextResponse.json({ error: 'Format file tidak didukung. Harap gunakan PDF, DOCX, PPTX atau format Audio didukung.' }, { status: 400 });
        }
      } catch (err: any) {
         console.error("Gagal membaca dokumen:", err);
         return NextResponse.json({ error: 'Gagal membaca dokumen. Pastikan file tidak rusak atau terenkripsi.' }, { status: 400 });
      }
    } else if (link) {
      try {
        const isYoutube = link.includes('youtube.com') || link.includes('youtu.be');
        if (!isYoutube) {
           return NextResponse.json({ error: 'Saat ini AI hanya mendukung konversi dari link YouTube.' }, { status: 400 });
        }
        
        fileSizeBytes = 0;
        sourceType = 'youtube';
        
        // Ambil ID YouTube untuk title dan transcript
        title = 'Materi Video YouTube';
        const transcript = await YoutubeTranscript.fetchTranscript(link);
        
        if (!transcript || transcript.length === 0) {
           return NextResponse.json({ error: 'Subtitle tidak ditemukan. Video YouTube ini sepertinya tidak memiliki CC.' }, { status: 400 });
        }
        
        // Gabungkan semua array dari CC menjadi satu teks panjang
        extractedText = transcript.map(t => t.text).join(' ');
      } catch (err: any) {
        console.error('YouTube Transcript Error:', err);
        return NextResponse.json({ error: 'Gagal mengambil subtitle (CC) dari video. Pastikan video bersifat publik dan tidak diblokir.' }, { status: 400 });
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ error: 'Tidak ada teks yang dapat dibaca dari dokumen atau link ini.' }, { status: 400 });
    }

    // Mengambil 30.000 karakter pertama agar tidak melampaui token limit Gemini
    const safeText = extractedText.substring(0, 30000);

    // Prompt cerdas untuk Gemini AI mengatur jadi ringkuman / materi belajar
    const prompt = `Kamu adalah seorang guru AI yang sangat pintar, asik, dan mudah dimengerti.
Tugas kamu adalah MENGUBAH teks dokumen di bawah ini (atau dokumen asli PDF yang terlampir) menjadi sebuah MATERI BELAJAR yang terstruktur.
Gunakan markdown (Heading, Bullet points, Bold) untuk merapikannya.
Jelaskan seakan kamu mengajar orang awam agar cepat paham.
    
Berikut teks / dokumen pembantu:
---
${safeText}
---`;

    // Susun input prompt plus buffer (jika PDF) secara native ke model Flash terbaru
    const contentsToAI: any[] = [prompt];
    if (inlinePdfData) {
      contentsToAI.push(inlinePdfData);
    }

    // Menggunakan Gemini 2.5 Flash yang lebih stabil menahan spike "high demand" / error 503
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const aiResult = await model.generateContent(contentsToAI);
    const aiSummary = aiResult.response.text();

    // Simpan ke Database
    const { data, error } = await supabase.from('materials').insert([
      {
        user_id: userId,
        title: title,
        source_type: sourceType,
        file_size_bytes: fileSizeBytes,
        ai_summary: aiSummary,
        ai_status: 'completed',
      }
    ]).select().single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: 'Gagal menyimpan materi ke Database. DB Error: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan internal server.' }, { status: 500 });
  }
}
