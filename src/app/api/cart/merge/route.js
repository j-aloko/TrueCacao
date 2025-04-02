import { NextResponse } from 'next/server';

import { generateCheckoutUrl } from '@/lib/cart/utils';
import prisma from '@/lib/prisma';

export async function POST(request) {
  const { sessionId } = await request.json();
  const userId = request.user?.id;

  if (!userId || !sessionId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Find guest cart
    const guestCart = await prisma.cart.findFirst({
      include: { lines: true },
      where: { sessionId },
    });

    if (!guestCart) {
      return NextResponse.json(
        { error: 'Guest cart not found' },
        { status: 404 }
      );
    }

    // Find or create user cart with new checkout URL
    let userCart = await prisma.cart.findFirst({
      include: { lines: true },
      where: { userId },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: {
          checkoutUrl: generateCheckoutUrl(),
          userId,
        },
        include: { lines: true },
      });
    } else {
      userCart = await prisma.cart.update({
        data: {
          checkoutUrl: generateCheckoutUrl(),
        },
        include: { lines: true },
        where: { id: userCart.id },
      });
    }

    // Merge cart lines
    await Promise.all(
      guestCart.lines.map(async (line) => {
        const existingLine = userCart.lines.find(
          (l) => l.productVariantId === line.productVariantId
        );

        if (existingLine) {
          return prisma.cartLine.update({
            data: { quantity: existingLine.quantity + line.quantity },
            where: { id: existingLine.id },
          });
        }
        return prisma.cartLine.create({
          data: {
            cartId: userCart.id,
            priceId: line.priceId,
            productVariantId: line.productVariantId,
            quantity: line.quantity,
          },
        });
      })
    );

    // Delete guest cart
    await prisma.cart.delete({ where: { id: guestCart.id } });

    // Return merged cart with fresh checkout URL
    const updatedCart = await prisma.cart.findUnique({
      include: { lines: true },
      where: { id: userCart.id },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
