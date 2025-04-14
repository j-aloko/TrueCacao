import { NextResponse } from 'next/server';

import { verifyPassword } from '@/lib/auth/security';
import { createSession } from '@/lib/auth/session-service';
import { validateLogin } from '@/lib/auth/validators';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { email, password } = await validateLogin(request);
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) throw new Error('Invalid credentials');

    if (!user.verified) throw new Error('Please verify your email first');

    const { accessToken, refreshToken } = await createSession(
      user,
      ipAddress,
      userAgent
    );

    const response = NextResponse.json(
      {
        user: {
          email: user.email,
          id: user.id,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 900,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', // 15 minutes
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 604800,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
