import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public API routes (no auth required)
  const publicApiRoutes = ['/api/auth', '/api/public'];
  const isPublicApi = publicApiRoutes.some(route => pathname.startsWith(route));

  if (isPublicApi) {
    return NextResponse.next();
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/menu', '/api/restaurants', '/api/categories', '/api/dishes'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Avoid verifying JWT in middleware (Edge runtime).
    // Only check that a session cookie exists. Full verification happens in server handlers.
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/menu/:path*', '/api/:path*'],
};
