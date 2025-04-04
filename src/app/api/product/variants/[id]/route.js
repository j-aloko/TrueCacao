import { NextResponse } from 'next/server';

import { getVariantDetails } from '@/lib/product/utils';

export async function GET(request, { params }) {
  try {
    const variant = await getVariantDetails(params.id);
    if (!variant) {
      return NextResponse.json({ error: 'Variant not found' }, { status: 404 });
    }
    return NextResponse.json(variant);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
