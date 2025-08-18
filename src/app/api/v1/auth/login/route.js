import { NextResponse } from 'next/server';

import { loginUser } from '@/lib/auth/user-service';

export async function POST(request) {
  try {
    // Validate CSRF token
    const csrfToken = request.headers.get('X-CSRF-Token');
    const storedCsrfToken = request.cookies.get('csrfToken')?.value;
    if (!csrfToken || csrfToken !== storedCsrfToken) {
      return NextResponse.json(
        { code: 'INVALID_CSRF_TOKEN', message: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    const { email, password } = await request.json();
    const user = await loginUser({ email, password });
    const response = NextResponse.json(
      { message: 'Logged in successfully', user },
      { status: 200 }
    );

    response.cookies.set('accessToken', user.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60,
      // 15 minutes
      path: '/',

      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    response.cookies.set('refreshToken', user.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      // 7 days
      path: '/',

      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { code: error.cause || 'UNKNOWN_ERROR', message: error.message },
      { status: 400 }
    );
  }
}
