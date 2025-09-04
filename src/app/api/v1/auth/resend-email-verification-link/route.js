import { NextResponse } from 'next/server';

import { resendVerification } from '@/lib/auth/user-service';

export async function POST(request) {
  try {
    const { email } = await request.json();
    const user = await resendVerification(email);
    return NextResponse.json(
      { message: 'Verification email resent', user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
