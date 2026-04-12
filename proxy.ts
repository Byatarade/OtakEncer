import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
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

  // Ambil user auth status langsung dari session HTTP cookies
  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/library') || request.nextUrl.pathname.startsWith('/settings');
  const isProtectedApi = request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/api/share');
  const view = request.nextUrl.searchParams.get('view');

  // Logic dari proxy bawaan: Redirect to dashboard on root domain if logged in, unless requested landing page
  if (user && request.nextUrl.pathname === '/' && view !== 'landing') {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  // Jika USER SUDAH LOGIN tapi mencoba masuk ke halaman /login atau /register
  if (isAuthPage && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  // Jika USER BELUM LOGIN dan mencoba memaksa masuk ke rute rahasia
  if (isProtectedPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login'; 
    return NextResponse.redirect(loginUrl);
  }

  // Jika memanggil Protected API tanpa token session
  if (isProtectedApi && !user) {
    return NextResponse.json({ error: 'Unauthorized | Harap Login Dulu' }, { status: 401 });
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Mencegah proxy dieksekusi pada file statis:
     * - /_next/static, /_next/image, favicon.ico, images dsb.
     * Supaya performa aplikasi tetap nge-but.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};