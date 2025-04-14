import { NextResponse } from 'next/server';

import { updateItem, deleteItem } from '@/lib/cart/item-utils';
import { cartItemSchema } from '@/lib/cart/validators';

export async function PUT(request, { params }) {
  const { id } = params;
  const { quantity } = await request.json();

  try {
    cartItemSchema.partial().parse({ quantity });
    const cart = await updateItem(id, quantity);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    const cart = await deleteItem(id);
    return NextResponse.json({ cart, success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
