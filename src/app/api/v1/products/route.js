import { NextResponse } from 'next/server';

import { createProducts } from '@/lib/products/utils';

export async function POST(req) {
  const body = await req.json();

  try {
    const product = await createProducts(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
