import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access-token')?.value || '';
  const isAuth = !!token;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  if (!isAuth && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && isLoginPage) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = '/';
    homeUrl.search = '';
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api|static).*)'],
};
