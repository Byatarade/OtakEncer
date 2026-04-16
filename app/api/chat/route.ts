import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize the Groq client (requires GROQ_API_KEY in .env)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
});

// System prompt to explicitly instruct brevity to save tokens
const systemPrompt = `Anda adalah Chatneura, Asisten AI cerdas serbabisa. Anda diizinkan untuk menjawab pertanyaan APAPUN dari pengguna secara luas dan luas layaknya ChatGPT atau Gemini.

BATASAN PENTING (HEMAT TOKEN):
- Anda HARUS memberikan jawaban yang sangat singkat, padat, dan *to the point*.
- Hindari kalimat bertele-tele atau pengulangan yang tidak perlu.
- Gunakan bahasa Indonesia.
- Jangan melebihi sekitar 2 paragraf per respons kecuali hal itu mutlak diperlukan untuk kejelasan.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const history: Array<{ sender?: unknown; text?: unknown }> = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message terlalu panjang (maks 2000 karakter).' }, { status: 400 });
    }

    if (history.length > 20) {
      return NextResponse.json({ error: 'Riwayat chat terlalu panjang (maks 20 item).' }, { status: 400 });
    }

    // Format chat history for Groq
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...history
        .filter((m: { sender?: unknown; text?: unknown }) => typeof m === 'object' && m !== null)
        .map((m: { sender?: unknown; text?: unknown }) => {
          const sender = (m as { sender?: unknown }).sender;
          const text = (m as { text?: unknown }).text;
          const safeText = typeof text === 'string' ? text.slice(0, 1000) : '';
          return {
            role: sender === 'user' ? 'user' : 'assistant',
            content: safeText
          };
        })
        .filter((m) => m.content.length > 0),
      { role: 'user', content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: chatMessages as never,
      model: "llama-3.3-70b-versatile", // Using a solid Groq model
      temperature: 0.7,
      max_completion_tokens: 300, // Reduced to prevent high token usage per response
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Maaf, saya tidak memahami pertanyaan tersebut.";

    return NextResponse.json({ reply });

  } catch (error: unknown) {
    console.error("AI Chat API Error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: 'Failed to process AI chat. Pastikan API Key di konfigurasi dengan benar.' },
      { status: 500 }
    );
  }
}
