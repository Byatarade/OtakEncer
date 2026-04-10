import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format, differenceInDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export async function POST(request: Request) {
  try {
    const { material_id, score, user_id, user_name, user_avatar } = await request.json();
    const authHeader = request.headers.get('Authorization') || '';
    
    // Konfigurasi Supabase
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

    // 1. Dapatkan Waktu Jakarta Saat Ini
    const tz = 'Asia/Jakarta';
    const nowJakarta = toZonedTime(new Date(), tz);
    const todayStr = format(nowJakarta, 'yyyy-MM-dd'); // e.g., "2024-05-20"

    // 2. Simpan atau Update Quiz Score (opsional, jika masih butuh data quiz)
    const calculatedScore = score * 20;
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

    // 3. Logika Streak
    // Ambil data streak terakhir user
    let newStreak = 1;
    let isStreakUpdated = false;

    const { data: streakData, error: streakError } = await supabase
      .from('user_streaks')
      .select('current_streak, last_quiz_date')
      .eq('user_id', user_id)
      .single();

    if (streakError && streakError.code !== 'PGRST116') {
      console.error('Error fetching streak:', streakError);
    } 

    if (streakData && streakData.last_quiz_date) {
      // Hitung selisih hari dengan mengabaikan waktu jam/menit (midnight to midnight)
      // Kita parsi ulang agar pure T00:00:00
      const todayDateObj = new Date(todayStr + "T00:00:00");
      const lastDateObj = new Date(streakData.last_quiz_date + "T00:00:00");
      
      const diffDays = differenceInDays(todayDateObj, lastDateObj);

      if (diffDays === 0) {
        // Hari ini sudah mengerjakan quiz, streak tetap
        newStreak = streakData.current_streak;
      } else if (diffDays === 1) {
        // Mengerjakan hari berikutnya, streak bertambah
        newStreak = streakData.current_streak + 1;
        isStreakUpdated = true;
      } else if (diffDays > 1) {
        // Putus streak (lebih dari 1 hari), reset ke 1
        newStreak = 1;
        isStreakUpdated = true;
      }
    } else {
      // Pertama kali mengerjakan, streak = 1
      isStreakUpdated = true;
    }

    // Upsert Data Streak Baru
    const { error: updateStreakError } = await supabase
      .from('user_streaks')
      .upsert({
        user_id: user_id,
        user_name: user_name || 'Pelajar Pintar',
        user_avatar: user_avatar || null,
        current_streak: newStreak,
        last_quiz_date: todayStr // Simpan format string YYYY-MM-DD
      }, { onConflict: 'user_id' });

    if (updateStreakError) {
       console.error('Error upsert streak:', updateStreakError);
    }

    return NextResponse.json({ 
      message: isStreakUpdated 
        ? `Kamu berhasil mendapatkan Streak ${newStreak} Hari berturut-turut! 🔥` 
        : `Mantap! Quiz selesai. Lanjutkan besok buat ningkatin Streak kamu ya!`,
      streak: newStreak,
      added: true 
    });

  } catch (error: unknown) {
    console.error('Submit Quiz API Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
