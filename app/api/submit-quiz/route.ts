import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { material_id, score, user_id, user_name, user_avatar } = await request.json();
    const authHeader = request.headers.get('Authorization') || '';
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options) => {
            const headers = new Headers(options?.headers);
            if (authHeader) headers.set('Authorization', authHeader);
            return fetch(url, { ...options, headers });
          }
        }
      }
    );

    // Kita abaikan pengecekan duplikat sebelumnya sesuai request, agar skor baru bisa langsung tertimpa/masuk
    const calculatedScore = score * 20;

    // Pakai upsert agar kalau material sama, nilainya cukup diperbarui tanpa error unique constraint
    const { error: insertError } = await supabase
      .from('quiz_scores')
      .upsert({
        user_id: user_id,
        material_id: material_id,
        score: calculatedScore,
        user_name: user_name || 'Pelajar Pintar',
        user_avatar: user_avatar || null
      }, { onConflict: 'user_id, material_id' });

    if (insertError) {
      console.error('Error insert/upsert quiz_scores:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: `Mantap! +${calculatedScore} Poin berhasil masuk ke Leaderboard!`,
      added: true 
    });

  } catch (error: unknown) {
    console.error('Submit Quiz API Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
