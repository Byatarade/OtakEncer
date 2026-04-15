import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

    let aiOutput = '';
    let geminiSuccess = false;

    // 1. Coba Gemini dulu (Utama)
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const aiResult = await model.generateContent(prompt);
      aiOutput = aiResult.response.text().trim();
      geminiSuccess = true;
    } catch (geminiError: unknown) {
      console.warn("Gemini Error in generate-interactive, fallback to Groq:", geminiError);
    }

    if (!geminiSuccess) {
      // 2. Fallback Lapis 1: Groq
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
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2
          })
        });

        if (groqRes.ok) {
           const groqData = await groqRes.json();
           aiOutput = groqData.choices[0].message.content.trim();
           groqSuccess = true;
        } else {
           console.warn("Groq failed with status:", groqRes.status);
        }
      } catch (e) {
        console.warn("Groq fetch error in generate-interactive:", e);
      }

      if (!groqSuccess) {
         // 3. Fallback Lapis 2: OpenRouter
         console.log("=== GROQ SIBUK, FALLBACK KE OPENROUTER (INTERACTIVE) ===");
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
               messages: [{ role: 'user', content: prompt }],
               temperature: 0.2
             })
           });
           
           if (orRes.ok) {
              const orData = await orRes.json();
              aiOutput = orData.choices[0].message.content.trim();
              orSuccess = true;
           } else {
              console.warn("OpenRouter failed with status:", orRes.status);
           }
         } catch(e) { console.warn("OpenRouter fetch error:", e); }

         if (!orSuccess) {
            // 4. Fallback Lapis 3: DeepSeek
            console.log("=== OPENROUTER SIBUK, FALLBACK KE DEEPSEEK (INTERACTIVE) ===");
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
                  messages: [{ role: 'user', content: prompt }],
                  temperature: 0.2
                })
              });
              
              if (dsRes.ok) {
                 const dsData = await dsRes.json();
                 aiOutput = dsData.choices[0].message.content.trim();
                 dsSuccess = true;
              } else {
                 console.warn("DeepSeek failed with status:", dsRes.status);
              }
            } catch(e) { console.warn("DeepSeek fetch error:", e); }

            if (!dsSuccess) {
               // 5. Fallback Lapis 4 (Terakhir): Hugging Face
               console.log("=== DEEPSEEK SIBUK, FALLBACK TERAKHIR KE HUGGING FACE (INTERACTIVE) ===");
               const hfRes = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1/chat/completions', {
                 method: 'POST',
                 headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
                 },
                 body: JSON.stringify({
                   model: 'Qwen/Qwen2.5-72B-Instruct',
                   messages: [{ role: 'user', content: prompt }],
                   temperature: 0.2
                 })
               });
               
               if (!hfRes.ok) {
                  const errText = await hfRes.text();
                  throw new Error("Gagal generate dari 5 server AI (Gemini, Groq, OpenRouter, DeepSeek, HuggingFace): " + errText);
               }
               const hfData = await hfRes.json();
               aiOutput = hfData.choices[0].message.content.trim();
            }
         }
      }
    }

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
