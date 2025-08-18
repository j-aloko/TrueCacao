import Cookies from 'js-cookie';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const csrfToken = uuidv4();
  Cookies.set('csrfToken', csrfToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  return NextResponse.json({ csrfToken });
}
