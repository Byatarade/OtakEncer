import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ExamMCQ {
  no: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface ExamEssay {
  no: number;
  question: string;
  key_points: string;
}

export async function POST(request: Request) {
  try {
    const { material_summary, exam_data, mcq_answers, essay_answers } = await request.json();
    const authHeader = request.headers.get('Authorization') || '';
    const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!accessToken) {
      return NextResponse.json({ error: 'Akses ditolak. Token tidak valid.' }, { status: 401 });
    }

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

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return NextResponse.json({ error: 'Akses ditolak. Harap login ulang.' }, { status: 401 });
    }

    if (typeof material_summary !== 'string' || material_summary.trim().length === 0) {
      return NextResponse.json({ error: 'Ringkasan materi tidak valid.' }, { status: 400 });
    }

    if (material_summary.length > 50000) {
      return NextResponse.json({ error: 'Ringkasan materi terlalu panjang.' }, { status: 400 });
    }

    if (!exam_data || !Array.isArray(exam_data.mcq) || !Array.isArray(exam_data.essay)) {
      return NextResponse.json({ error: 'Data ujian tidak valid.' }, { status: 400 });
    }

    if (!mcq_answers || typeof mcq_answers !== 'object' || !essay_answers || typeof essay_answers !== 'object') {
      return NextResponse.json({ error: 'Jawaban ujian tidak valid.' }, { status: 400 });
    }

    if (exam_data.mcq.length > 40 || exam_data.essay.length > 20) {
      return NextResponse.json({ error: 'Jumlah soal melebihi batas aman.' }, { status: 400 });
    }

    // 1. Auto-grade MCQ (tidak perlu AI - cukup bandingkan jawaban)
    let mcqCorrect = 0;
    const mcqResults = exam_data.mcq.map((q: ExamMCQ, i: number) => {
      const userAnswer = mcq_answers[i] || '';
      const isCorrect = userAnswer === q.answer;
      if (isCorrect) mcqCorrect++;
      return {
        no: q.no,
        question: q.question,
        options: q.options,
        userAnswer,
        correctAnswer: q.answer,
        isCorrect,
        explanation: q.explanation
      };
    });

    // 2. Grade Essay dengan AI (butuh analisis mendalam)
    const essayItems = exam_data.essay.map((q: ExamEssay, i: number) =>
      `SOAL ${q.no}: ${q.question}\nPANDUAN PENILAIAN: ${q.key_points}\nJAWABAN SISWA: ${essay_answers[i] || '(Tidak dijawab)'}`
    ).join('\n\n---\n\n');

    const essayPrompt = `Anda adalah seorang dosen/guru profesional yang sedang menilai jawaban ujian essay siswa.
Berikan penilaian yang OBJEKTIF, ADIL, dan KONSTRUKTIF.

Konteks Materi:
${(material_summary || '').substring(0, 10000)}

Soal dan Jawaban:
${essayItems}

ATURAN KETAT:
1. Output HARUS berupa JSON Array MURNI tanpa teks tambahan
2. DILARANG menggunakan backtick, tag markdown, atau wrapper
3. Skor 0-10 per soal
4. Feedback harus spesifik, konstruktif dan membantu pembelajaran
5. Jika jawaban kosong/tidak dijawab, beri skor 0 dengan feedback yang sesuai

Kriteria skor:
- 0: Tidak dijawab atau tidak relevan sama sekali
- 1-3: Jawaban sangat kurang, hanya menyinggung sedikit
- 4-5: Jawaban cukup tapi banyak kekurangan penting
- 6-7: Jawaban baik, mencakup sebagian besar poin
- 8-9: Jawaban sangat baik dan komprehensif
- 10: Jawaban sempurna, melebihi ekspektasi

Format output:
[{"no":1,"score":8,"maxScore":10,"feedback":"Penjelasan detail kualitas jawaban"}]`;

    let essayGrades: { no: number; score: number; maxScore: number; feedback: string }[] = [];

    // Coba Gemini dulu (utama)
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const aiResult = await model.generateContent(essayPrompt);
      let aiOutput = aiResult.response.text().trim();

      if (aiOutput.startsWith('```json')) {
        aiOutput = aiOutput.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (aiOutput.startsWith('```')) {
        aiOutput = aiOutput.replace(/^```/, '').replace(/```$/, '').trim();
      }

      essayGrades = JSON.parse(aiOutput);
    } catch (geminiError: unknown) {
      const errMsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
      console.warn("Gemini grading failed, fallback to Groq:", errMsg);

      // Fallback ke Groq
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
            messages: [{ role: 'user', content: essayPrompt }],
            temperature: 0.2,
            max_tokens: 4000
          })
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          let groqOutput = groqData.choices[0].message.content.trim();
          if (groqOutput.startsWith('```json')) {
            groqOutput = groqOutput.replace(/^```json/, '').replace(/```$/, '').trim();
          } else if (groqOutput.startsWith('```')) {
            groqOutput = groqOutput.replace(/^```/, '').replace(/```$/, '').trim();
          }
          essayGrades = JSON.parse(groqOutput);
          groqSuccess = true;
        } else {
           console.warn("Groq failed with status:", groqRes.status);
        }
      } catch (e) {
        console.warn("Groq fetch error in grade-exam:", e);
      }

      if (!groqSuccess) {
         console.log("=== GROQ SIBUK, FALLBACK KE OPENROUTER (GRADE EXAM) ===");
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
               messages: [{ role: 'user', content: essayPrompt }],
               temperature: 0.2
             })
           });
           
           if (orRes.ok) {
             const orData = await orRes.json();
             let orOutput = orData.choices[0].message.content.trim();
             if (orOutput.startsWith('```json')) {
                orOutput = orOutput.replace(/^```json/, '').replace(/```$/, '').trim();
             } else if (orOutput.startsWith('```')) {
                orOutput = orOutput.replace(/^```/, '').replace(/```$/, '').trim();
             }
             essayGrades = JSON.parse(orOutput);
             orSuccess = true;
           } else {
             console.warn("OpenRouter failed with status:", orRes.status);
           }
         } catch(e) { console.warn("OpenRouter fetch error:", e); }

         if (!orSuccess) {
            console.log("=== OPENROUTER SIBUK, FALLBACK KE DEEPSEEK (GRADE EXAM) ===");
            let dsSuccess = false;
            try {
              const dsRes = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                  model: 'deepseek-chat',
                  messages: [{ role: 'user', content: essayPrompt }],
                  temperature: 0.2
                })
              });
              
              if (dsRes.ok) {
                const dsData = await dsRes.json();
                let dsOutput = dsData.choices[0].message.content.trim();
                if (dsOutput.startsWith('```json')) {
                   dsOutput = dsOutput.replace(/^```json/, '').replace(/```$/, '').trim();
                } else if (dsOutput.startsWith('```')) {
                   dsOutput = dsOutput.replace(/^```/, '').replace(/```$/, '').trim();
                }
                essayGrades = JSON.parse(dsOutput);
                dsSuccess = true;
              } else {
                console.warn("DeepSeek failed with status:", dsRes.status);
              }
            } catch(e) { console.warn("DeepSeek fetch error:", e); }

            if (!dsSuccess) {
               console.log("=== DEEPSEEK SIBUK, FALLBACK TERAKHIR KE HUGGING FACE (GRADE EXAM) ===");
               const hfRes = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1/chat/completions', {
                 method: 'POST',
                 headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
                 },
                 body: JSON.stringify({
                   model: 'Qwen/Qwen2.5-72B-Instruct',
                   messages: [{ role: 'user', content: essayPrompt }],
                   temperature: 0.2
                 })
               });
               
               if (!hfRes.ok) {
                  const failErr = await hfRes.text();
                  throw new Error(`Semua server AI (Gemini, Groq, OpenRouter, DeepSeek, HuggingFace) sibuk: ${failErr}`);
               }
               const hfData = await hfRes.json();
               let hfOutput = hfData.choices[0].message.content.trim();
               if (hfOutput.startsWith('```json')) {
                  hfOutput = hfOutput.replace(/^```json/, '').replace(/```$/, '').trim();
               } else if (hfOutput.startsWith('```')) {
                  hfOutput = hfOutput.replace(/^```/, '').replace(/```$/, '').trim();
               }
               essayGrades = JSON.parse(hfOutput);
            }
         }
      }
    }



    // 3. Hitung skor total
    // MCQ: 50% dari total (2.5 poin per soal benar, maks 50 poin)
    const mcqScore = Math.round((mcqCorrect / 20) * 50);

    // Essay: 50% dari total (setiap soal 0-10, total 100 raw → di-scale ke maks 50 poin)
    const totalEssayRaw = essayGrades.reduce((sum: number, g) => sum + (g.score || 0), 0);
    const essayScore = Math.round((totalEssayRaw / 100) * 50);

    const totalScore = mcqScore + essayScore;

    // 4. Tentukan grade huruf
    let grade = 'E';
    if (totalScore >= 90) grade = 'A';
    else if (totalScore >= 80) grade = 'B+';
    else if (totalScore >= 70) grade = 'B';
    else if (totalScore >= 60) grade = 'C+';
    else if (totalScore >= 50) grade = 'C';
    else if (totalScore >= 40) grade = 'D';

    return NextResponse.json({
      success: true,
      result: {
        mcqResults,
        mcqCorrect,
        mcqTotal: 20,
        essayGrades,
        mcqScore,
        essayScore,
        totalScore,
        grade
      }
    });

  } catch (error: unknown) {
    console.error('Grade Exam API Error:', error);
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan saat menilai ujian.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
