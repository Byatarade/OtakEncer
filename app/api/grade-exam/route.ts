import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

      if (!groqRes.ok) {
        const failErr = await groqRes.text();
        throw new Error(`Gemini & Groq keduanya gagal menilai essay: ${failErr}`);
      }

      const groqData = await groqRes.json();
      let aiOutput = groqData.choices[0].message.content.trim();

      if (aiOutput.startsWith('```json')) {
        aiOutput = aiOutput.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (aiOutput.startsWith('```')) {
        aiOutput = aiOutput.replace(/^```/, '').replace(/```$/, '').trim();
      }

      essayGrades = JSON.parse(aiOutput);
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
