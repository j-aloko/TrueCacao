import { NextResponse } from 'next/server';

import { addItemToCart, getOrCreateCart } from '@/lib/cart/utils';

// GET - Get cart contents
export async function GET(request) {
  const sessionId = request.cookies.get('sessionId')?.value;
  const userId = request.user?.id; // Assuming you have auth middleware

  try {
    const cart = await getOrCreateCart(sessionId, userId);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  const sessionId = request.cookies.get('sessionId')?.value;
  const { productVariantId, quantity } = await request.json();

  try {
    // If adding an item
    if (productVariantId) {
      const cart = await addItemToCart(sessionId, productVariantId, quantity);
      return NextResponse.json(cart);
    }

    // Otherwise just get/create cart
    const cart = await getOrCreateCart(sessionId);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
