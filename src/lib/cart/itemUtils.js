import { reserveStock, releaseStock } from '@/lib/inventory/stockUtils';
import prisma from '@/lib/prisma';

import { calculateAndUpdateCartCost } from './costCalculator';
import { updateCartQuantityTotals } from './utils';

export async function updateCartItem(lineId, newQuantity) {
  return prisma.$transaction(async (tx) => {
    const line = await tx.cartLine.findUnique({
      include: {
        cart: { select: { id: true } },
        productVariant: { select: { id: true } },
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

    await updateCartQuantityTotals(line.cart.id, tx);
    const updatedCost = await calculateAndUpdateCartCost(line.cart.id, tx);
    return {
      cartLineId: lineId,
      costSummary: {
        discount: updatedCost.cost.discount,
        estimatedShipping: updatedCost.cost.estimatedShipping,
        estimatedTax: updatedCost.cost.estimatedTax,
        shipping: updatedCost.cost.shipping,
        subtotal: updatedCost.cost.subtotal,
        total: updatedCost.cost.total,
        totalTax: updatedCost.cost.totalTax,
      },
    };
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
    await tx.cartLine.delete({
      where: { id: lineId },
    });
    // Reorder remaining items
    await tx.cartLine.updateMany({
      data: { position: { decrement: 1 } },
      where: {
        cartId: line.cart.id,
        position: { gt: line.position },
      },
    });
    await updateCartQuantityTotals(line.cart.id, tx);
    const updatedCost = await calculateAndUpdateCartCost(line.cart.id, tx);
    return {
      costSummary: {
        discount: updatedCost.cost.discount,
        estimatedShipping: updatedCost.cost.estimatedShipping,
        estimatedTax: updatedCost.cost.estimatedTax,
        shipping: updatedCost.cost.shipping,
        subtotal: updatedCost.cost.subtotal,
        total: updatedCost.cost.total,
        totalTax: updatedCost.cost.totalTax,
      },
      removedCartLineId: lineId,
    };
  });
}
