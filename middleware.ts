import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

export function middleware(request: NextRequest) {
  // Get token from multiple sources
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Protected routes
  const protectedPaths = ['/dashboard', '/admin'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Skip middleware for auth-related routes to avoid loops
  const authPaths = ['/auth/signin', '/auth/signup', '/api/auth'];
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAuthPath) {
    return NextResponse.next();
  }

  if (isProtectedPath) {
    if (!token) {
      // Redirect to sign in if no token
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Role-based access control - simplified logic
      if (request.nextUrl.pathname.startsWith('/admin') && decoded.role !== 'ADMIN') {
        // Non-admin trying to access admin area - redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // For admin users accessing dashboard, redirect to admin
      if (request.nextUrl.pathname === '/dashboard' && decoded.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }

      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('user-id', decoded.userId);
      requestHeaders.set('user-role', decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Invalid token, redirect to sign in
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/pets/my-pets/:path*',
  ],
};