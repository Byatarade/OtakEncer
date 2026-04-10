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
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Format chat history for Groq
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m: { sender: string; text: string }) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      })),
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
