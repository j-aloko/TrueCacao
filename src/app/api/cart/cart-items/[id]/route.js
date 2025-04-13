import { NextResponse } from 'next/server';

import { calculateAndUpdateCartCost } from '@/lib/cart/cost-calculator';
import { validateStock } from '@/lib/cart/utils';
import { cartItemSchema } from '@/lib/cart/validators';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  const { id } = params;
  const { quantity } = await request.json();

  try {
    cartItemSchema.partial().parse({ quantity });

    // Only include what we need from the line
    const line = await prisma.cartLine.findUnique({
      select: {
        cart: {
          select: {
            id: true,
          },
        },
        cartId: true,
        id: true,
        productVariantId: true,
        quantity: true,
      },
      where: { id },
    });

    if (!line) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    await validateStock(line.productVariantId, quantity);
    const quantityDiff = quantity - line.quantity;

    // Update line quantity
    await prisma.cartLine.update({
      data: { quantity },
      where: { id },
    });

    // Update reserved stock
    if (quantityDiff > 0) {
      await prisma.productVariant.update({
        data: {
          reservedStock: {
            increment: quantityDiff,
          },
        },
        where: { id: line.productVariantId },
      });
    } else if (quantityDiff < 0) {
      await prisma.productVariant.update({
        data: {
          reservedStock: {
            decrement: -quantityDiff,
          },
        },
        where: { id: line.productVariantId },
      });
    }

    // Update cart total quantity
    await prisma.cart.update({
      data: {
        totalQuantity: {
          increment: quantityDiff,
        },
      },
      where: { id: line.cartId },
    });

    const cart = await calculateAndUpdateCartCost(line.cartId);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const line = await prisma.cartLine.findUnique({
      select: {
        cartId: true,
        id: true,
        productVariant: {
          select: {
            id: true,
          },
        },
        productVariantId: true,
        quantity: true,
      },
      where: { id },
    });

    if (!line) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Release reserved stock
    await prisma.productVariant.update({
      data: {
        reservedStock: {
          decrement: line.quantity,
        },
      },
      where: { id: line.productVariantId },
    });

    // Delete line
    await prisma.cartLine.delete({ where: { id } });

    // Update cart total quantity
    await prisma.cart.update({
      data: {
        totalQuantity: {
          decrement: line.quantity,
        },
      },
      where: { id: line.cartId },
    });

    const cart = await calculateAndUpdateCartCost(line.cartId);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
