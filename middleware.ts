import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge Middleware — protects /admin/* routes with session cookie validation.
 * If the user doesn't have a valid 'sk_admin_session' cookie, they are
 * redirected to /admin/login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except the login page and auth API)
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/api/admin/auth')
  ) {
    const sessionCookie = request.cookies.get('sk_admin_session')?.value;
    const expectedToken = process.env.ADMIN_SESSION_SECRET;

    if (!sessionCookie || !expectedToken || sessionCookie !== expectedToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
