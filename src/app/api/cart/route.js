import { NextResponse } from 'next/server';

import {
  applyDiscountToCart,
  removeDiscountFromCart,
} from '@/lib/cart/discounts';
import {
  applyGiftCardToCart,
  removeGiftCardFromCart,
} from '@/lib/cart/giftcards';
import { addItemToCart, getOrCreateCart } from '@/lib/cart/utils';
import { cartDiscountSchema, cartGiftCardSchema } from '@/lib/cart/validators';

export async function GET(request) {
  const sessionId = await request.cookies.get('sessionId')?.value;
  const userId = await request.headers.get('x-user-id');

  try {
    const cart = await getOrCreateCart(sessionId, userId);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  const sessionId = await request.cookies.get('sessionId')?.value;
  const userId = await request.headers.get('x-user-id');
  const body = await request.json();

  try {
    if (body.productVariantId) {
      const cart = await addItemToCart(
        sessionId,
        userId,
        body.productVariantId,
        body.quantity || 1
      );
      return NextResponse.json(cart);
    }
    if (body.discountCode) {
      cartDiscountSchema.parse(body);
      const cart = await applyDiscountToCart(
        sessionId,
        userId,
        body.discountCode
      );
      return NextResponse.json(cart);
    }
    if (body.giftCardCode) {
      cartGiftCardSchema.parse(body);
      const cart = await applyGiftCardToCart(
        sessionId,
        userId,
        body.giftCardCode
      );
      return NextResponse.json(cart);
    }
    const cart = await getOrCreateCart(sessionId, userId);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  const sessionId = await request.cookies.get('sessionId')?.value;
  const userId = await request.headers.get('x-user-id');
  const body = await request.json();

  try {
    let cart;
    if (body.discountCode) {
      cart = await removeDiscountFromCart(sessionId, userId, body.discountCode);
    } else if (body.giftCardCode) {
      cart = await removeGiftCardFromCart(sessionId, userId, body.giftCardCode);
    } else {
      throw new Error('No valid operation specified');
    }
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
