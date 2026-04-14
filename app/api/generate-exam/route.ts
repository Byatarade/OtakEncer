import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { material_id, user_id } = await request.json();
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

    // LIMIT CHECK: Maksimal 2x generate exam per hari
    if (!user_id) {
       return NextResponse.json({ error: 'User ID tidak valid.' }, { status: 400 });
    }

    const { data: streakData, error: streakError } = await supabase
      .from('user_streaks')
      .select('exam_gen_count, last_exam_gen_date')
      .eq('user_id', user_id)
      .single();

    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }); // YYYY-MM-DD
    let currentLimitCount = 0;

    if (!streakError && streakData) {
      if (streakData.last_exam_gen_date === todayStr) {
        currentLimitCount = streakData.exam_gen_count || 0;
      }
    }

    if (currentLimitCount >= 2) {
      return NextResponse.json({ 
        error: 'LIMIT_REACHED', 
        message: 'Batas harian pembuatan ulang prediksi soal ujian (2x sehari) telah tercapai. Harap kembali besok!' 
      }, { status: 429 });
    }

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

    // Ambil 20.000 karakter agar AI punya cukup konteks untuk 30 soal
    const safeText = summary.substring(0, 20000);

    const systemPrompt = `Anda adalah seorang dosen/guru profesional yang expert dalam membuat soal ujian.
Berdasarkan materi terlampir, buatlah PREDIKSI SOAL UJIAN lengkap dengan format sebagai berikut:

A. 20 soal PILIHAN GANDA (A, B, C, D) dengan tingkat kesulitan bervariasi:
   - 5 soal mudah (mengingat/recall)
   - 10 soal sedang (pemahaman/aplikasi)
   - 5 soal sulit (analisis/evaluasi)

B. 10 soal ESSAY yang menguji pemahaman mendalam dan kemampuan analisis

ATURAN KETAT:
1. Output HARUS berupa JSON Object MURNI tanpa teks tambahan apa pun
2. DILARANG keras menggunakan backtick, tag markdown, atau wrapper apa pun
3. Soal harus berbahasa Indonesia yang baik dan benar
4. Setiap opsi pilihan ganda harus dimulai dengan "A. ", "B. ", "C. ", atau "D. "
5. Jawaban benar di field "answer" harus sama persis dengan salah satu opsi
6. key_points harus berisi 3-5 poin penilaian utama untuk jawaban essay

Format JSON yang HARUS diikuti:
{"mcq":[{"no":1,"question":"Teks soal?","options":["A. Opsi pertama","B. Opsi kedua","C. Opsi ketiga","D. Opsi keempat"],"answer":"A. Opsi pertama","explanation":"Penjelasan mengapa jawaban ini benar"}],"essay":[{"no":1,"question":"Jelaskan tentang...?","key_points":"1. Poin pertama 2. Poin kedua 3. Poin ketiga"}]}`;

    const prompt = `${systemPrompt}\n\nMateri acuan:\n---\n${safeText}\n---`;

    let aiOutput = '';

    // Coba Gemini dulu (AI Utama)
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const aiResult = await model.generateContent(prompt);
      aiOutput = aiResult.response.text();
    } catch (geminiError: unknown) {
      const errMsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
      const errStatus = (geminiError as { status?: number })?.status;
      console.warn("Gemini API Error for exam generation, attempting Groq fallback:", errMsg);

      const isRecoverable = errStatus === 503 || errMsg.includes('503') || errMsg.includes('demand') || errMsg.includes('overloaded');

      if (isRecoverable || errMsg.includes('GenerateContent')) {
        console.log("=== FALLBACK OTOMATIS KE GROQ UNTUK GENERATE EXAM ===");

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 8000
          })
        });

        if (!groqRes.ok) {
          const failErr = await groqRes.text();
          throw new Error(`Gemini sibuk & Groq juga gagal: ${failErr}`);
        }

        const groqData = await groqRes.json();
        aiOutput = groqData.choices[0].message.content;
      } else {
        throw geminiError;
      }
    }

    // Sanitasi output dari kemungkinan tag markdown
    aiOutput = aiOutput.trim();
    if (aiOutput.startsWith('```json')) {
      aiOutput = aiOutput.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (aiOutput.startsWith('```')) {
      aiOutput = aiOutput.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsedData = JSON.parse(aiOutput);

    // Validasi struktur JSON
    if (!parsedData.mcq || !Array.isArray(parsedData.mcq) || !parsedData.essay || !Array.isArray(parsedData.essay)) {
      throw new Error('Format output AI tidak valid. Silakan coba lagi.');
    }

    // Simpan ke Supabase (kolom ai_exam harus ada sebagai jsonb)
    const { error: updateError } = await supabase
      .from('materials')
      .update({ ai_exam: parsedData })
      .eq('id', material_id);

    if (updateError) {
      // Tidak throw - data tetap dikembalikan ke frontend meskipun cache ke DB gagal
      console.error("Gagal menyimpan prediksi ujian ke Supabase:", updateError);
    }

    // UPDATE EXAM LIMIT COUNT
    const newCount = currentLimitCount + 1;
    await supabase.from('user_streaks').upsert({
      user_id: user_id,
      exam_gen_count: newCount,
      last_exam_gen_date: todayStr
    }, { onConflict: 'user_id' });

    return NextResponse.json({ success: true, data: parsedData });

  } catch (error: unknown) {
    console.error('Generate Exam API Error:', error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan internal server.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
