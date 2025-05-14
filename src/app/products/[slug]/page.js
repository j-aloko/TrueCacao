import React from 'react';

import ProductDetailsContainer from '@/containers/product-details-container/ProductDetailsContainer';
import prisma from '@/lib/prisma';
import { getProductSchema, sanitizeProductData } from '@/lib/products/utils';

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    select: getProductSchema({
      reviews: {
        select: {
          comment: true,
          id: true,
          rating: true,
          user: { select: { name: true } },
        },
      },
    }),
    where: { slug },
  });

  if (!product) {
    return (
      <main>
        <h1>Product Not Found</h1>
        <p>The requested product may have been removed or does not exist.</p>
      </main>
    );
  }

  const sanitizedProduct = sanitizeProductData(product);

  const variantProps = ['packaging.type', 'weight'];

  const labels = {
    packaging: 'Packaging',
    weight: 'Weight',
  };

  const disableOptions = {
    packaging: false,
    weight: true,
  };

  return (
    <ProductDetailsContainer
      product={sanitizedProduct}
      variantProps={variantProps}
      labels={labels}
      disableOptions={disableOptions}
    />
  );
}
