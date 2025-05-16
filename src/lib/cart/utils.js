import { releaseStock, reserveStock } from '@/lib/inventory/stockUtils';
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
    // Verify stock availability and reserve
    await reserveStock(productVariantId, quantity, tx);

    // Get or create cart
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

    // Check for existing line
    const existingLine = cart.lines.find(
      (line) => line.productVariantId === productVariantId
    );

    if (existingLine) {
      await tx.cartLine.update({
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
      await tx.cartLine.create({
        data: {
          cartId: cart.id,
          position: await getNextPosition(cart.id),
          priceId: variant.priceId,
          productVariantId,
          quantity,
        },
      });
    }
    await updateCartTotals(cart.id, tx);
    return calculateAndUpdateCartCost(cart.id, tx);
  });
}

export async function mergeCarts(sessionId, userId) {
  if (!userId || !sessionId) {
    throw new Error('Missing required parameters');
  }
  return prisma.$transaction(async (tx) => {
    const guestCart = await tx.cart.findUnique({
      include: { lines: true },
      where: { sessionId },
    });
    if (!guestCart) throw new Error('Guest cart not found');
    const userCart = await tx.cart.upsert({
      create: {
        checkoutUrl: generateCheckoutUrl(),
        totalQuantity: 0,
        userId,
      },
      include: { lines: true },
      update: {
        checkoutUrl: generateCheckoutUrl(),
      },
      where: { userId },
    });
    const nextPosition = await getNextPosition(userCart.id);
    await Promise.all(
      guestCart.lines.map(async (line, index) => {
        const existingLine = userCart.lines.find(
          (l) => l.productVariantId === line.productVariantId
        );
        if (existingLine) {
          return tx.cartLine.update({
            data: { quantity: { increment: line.quantity } },
            where: { id: existingLine.id },
          });
        }
        return tx.cartLine.create({
          data: {
            cartId: userCart.id,
            position: nextPosition + index,
            priceId: line.priceId,
            productVariantId: line.productVariantId,
            quantity: line.quantity,
          },
        });
      })
    );
    // Release all stock reservations from guest cart
    await Promise.all(
      guestCart.lines.map((line) =>
        releaseStock(line.productVariantId, line.quantity, tx)
      )
    );
    await tx.cart.delete({ where: { id: guestCart.id } });
    return calculateAndUpdateCartCost(userCart.id, tx);
  });
}

export async function updateCartTotals(cartId, tx) {
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
