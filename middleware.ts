import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Ambil user auth status 
  // (Lebih cepat dan tidak terhalang UI lambat pada Browser)
  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/library') || request.nextUrl.pathname.startsWith('/settings');
  const isProtectedApi = request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/api/share'); // kita buka share untuk diliat publik (opsional)

  // Jika USER SUDAH LOGIN tapi mencoba masuk ke halaman /login atau /register
  if (isAuthPage && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  // Jika USER BELUM LOGIN dan mencoba memaksa masuk ke /dashboard atau route rahasia
  if (isProtectedPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login'; 
    return NextResponse.redirect(loginUrl);
  }

  // Jika memanggil Protected API tanpa token/login session
  if (isProtectedApi && !user) {
    return NextResponse.json({ error: 'Unauthorized | Harap Login Dulu' }, { status: 401 });
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Mencegah middleware dieksekusi pada:
     * - Gambar (assets, public)
     * - Next.js internal /_next/ (build output)
     * Agar aplikasi tetap nge-but dan optimal
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
