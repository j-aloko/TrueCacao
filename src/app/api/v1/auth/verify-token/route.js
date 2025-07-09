import { NextResponse } from 'next/server';

import { verifyToken } from '@/lib/auth/user-service';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    const tokenRecord = await verifyToken(token);

    return NextResponse.json(
      { message: 'Token verified successfully', tokenRecord },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
