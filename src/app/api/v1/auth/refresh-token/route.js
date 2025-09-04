import { NextResponse } from 'next/server';

import { verifyRefreshToken, generateAccessToken } from '@/lib/auth/jwt';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Missing refresh token' },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(refreshToken);

    // Validate session still active
    const session = await prisma.session.findFirst({
      where: {
        expiresAt: { gt: new Date() },
        id: payload.sessionId,
        userId: payload.userId,
      },
    });

    if (!session) {
      return NextResponse.json({ message: 'Session expired' }, { status: 403 });
    }

    const newAccessToken = await generateAccessToken({
      role: payload.role,
      sessionId: payload.sessionId,
      userId: payload.userId,
    });

    const response = NextResponse.json(
      { message: 'Token refreshed' },
      { status: 200 }
    );
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: 900,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 403 });
  }
}
