import { NextResponse } from 'next/server';

import { createReview, getProductReviews } from '@/lib/reviews/utils';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 }
    );
  }

  const reviews = await getProductReviews(productId);
  return NextResponse.json(reviews);
}

export async function POST(req) {
  const body = await req.json();
  const { userId, productId, rating, comment } = body;

  try {
    const newReview = await createReview({
      comment,
      productId,
      rating,
      userId,
    });
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
