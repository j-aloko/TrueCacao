import { reserveStock, releaseStock } from '@/lib/inventory/stockUtils';
import prisma from '@/lib/prisma';

import { calculateAndUpdateCartCost } from './costCalculator';
import { updateCartTotals } from './utils';

export async function updateCartItem(lineId, newQuantity) {
  return prisma.$transaction(async (tx) => {
    const line = await tx.cartLine.findUnique({
      include: {
        cart: { select: { id: true } },
        productVariant: {
          select: { id: true, reservedStock: true, stock: true },
        },
      },
      where: { id: lineId },
    });

    if (!line) throw new Error('Cart item not found');

    const quantityDiff = newQuantity - line.quantity;

    if (quantityDiff > 0) {
      await reserveStock(line.productVariant.id, quantityDiff, tx);
    } else if (quantityDiff < 0) {
      await releaseStock(line.productVariant.id, -quantityDiff, tx);
    }
    await tx.cartLine.update({
      data: { quantity: newQuantity },
      where: { id: lineId },
    });
    await updateCartTotals(line.cart.id, tx);
    return calculateAndUpdateCartCost(line.cart.id, tx);
  });
}

export async function removeCartItem(lineId) {
  return prisma.$transaction(async (tx) => {
    const line = await tx.cartLine.findUnique({
      include: {
        cart: { select: { id: true } },
        productVariant: { select: { id: true } },
      },
      where: { id: lineId },
    });

    if (!line) throw new Error('Cart item not found');

    await releaseStock(line.productVariant.id, line.quantity, tx);

    // Delete the line
    await tx.cartLine.delete({
      where: { id: lineId },
    });
    // Reorder remaining items
    await tx.cartLine.updateMany({
      data: {
        position: { decrement: 1 },
      },
      where: {
        cartId: line.cart.id,
        position: { gt: line.position },
      },
    });
    await updateCartTotals(line.cart.id, tx);
    return calculateAndUpdateCartCost(line.cart.id, tx);
  });
}
