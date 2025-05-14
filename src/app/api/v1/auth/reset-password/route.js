import { NextResponse } from 'next/server';

import { initiatePasswordReset } from '@/lib/auth/password-reset';
import { validatePasswordReset } from '@/lib/auth/validators';

export async function POST(request) {
  try {
    const { email } = await validatePasswordReset(request);
    await initiatePasswordReset(email);

    return NextResponse.json(
      {
        message:
          'If an account exists with this email, a reset link has been sent',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
