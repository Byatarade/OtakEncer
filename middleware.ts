import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasUser = request.cookies.has('otak_auth');
  const path = request.nextUrl.pathname;

  // Redirect users who are already logged in automatically to their dashboard.
  // This executes on the server (Edge), so there will be zero client-side layout flashing.
  if (hasUser && (path === '/' || path === '/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Ensure the proxy only processes top-level routing where redirect matters.
export const config = {
  matcher: ['/', '/login'],
};