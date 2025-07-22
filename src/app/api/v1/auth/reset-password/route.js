import { NextResponse } from 'next/server';

import { completePasswordReset } from '@/lib/auth/password-reset';
import { validateNewPassword } from '@/lib/auth/validators';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }
    const { password } = await validateNewPassword(request);
    const user = await completePasswordReset(token, password);

    return NextResponse.json(
      { message: 'Password changed successfully', user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
