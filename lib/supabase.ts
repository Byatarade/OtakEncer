import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Mengubah dari vanilla createClient ke createBrowserClient untuk sinkronisasi cookie SSR
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
