import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OfficeParser } from 'officeparser';
import pdfParse from 'pdf-parse';
import { YoutubeTranscript } from 'youtube-transcript';
import mammoth from 'mammoth';
import fs from 'fs';
import os from 'os';
import path from 'path';

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
    let fileBuffer: Buffer | null = null;
    
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
      fileBuffer = buffer;
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
        } else if (fileName.endsWith('.docx')) {
          sourceType = 'docx';
          // Menggunakan mammoth untuk DOCX karena lebih stabil tanpa perlu mencocokkan magic bytes (bug file-type node.js)
          const result = await mammoth.extractRawText({ buffer: buffer });
          extractedText = result.value;
        } else if (fileName.endsWith('.pptx')) {
          sourceType = 'ppt';
          // Simpan sementara sebagai temp file karena officeparser sering gagal menebak format dari Buffer murni di Vercel/Node
          const tempPath = path.join(os.tmpdir(), `temp-${Date.now()}-${Math.random().toString(36).substring(7)}.pptx`);
          fs.writeFileSync(tempPath, buffer);
          try {
             // Menggunakan default OfficeParser method untuk parsing file fisik
             const ast = await OfficeParser.parseOffice(tempPath);
             extractedText = typeof ast === 'string' ? ast : (ast?.toText ? ast.toText() : JSON.stringify(ast));
          } finally {
             fs.unlinkSync(tempPath); // Pastikan selalu dihapus dari /tmp agar tidak memenuhi disk
          }
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
      } catch (err: unknown) {
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
      } catch (err: unknown) {
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
    const contentsToAI: (string | { inlineData: { data: string; mimeType: string } })[] = [prompt];
    if (inlinePdfData) {
      contentsToAI.push(inlinePdfData);
    }

    let aiSummary = '';

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const aiResult = await model.generateContent(contentsToAI);
      aiSummary = aiResult.response.text();
    } catch (aiError: unknown) {
      const errMsg = aiError instanceof Error ? aiError.message : String(aiError);
      const errStatus = (aiError as { status?: number })?.status;
      console.warn("Gemini API Error, checking possibility for fallback:", errMsg);
      
      const isHighDemand = errStatus === 503 || errMsg.includes('503') || errMsg.includes('demand');
      
      if (isHighDemand || errMsg.includes('GenerateContent')) {
        console.log("=== MELAKUKAN FALLBACK OTOMATIS KE GROQ LLAMA 3.3 ===");
        
        let finalPrompt = prompt;

        // Jika dokumen berbentuk PDF murni, kita harus ekstraksi teksnya terlebih dahulu untuk Groq
        if (inlinePdfData && fileBuffer) {
           console.log("PDF detected during fallback. Extracting text for Groq...");
           try {
             // Menggunakan pdf-parse karena officeparser tidak stabil untuk PDF asli di Node/Windows fallback
             const pdfData = await pdfParse(fileBuffer);
             const safePdfText = pdfData.text.substring(0, 30000);
             
             finalPrompt = `Kamu adalah seorang guru AI yang sangat pintar, asik, dan mudah dimengerti.
Tugas kamu adalah MENGUBAH teks dokumen di bawah ini menjadi sebuah MATERI BELAJAR yang terstruktur.
Gunakan markdown (Heading, Bullet points, Bold) untuk merapikannya.
Jelaskan seakan kamu mengajar orang awam agar cepat paham.
    
Berikut teks / dokumen pembantu:
---
${safePdfText}
---`;
           } catch (parseErr) {
             console.error("Gagal mengekstrak teks PDF saat fallback:", parseErr);
             throw new Error("Gagal fallback: Teks PDF tidak dapat dibaca oleh sistem cadangan.");
           }
        }
        
        let groqSuccess = false;
        try {
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [{ role: 'user', content: finalPrompt }],
              temperature: 0.3,
              max_tokens: 4000
            })
          });

          if (groqRes.ok) {
            const groqData = await groqRes.json();
            aiSummary = groqData.choices[0].message.content;
            groqSuccess = true;
          } else {
             console.warn("Groq failed with status:", groqRes.status);
          }
        } catch (e) {
          console.warn("Groq fetch error:", e);
        }

        if (!groqSuccess) {
           console.log("=== GROQ SIBUK, FALLBACK KE OPENROUTER ===");
           let orSuccess = false;
           try {
             const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
               },
               body: JSON.stringify({
                 model: 'google/gemini-2.5-flash',
                 messages: [{ role: 'user', content: finalPrompt }],
                 temperature: 0.3
               })
             });
             
             if (orRes.ok) {
               const orData = await orRes.json();
               aiSummary = orData.choices[0].message.content;
               orSuccess = true;
             } else {
               console.warn("OpenRouter failed with status:", orRes.status);
             }
           } catch(e) {
             console.warn("OpenRouter fetch error:", e);
           }

           if (!orSuccess) {
              console.log("=== OPENROUTER SIBUK, FALLBACK TERAKHIR KE DEEPSEEK ===");
              const dsRes = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                  model: 'deepseek-chat',
                  messages: [{ role: 'user', content: finalPrompt }],
                  temperature: 0.3
                })
              });
              
              if (!dsRes.ok) {
                const failErr = await dsRes.text();
                throw new Error(`Semua server AI (Gemini, Groq, OpenRouter, DeepSeek) sedang sibuk. Mohon coba beberapa saat lagi.`);
              }
              const dsData = await dsRes.json();
              aiSummary = dsData.choices[0].message.content;
           }
        }
      } else {
        // Lempar ke frontend jika bukan masalah 503
        throw aiError;
      }
    }

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

  } catch (error: unknown) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan internal server.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
