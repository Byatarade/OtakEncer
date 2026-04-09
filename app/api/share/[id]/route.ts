import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    
    // Bypass RLS dengan Service Role Key jika ada. Jika tidak ada, pakai ANON_KEY.
    // Jika RLS user ketat (harus mengecek session), penggunaan ANON_KEY saja mungkin gagal tanpa session,
    // di mana Anda perlu memasukkan SUPABASE_SERVICE_ROLE_KEY ke .env Anda.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey!
    );

    const { data, error } = await supabase
      .from('materials')
      .select('id, title, source_type, ai_summary, created_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error("Supabase Share Error:", error);
      return NextResponse.json({ error: 'Materi tidak ditemukan atau bersifat pribadi.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
