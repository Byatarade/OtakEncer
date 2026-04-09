import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { material_id, type } = await request.json();
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

    // Dapatkan rangkuman material dari Supabase
    const { data: material, error: fetchError } = await supabase
      .from('materials')
      .select('ai_summary')
      .eq('id', material_id)
      .single();

    if (fetchError || !material) {
      return NextResponse.json({ error: 'Materi tidak ditemukan' }, { status: 404 });
    }

    const summary = material.ai_summary || "";
    if (summary.trim().length === 0) {
       return NextResponse.json({ error: 'Tidak ada teks rangkuman materi untuk diolah.' }, { status: 400 });
    }

    // Ambil 15.000 karakter agar tidak melampaui token limit Groq
    const safeText = summary.substring(0, 15000);

    let systemPrompt = "";
    if (type === 'quiz') {
      systemPrompt = `Anda adalah asisten AI pembuat soal pilihan ganda interaktif. 
Berdasarkan materi terlampir, buatlah 5 soal pilihan ganda (A, B, C, D) berbahasa Indonesia.
PENTING: Output HARUS eksak murni JSON Array tanpa teks awalan/akhiran apa pun. DILARANG menggunakan tag markdown \`\`\`json.
Struktur HARUS persis seperti ini: 
[{"question": "Soal pertama?", "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"], "answer": "Opsi A"}]`;
    } else if (type === 'flashcard') {
      systemPrompt = `Anda adalah asisten AI pembuat Flashcard (kartu hafal).
Berdasarkan materi terlampir, buat 10 pasang istilah kunci dan definisinya berbahasa Indonesia.
PENTING: Output HARUS eksak murni JSON Array tanpa teks awalan/akhiran apa pun. DILARANG menggunakan tag markdown \`\`\`json.
Struktur HARUS persis seperti ini:
[{"front": "Istilah/Judul", "back": "Definisi atau penjelasan"}]`;
    } else {
      return NextResponse.json({ error: 'Tipe interaktif tidak valid' }, { status: 400 });
    }

    const prompt = `${systemPrompt}\n\nMateri acuan:\n${safeText}`;

    // Menggunakan AI Groq (LLama 3.3 Versatile) agar ngebut untuk ekstraksi JSON
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2 // Temperature rendah agar JSON lebih konsisten
      })
    });

    if (!groqRes.ok) {
       const errText = await groqRes.text();
       throw new Error("Gagal generate dari Groq: " + errText);
    }

    const groqData = await groqRes.json();
    let aiOutput = groqData.choices[0].message.content.trim();

    // Sanitasi ekstra jika AI tetap bandel menyelipkan tag codeblock ```json
    if (aiOutput.startsWith('```json')) {
       aiOutput = aiOutput.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (aiOutput.startsWith('```')) {
       aiOutput = aiOutput.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(aiOutput);

    // Update kolom bersangkutan di Supabase
    const columnName = type === 'quiz' ? 'ai_quiz' : 'ai_flashcard';
    const { error: updateError } = await supabase
      .from('materials')
      .update({ [columnName]: parsedData })
      .eq('id', material_id);

    if (updateError) {
       console.error("Gagal save JSON hasil AI ke Supabase:", updateError);
    }

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: unknown) {
    console.error('Interactive API Error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat meracik AI.' }, { status: 500 });
  }
}
