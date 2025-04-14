import { NextResponse } from 'next/server';

import { createUser } from '@/lib/auth/user-service';
import { validateRegistration } from '@/lib/auth/validators';

export async function POST(request) {
  try {
    const { email, password, name } = await validateRegistration(request);
    const user = await createUser(email, password, name);

    return NextResponse.json(
      { message: 'User created. Verification email sent.' },
      { status: 201 },
      { user }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
