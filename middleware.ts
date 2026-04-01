import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasUser = request.cookies.has('otak_auth');
  const path = request.nextUrl.pathname;
  const view = request.nextUrl.searchParams.get('view');

  // Redirect users who are already logged in from login page to their dashboard.
  if (hasUser && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to dashboard on root domain if logged in, unless explicitly requested landing page
  if (hasUser && path === '/' && view !== 'landing') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Ensure the proxy only processes top-level routing where redirect matters.
export const config = {
  matcher: ['/', '/login'],
};