import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, COOKIE_NAME, SessionPayload } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and public files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/uploads')
  ) {
    return NextResponse.next();
  }

  let session: SessionPayload | null = null;
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      session = await verifySessionToken(token);
    }
  } catch (err) {
    session = null;
  }

  // 1. Protect Admin Pages (/admin & /admin/*)
  if (pathname.startsWith('/admin')) {
    if (!session || session.role !== 'admin') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Student Pages (/student & /student/*)
  if (pathname.startsWith('/student')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Protect Admin API Routes (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }
  }

  // 4. Protect Student API Routes (/api/student/*)
  if (pathname.startsWith('/api/student')) {
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/student/:path*', '/api/admin/:path*', '/api/student/:path*'],
};
