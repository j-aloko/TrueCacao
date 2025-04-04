import prisma from '../prisma';

export async function getVariantDetails(variantId) {
  return prisma.productVariant.findUnique({
    select: {
      id: true,
      images: true,
      packaging: true,
      price: {
        select: {
          amount: true,
          currencyCode: true,
        },
      },
      product: {
        select: {
          description: true,
          name: true,
        },
      },
      stock: true,
      weight: true,
    },
    where: { id: variantId },
  });
}
