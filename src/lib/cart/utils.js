import prisma from '@/lib/prisma';

import { fullCartIncludes } from './cartSchema';
import { calculateAndUpdateCartCost } from './cost-calculator';

export function generateCheckoutUrl() {
  return `/checkout/${crypto.randomUUID()}`;
}

export async function getOrCreateCart(sessionId, userId = null) {
  const where = userId ? { userId } : { sessionId };

  let cart = await prisma.cart.findFirst({
    include: fullCartIncludes,
    where,
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        checkoutUrl: generateCheckoutUrl(),
        ...(userId && { userId }),
        ...(sessionId && { sessionId }),
        totalQuantity: 0,
      },
      include: fullCartIncludes,
    });

    await trackAbandonedCart(cart.id, userId);
  }

  return calculateAndUpdateCartCost(cart.id);
}

export async function addItemToCart(
  sessionId,
  userId,
  productVariantId,
  quantity = 1
) {
  // First validate stock availability
  await validateStock(productVariantId, quantity);

  // Get or create cart
  const cart = await getOrCreateCart(sessionId, userId);

  // Check if variant already exists in cart
  const existingLine = cart.lines.find(
    (line) => line.productVariantId === productVariantId
  );

  if (existingLine) {
    // Update existing line
    await prisma.cartLine.update({
      data: { quantity: existingLine.quantity + quantity },
      where: { id: existingLine.id },
    });
  } else {
    // Create new line
    const variant = await prisma.productVariant.findUnique({
      select: { priceId: true },
      where: { id: productVariantId },
    });

    if (!variant) {
      throw new Error('Product variant not found');
    }

    await prisma.cartLine.create({
      data: {
        cartId: cart.id,
        priceId: variant.priceId,
        productVariantId,
        quantity,
      },
    });
  }

  // Update reserved stock
  await prisma.productVariant.update({
    data: {
      reservedStock: {
        increment: quantity,
      },
    },
    where: { id: productVariantId },
  });

  // Update cart total quantity
  await prisma.cart.update({
    data: {
      totalQuantity: {
        increment: quantity,
      },
    },
    where: { id: cart.id },
  });

  // Update abandoned cart tracking
  await trackAbandonedCart(cart.id, userId);

  // Return updated cart with recalculated costs
  return calculateAndUpdateCartCost(cart.id);
}

export async function validateStock(productVariantId, quantity) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: productVariantId },
  });

  if (!variant || variant.stock - (variant.reservedStock || 0) < quantity) {
    throw new Error('Insufficient stock');
  }
}

export async function trackAbandonedCart(cartId, userId = null) {
  return prisma.abandonedCart.upsert({
    create: {
      cartId,
      lastUpdated: new Date(),
      userId,
    },
    update: {
      lastUpdated: new Date(),
    },
    where: { cartId },
  });
}
