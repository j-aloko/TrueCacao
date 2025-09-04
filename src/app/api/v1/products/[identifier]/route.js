import { NextResponse } from 'next/server';

import {
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from '@/lib/products/utils';

const isUUID = (identifier) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    identifier
  );

export async function GET(req, { params }) {
  const { identifier } = await params;
  if (!identifier) {
    return NextResponse.json(
      { error: 'Product identifier is required' },
      { status: 400 }
    );
  }

  try {
    const product = isUUID(identifier)
      ? await getProductById(identifier, {
          reviews: {
            select: {
              comment: true,
              rating: true,
              user: { select: { name: true } },
            },
          },
        })
      : await getProductBySlug(identifier, {
          reviews: {
            select: {
              comment: true,
              rating: true,
              user: { select: { name: true } },
            },
          },
        });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { identifier } = await params;
  const updates = await req.json();

  if (!isUUID(identifier)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    const updatedProduct = await updateProduct(identifier, updates);
    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { identifier } = await params;

  if (!isUUID(identifier)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    const deletedProduct = await deleteProduct(identifier);
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
