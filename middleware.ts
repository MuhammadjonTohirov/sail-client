import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Gracefully handle legacy /uz and /ru prefixed URLs by redirecting them
// to the canonical, locale-agnostic routes.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/uz') {
    const url = req.nextUrl.clone();
    url.pathname = '/search';
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith('/uz/')) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/uz/, '') || '/';
    return NextResponse.redirect(url);
  }
  if (pathname === '/ru') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith('/ru/')) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/ru/, '') || '/';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/uz', '/uz/:path*', '/ru', '/ru/:path*'],
};
