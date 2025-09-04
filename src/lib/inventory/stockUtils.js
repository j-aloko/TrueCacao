import prisma from '@/lib/prisma';

export async function reserveStock(variantId, quantity, tx) {
  // First get the current stock values
  const variant = await tx.productVariant.findUnique({
    select: {
      lowStockThreshold: true,
      reservedStock: true,
      stock: true,
    },
    where: { id: variantId },
  });

  if (!variant) {
    throw new Error('Product variant not found');
  }

  // Check if there's enough available stock
  const availableStock = variant.stock - variant.reservedStock;
  if (availableStock < quantity) {
    throw new Error('Insufficient stock available');
  }

  // Update the reserved stock
  await tx.productVariant.update({
    data: {
      reservedStock: {
        increment: quantity,
      },
    },
    where: { id: variantId },
  });

  // Record inventory transaction
  await tx.inventoryTransaction.create({
    data: {
      notes: `Reserved ${quantity} units for cart`,
      quantity: -quantity,
      type: 'RESERVATION',
      variantId,
    },
  });

  return true;
}

export async function releaseStock(variantId, quantity, tx) {
  // Release reserved stock
  await tx.productVariant.update({
    data: {
      reservedStock: {
        decrement: quantity,
      },
    },
    where: { id: variantId },
  });

  // Record inventory transaction
  await tx.inventoryTransaction.create({
    data: {
      notes: `Released ${quantity} units from reservation`,
      quantity,
      type: 'RELEASE',
      variantId,
    },
  });
}

export async function checkAvailableStock(variantId) {
  const variant = await prisma.productVariant.findUnique({
    select: {
      lowStockThreshold: true,
      reservedStock: true,
      stock: true,
    },
    where: { id: variantId },
  });

  if (!variant) {
    throw new Error('Product variant not found');
  }

  return {
    available: variant.stock - variant.reservedStock,
    isLowStock: variant.lowStockThreshold
      ? variant.stock - variant.reservedStock <= variant.lowStockThreshold
      : false,
    totalStock: variant.stock,
  };
}
