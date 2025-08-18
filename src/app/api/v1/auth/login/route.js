import Cookies from 'js-cookie';
import { NextResponse } from 'next/server';

import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '@/constants/constants';
import { loginUser } from '@/lib/auth/user-service';
import { validateLogin } from '@/lib/auth/validators';

export async function POST(request) {
  try {
    const csrfToken = request.headers.get('X-CSRF-Token');
    const storedCsrfToken = Cookies.get('csrfToken');
    if (csrfToken !== storedCsrfToken) {
      return NextResponse.json(
        { message: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    const { email, password } = await validateLogin(request);
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const { user, accessToken, refreshToken } = await loginUser({
      email,
      ipAddress,
      password,
      userAgent,
    });

    const response = NextResponse.json({ user }, { status: 200 });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_MAX_AGE, // 1 hour
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_MAX_AGE, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
