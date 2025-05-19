import { reserveStock } from '@/lib/inventory/stockUtils';
import prisma from '@/lib/prisma';

import { trackAbandonedCart } from './abondoned';
import { fullCartIncludes } from './cartSchema';
import { calculateAndUpdateCartCost } from './costCalculator';
import { generateCheckoutUrl } from './generateCheckoutUrl';

async function getNextPosition(cartId) {
  const lastItem = await prisma.cartLine.findFirst({
    orderBy: { position: 'desc' },
    select: { position: true },
    where: { cartId },
  });
  return (lastItem?.position || 0) + 1;
}

export async function getFullCart(cartId) {
  return prisma.cart.findUnique({
    include: fullCartIncludes,
    where: { id: cartId },
  });
}

export async function getOrCreateCart(sessionId, userId = null) {
  const where = userId ? { userId } : { sessionId };
  const cart = await prisma.cart.upsert({
    create: {
      sessionId,
      totalQuantity: 0,
      userId,
    },
    select: { id: true },
    update: {},
    where,
  });
  const checkoutUrl = generateCheckoutUrl(cart.id);
  await prisma.cart.update({
    data: { checkoutUrl },
    where: { id: cart.id },
  });
  await trackAbandonedCart(cart.id, userId);
  return getFullCart(cart.id);
}

export async function addItemToCart(
  sessionId,
  userId,
  productVariantId,
  quantity
) {
  return prisma.$transaction(async (tx) => {
    await reserveStock(productVariantId, quantity, tx);
    const cart = await tx.cart.upsert({
      create: {
        checkoutUrl: generateCheckoutUrl(),
        sessionId,
        totalQuantity: 0,
        userId,
      },
      include: { lines: true },
      update: {},
      where: { sessionId },
    });

    let cartLine;
    // Check for existing line
    const existingLine = cart.lines.find(
      (line) => line.productVariantId === productVariantId
    );
    if (existingLine) {
      cartLine = await tx.cartLine.update({
        data: { quantity: { increment: quantity } },
        where: { id: existingLine.id },
      });
    } else {
      const variant = await tx.productVariant.findUnique({
        select: { priceId: true },
        where: { id: productVariantId },
      });
      if (!variant) {
        throw new Error('Product variant not found');
      }
      cartLine = await tx.cartLine.create({
        data: {
          cartId: cart.id,
          position: await getNextPosition(cart.id),
          priceId: variant.priceId,
          productVariantId,
          quantity,
        },
      });
    }
    await updateCartQuantityTotals(cart.id, tx);
    const updatedCost = await calculateAndUpdateCartCost(cart.id, tx);
    return {
      cartLineId: cartLine.id,
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

export async function mergeCarts(sessionId, userId) {
  if (!userId || !sessionId) {
    throw new Error('Missing required parameters');
  }
  return prisma.$transaction(async (tx) => {
    const guestCart = await tx.cart.findUnique({
      where: { sessionId },
    });
    if (!guestCart) {
      throw new Error('Guest cart not found');
    }
    if (guestCart.userId) {
      return guestCart;
    }
    return tx.cart.update({
      data: { userId },
      where: { id: guestCart.id },
    });
  });
}

export async function updateCartQuantityTotals(cartId, tx) {
  const aggregation = await tx.cartLine.aggregate({
    _sum: { quantity: true },
    where: { cartId },
  });
  const totalQuantity = aggregation._sum.quantity || 0;
  await tx.cart.update({
    data: { totalQuantity },
    where: { id: cartId },
  });

  return totalQuantity;
}
