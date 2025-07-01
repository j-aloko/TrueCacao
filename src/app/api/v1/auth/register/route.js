import { NextResponse } from 'next/server';

import { createUser } from '@/lib/auth/user-service';
import { validateRegistration } from '@/lib/auth/validators';

export async function POST(request) {
  try {
    const {
      email,
      password,
      name,
      role = 'CUSTOMER',
    } = await validateRegistration(request);
    const user = await createUser(email, password, name, role);

    return NextResponse.json(
      { message: 'User created. Verification email sent.', user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
