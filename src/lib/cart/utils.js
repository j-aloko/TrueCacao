import prisma from '@/lib/prisma';

import { trackAbandonedCart } from './abondoned';
import { fullCartIncludes } from './cartSchema';
import { calculateAndUpdateCartCost } from './costCalculator';
import { generateCheckoutUrl } from './generateCheckoutUrl';
import { getCachedStock, invalidateStockCache } from '../cache/redisUtils';

async function getNextPosition(cartId) {
  const lastItem = await prisma.cartLine.findFirst({
    orderBy: { position: 'desc' },
    select: { position: true },
    where: { cartId },
  });
  return (lastItem?.position || 0) + 1;
}

async function getFullCart(cartId) {
  return prisma.cart.findUnique({
    include: fullCartIncludes,
    where: { id: cartId },
  });
}

export async function getOrCreateCart(sessionId, userId = null) {
  const where = userId ? { userId } : { sessionId };

  const cart = await prisma.cart.upsert({
    create: {
      checkoutUrl: generateCheckoutUrl(),
      sessionId,
      totalQuantity: 0,
      userId,
    },
    select: { id: true },
    update: {},
    where,
  });

  await trackAbandonedCart(cart.id, userId);

  return getFullCart(cart.id);
}

export async function mergeCarts(sessionId, userId) {
  if (!userId || !sessionId) {
    throw new Error('Missing required parameters');
  }

  return prisma.$transaction(async (tx) => {
    const guestCart = await tx.cart.findUnique({
      include: { lines: { orderBy: { position: 'asc' } } },
      where: { sessionId },
    });

    if (!guestCart) throw new Error('Guest cart not found');

    const userCart = await tx.cart.upsert({
      create: { checkoutUrl: generateCheckoutUrl(), userId },
      include: { lines: { orderBy: { position: 'asc' } } },
      update: { checkoutUrl: generateCheckoutUrl() },
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

    await tx.cart.delete({ where: { id: guestCart.id } });

    await invalidateStockCache(
      guestCart.lines.map((line) => line.productVariantId)
    );

    return calculateAndUpdateCartCost(userCart.id, tx);
  });
}

export async function addItemToCart(
  sessionId,
  userId,
  productVariantId,
  quantity = 1
) {
  // Fetch stock using Redis caching
  const stock = await getCachedStock(productVariantId, async (id) => {
    const variant = await prisma.productVariant.findUnique({
      select: { stock: true },
      where: { id },
    });
    return variant ? variant.stock : null;
  });

  if (!stock || stock < quantity) throw new Error('Insufficient stock');

  // Fetch or create cart
  const cart = await prisma.cart.upsert({
    create: {
      checkoutUrl: generateCheckoutUrl(),
      sessionId,
      totalQuantity: 0,
      userId,
    },
    include: { lines: { orderBy: { position: 'asc' } } },
    update: {},
    where: { sessionId },
  });

  // Find existing cart line
  const existingLine = cart.lines.find(
    (line) => line.productVariantId === productVariantId
  );

  return prisma.$transaction(async (tx) => {
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
      if (!variant) throw new Error('Product variant not found');

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

    // Update reserved stock and invalidate cache
    await tx.productVariant.update({
      data: { reservedStock: { increment: quantity } },
      where: { id: productVariantId },
    });
    await invalidateStockCache(productVariantId);

    // Update cart total quantity
    await tx.cart.update({
      data: { totalQuantity: { increment: quantity } },
      where: { id: cart.id },
    });

    return calculateAndUpdateCartCost(cart.id, tx);
  });
}
