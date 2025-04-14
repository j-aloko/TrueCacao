import prisma from '@/lib/prisma';

export async function validateStock(productVariantId, quantity) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: productVariantId },
  });

  if (!variant || variant.stock < quantity) {
    throw new Error('Insufficient stock');
  }
}
