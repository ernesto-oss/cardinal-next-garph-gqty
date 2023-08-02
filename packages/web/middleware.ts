import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth, SESSION_COOKIE_NAME } from '@acme/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (authCookie) {
      const session = await auth.getSession(authCookie.value);
      if (session)
        return NextResponse.redirect(new URL('/protected', request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith('/protected')) {
    if (!authCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    } else if (authCookie) {
      const session = await auth.getSession(authCookie.value);
      if (!session)
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}
