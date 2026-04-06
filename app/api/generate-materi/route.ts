import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OfficeParser } from 'officeparser';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('user_id') as string;
    
    if (!file && !formData.get('link')) {
      return NextResponse.json({ error: 'File atau Link wajib disertakan.' }, { status: 400 });
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID tidak ditemukan. Harap login ulang.' }, { status: 401 });
    }

    let extractedText = '';
    let sourceType = 'other';
    let title = 'Materi Baru';
    let fileSizeBytes = 0;
    
    // Siapkan object untuk Native PDF upload ke Gemini
    let inlinePdfData: { inlineData: { data: string, mimeType: string } } | null = null;

    if (file) {
      // Limit file size (10 MB = 10 * 1024 * 1024 bytes)
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: 'Ukuran dokumen melebihi batas 10MB!' }, { status: 400 });
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
        } else {
          return NextResponse.json({ error: 'Format file tidak didukung. Harap gunakan PDF, DOCX, atau PPTX.' }, { status: 400 });
        }
      } catch (err: any) {
         console.error("Gagal membaca dokumen:", err);
         return NextResponse.json({ error: 'Gagal membaca dokumen. Pastikan file tidak rusak atau terenkripsi.' }, { status: 400 });
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({ error: 'Tidak ada teks yang dapat dibaca dari dokumen ini.' }, { status: 400 });
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

    // Inisialisasi Supabase menggunakan Token User untuk RLS
    const authHeader = request.headers.get('Authorization') || '';
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
