import { NextResponse } from 'next/server';

import { mergeCarts } from '@/lib/cart/utils';

export async function POST(request) {
  const { sessionId } = await request.json();
  const userId = await request.headers.get('x-user-id');

  try {
    const mergedCart = await mergeCarts(sessionId, userId);
    return NextResponse.json(mergedCart);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.message === 'Guest cart not found' ? 404 : 400 }
    );
  }
}
