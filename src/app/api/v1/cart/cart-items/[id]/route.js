import { NextResponse } from 'next/server';

import { removeCartItem, updateCartItem } from '@/lib/cart/itemUtils';
import { cartItemSchema } from '@/lib/cart/validators';

export async function PUT(request, { params }) {
  const { id } = await params;
  const { quantity } = await request.json();

  try {
    cartItemSchema.partial().parse({ quantity });
    const cart = await updateCartItem(id, quantity);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    const cart = await removeCartItem(id);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
