import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { name, avatar } = await request.json();
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    // Initialize Supabase with service role to bypass potential RLS update restrictions, 
    // but ONLY after verifying the user's token.
    const supabaseAnon = createClient(
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

    // Verify user
    const { data: { user }, error: authError } = await supabaseAnon.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use service role to forcefully update user_streaks (bypassing any RLS policies missing 'update')
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update user_streaks
    const { error: streakError } = await supabaseAdmin.from('user_streaks')
      .update({ user_name: name, user_avatar: avatar })
      .eq('user_id', user.id);

    if (streakError) {
      console.error('Error updating user_streaks:', streakError);
      return NextResponse.json({ error: streakError.message }, { status: 500 });
    }

    // Update quiz_scores as well just in case
    await supabaseAdmin.from('quiz_scores')
      .update({ user_name: name, user_avatar: avatar })
      .eq('user_id', user.id);

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
