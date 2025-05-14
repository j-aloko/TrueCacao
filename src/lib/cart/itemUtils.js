import { invalidateStockCache } from '@/lib/cache/redisUtils';
import prisma from '@/lib/prisma';

import { calculateAndUpdateCartCost } from './costCalculator';

export async function updateItem(lineId, newQuantity) {
  return prisma.$transaction(async (tx) => {
    const line = await tx.cartLine.findUnique({
      select: {
        cartId: true,
        id: true,
        productVariant: {
          select: { reservedStock: true, stock: true },
        },
        productVariantId: true,
        quantity: true,
      },
      where: { id: lineId },
    });

    if (!line) throw new Error('Cart item not found');

    const quantityDiff = newQuantity - line.quantity;
    const availableStock =
      line.productVariant.stock - line.productVariant.reservedStock;

    if (availableStock < quantityDiff) {
      throw new Error('Insufficient stock');
    }

    await tx.cartLine.update({
      data: { quantity: newQuantity },
      where: { id: lineId },
    });

    await tx.productVariant.update({
      data: { reservedStock: { increment: quantityDiff } },
      where: { id: line.productVariantId },
    });

    await tx.cart.update({
      data: { totalQuantity: { increment: quantityDiff } },
      where: { id: line.cartId },
    });

    await invalidateStockCache(line.productVariantId);

    return calculateAndUpdateCartCost(line.cartId, tx);
  });
}

export async function deleteItem(lineId) {
  return prisma.$transaction(async (tx) => {
    const line = await tx.cartLine.findUnique({
      select: {
        cartId: true,
        id: true,
        position: true,
        productVariantId: true,
        quantity: true,
      },
      where: { id: lineId },
    });

    if (!line) throw new Error('Cart item not found');

    await tx.productVariant.update({
      data: { reservedStock: { decrement: line.quantity } },
      where: { id: line.productVariantId },
    });

    await tx.cartLine.delete({ where: { id: lineId } });

    await tx.cart.update({
      data: { totalQuantity: { decrement: line.quantity } },
      where: { id: line.cartId },
    });

    await tx.cartLine.updateMany({
      data: { position: { decrement: 1 } },
      where: { cartId: line.cartId, position: { gt: line.position } },
    });

    await invalidateStockCache(line.productVariantId);

    return calculateAndUpdateCartCost(line.cartId, tx);
  });
}
