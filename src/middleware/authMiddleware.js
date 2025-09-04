import { NextResponse } from 'next/server';

import { ROUTES } from '@/constants/routes';

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // List of protected routes
  const protectedRoutes = [ROUTES.account, ROUTES.checkout, ROUTES.settings];

  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !accessToken &&
    !refreshToken
  ) {
    const redirectUrl = new URL(ROUTES.login, request.url);
    redirectUrl.searchParams.set(
      'redirect',
      pathname + searchParams.toString()
    );
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/account/:path*',
    '/cart/checkout/:path*',
    '/account/settings/:path*',
  ],
};
