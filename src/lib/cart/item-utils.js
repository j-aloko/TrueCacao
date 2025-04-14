import prisma from '@/lib/prisma';

import { calculateAndUpdateCartCost } from './cost-calculator';

export async function updateItem(lineId, newQuantity) {
  const line = await prisma.cartLine.findUnique({
    include: { cart: true, productVariant: true },
    where: { id: lineId },
  });

  if (!line) {
    throw new Error('Cart item not found');
  }

  const quantityDiff = newQuantity - line.quantity;

  // Validate stock for the new quantity
  if (
    line.productVariant.stock - line.productVariant.reservedStock <
    quantityDiff
  ) {
    throw new Error('Insufficient stock');
  }

  // Update line quantity (position remains unchanged)
  await prisma.cartLine.update({
    data: {
      quantity: newQuantity,
    },
    where: { id: lineId },
  });

  // Update reserved stock
  await prisma.productVariant.update({
    data: { reservedStock: { increment: quantityDiff } },
    where: { id: line.productVariantId },
  });

  // Update cart total quantity
  await prisma.cart.update({
    data: { totalQuantity: { increment: quantityDiff } },
    where: { id: line.cartId },
  });

  return calculateAndUpdateCartCost(line.cartId);
}

export async function deleteItem(lineId) {
  const line = await prisma.cartLine.findUnique({
    include: { cart: true, productVariant: true },
    where: { id: lineId },
  });

  if (!line) {
    throw new Error('Cart item not found');
  }

  // Get the position of the item we're deleting
  const deletedPosition = line.position;

  // Release reserved stock
  await prisma.productVariant.update({
    data: { reservedStock: { decrement: line.quantity } },
    where: { id: line.productVariantId },
  });

  // Delete the line
  await prisma.cartLine.delete({ where: { id: lineId } });

  // Update positions of remaining items to fill the gap
  await prisma.cartLine.updateMany({
    data: {
      position: {
        decrement: 1,
      },
    },
    where: {
      cartId: line.cartId,
      position: {
        gt: deletedPosition,
      },
    },
  });

  // Update cart total quantity
  await prisma.cart.update({
    data: { totalQuantity: { decrement: line.quantity } },
    where: { id: line.cartId },
  });

  return calculateAndUpdateCartCost(line.cartId);
}
