import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/images', '/favicon.ico'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files, Next.js internal paths, and public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'))
  ) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get('cimcim_auth_session')?.value;

  if (!sessionCookie) {
    // If it's an API request, return 401 Unauthorized JSON
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi diperlukan. Sesi tidak ditemukan.' },
        { status: 401 }
      );
    }

    // Redirect web requests to login page
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting /login, redirect to dashboard
  if (pathname === '/login') {
    const dashboardUrl = new URL('/', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
