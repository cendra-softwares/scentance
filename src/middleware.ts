import { getSessionCookie } from 'better-auth/cookies';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Cheap edge guard: only checks that a Better Auth session cookie exists.
 *
 * The cookie is opaque here (no secret, no DB access in middleware), so the
 * real session validation and the admin-role check happen server-side in
 * `src/app/dashboard/layout.tsx` and the dashboard pages.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.search = '';
      redirectUrl.searchParams.set('redirectedFrom', `${pathname}${search}`);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
