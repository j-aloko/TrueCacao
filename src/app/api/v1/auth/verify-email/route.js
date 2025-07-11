import { NextResponse } from 'next/server';

import { verifyUserEmail } from '@/lib/auth/user-service';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const encryptedUserId = searchParams.get('encryptedUserId');

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    if (!encryptedUserId) {
      return NextResponse.json(
        { message: 'UserId is required' },
        { status: 400 }
      );
    }

    const user = await verifyUserEmail(token, encryptedUserId);
    return NextResponse.json(
      { message: 'Email verified successfully', user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
