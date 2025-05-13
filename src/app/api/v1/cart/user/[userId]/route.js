import { NextResponse } from 'next/server';

import { fullCartIncludes } from '@/lib/cart/cartSchema';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      include: fullCartIncludes,
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
