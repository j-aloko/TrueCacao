import { randomUUID } from 'crypto';

import { NextResponse } from 'next/server';

export async function GET() {
  const csrfToken = randomUUID();
  const response = NextResponse.json({ csrfToken }, { status: 200 });

  // Store CSRF token in an HTTP-only cookie
  response.cookies.set('csrfToken', csrfToken, {
    httpOnly: true,
    maxAge: 60 * 60,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
