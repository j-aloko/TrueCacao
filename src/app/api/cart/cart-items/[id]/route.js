// src/app/api/cart/cart-items/route.js
import { NextResponse } from 'next/server';

import { validateStock } from '@/lib/cart/utils';
import { cartItemSchema } from '@/lib/cart/validators';
import prisma from '@/lib/prisma';

// PUT - Update cart item quantity
export async function PUT(request, { params }) {
  const { id } = await params;
  const { quantity } = await request.json();

  try {
    // Validate input
    cartItemSchema.partial().parse({ quantity });

    // Get current cart line and cart
    const line = await prisma.cartLine.findUnique({
      include: {
        cart: true,
        productVariant: {
          include: {
            price: {
              select: {
                amount: true,
                currencyCode: true,
              },
            },
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      where: { id },
    });

    if (!line) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Validate stock
    await validateStock(line.productVariantId, quantity);

    // Calculate quantity difference
    const quantityDiff = quantity - line.quantity;

    // Update quantity and cart total in a transaction
    const [updatedLine] = await prisma.$transaction([
      prisma.cartLine.update({
        data: { quantity },
        include: {
          productVariant: {
            include: {
              price: {
                select: {
                  amount: true,
                  currencyCode: true,
                },
              },
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        where: { id },
      }),
      prisma.cart.update({
        data: {
          totalQuantity: {
            increment: quantityDiff,
          },
        },
        where: { id: line.cart.id },
      }),
    ]);

    return NextResponse.json(updatedLine);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE - Remove item from cart
export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    // Get the line and cart first
    const line = await prisma.cartLine.findUnique({
      include: { cart: true },
      where: { id },
    });

    if (!line) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Delete line and update cart total in a transaction
    await prisma.$transaction([
      prisma.cartLine.delete({ where: { id } }),
      prisma.cart.update({
        data: {
          totalQuantity: {
            decrement: line.quantity,
          },
        },
        where: { id: line.cart.id },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
