import { NextResponse } from 'next/server';

import { verifyRefreshToken } from '@/lib/auth/jwt';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { message: 'No active session found' },
        { status: 400 }
      );
    }

    // Verify refresh token to get session and user details
    const payload = await verifyRefreshToken(refreshToken);
    const { sessionId, userId } = payload;

    // Invalidate the session in the database
    await prisma.$transaction([
      prisma.session.update({
        data: { expiresAt: new Date() },
        where: { id: sessionId, userId },
      }),
      prisma.auditLog.create({
        data: {
          action: 'LOGOUT',
          createdAt: new Date(),
          details: {
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          },
          model: 'Session',
          modelId: sessionId,
          userId,
        },
      }),
    ]);

    // Expire cookies
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    response.cookies.set('accessToken', '', {
      httpOnly: true,
      maxAge: 0,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      maxAge: 0,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
