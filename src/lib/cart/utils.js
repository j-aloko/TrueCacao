import prisma from '@/lib/prisma';

import { fullCartIncludes } from './cartSchema';
import { calculateAndUpdateCartCost } from './cost-calculator';
import { generateCheckoutUrl } from './generateCheckoutUrl';
import { updateItem } from './item-utils';

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

export async function mergeCarts(sessionId, userId) {
  if (!userId || !sessionId) {
    throw new Error('Missing required parameters');
  }

  // Find guest cart
  const guestCart = await prisma.cart.findFirst({
    include: {
      lines: {
        include: {
          productVariant: {
            include: {
              price: true,
            },
          },
        },
      },
    },
    where: { sessionId },
  });

  if (!guestCart) {
    throw new Error('Guest cart not found');
  }

  // Find or create user cart with new checkout URL
  let userCart = await prisma.cart.findFirst({
    include: { lines: true },
    where: { userId },
  });

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: {
        checkoutUrl: generateCheckoutUrl(),
        userId,
      },
      include: { lines: true },
    });
  } else {
    userCart = await prisma.cart.update({
      data: {
        checkoutUrl: generateCheckoutUrl(),
      },
      include: { lines: true },
      where: { id: userCart.id },
    });
  }

  // Merge cart lines
  await Promise.all(
    guestCart.lines.map(async (line) => {
      const existingLine = userCart.lines.find(
        (l) => l.productVariantId === line.productVariantId
      );

      if (existingLine) {
        return prisma.cartLine.update({
          data: { quantity: existingLine.quantity + line.quantity },
          where: { id: existingLine.id },
        });
      }
      return prisma.cartLine.create({
        data: {
          cartId: userCart.id,
          priceId: line.priceId,
          productVariantId: line.productVariantId,
          quantity: line.quantity,
        },
      });
    })
  );

  // Delete guest cart
  await prisma.cart.delete({ where: { id: guestCart.id } });

  // Return merged cart with costs calculated
  return calculateAndUpdateCartCost(userCart.id);
}

export async function addItemToCart(
  sessionId,
  userId,
  productVariantId,
  quantity = 1
) {
  // First validate stock availability
  await validateStock(productVariantId, quantity);

  // Get or create cart with lines included
  const cart =
    (await prisma.cart.findFirst({
      include: {
        lines: {
          include: {
            productVariant: {
              include: { price: true },
            },
          },
          where: { productVariantId },
        },
      },
      where: {
        OR: [{ sessionId }, { userId }],
      },
    })) || (await createNewCart(sessionId, userId));

  // Check for existing line item
  const existingLine = cart.lines.find(
    (line) => line.productVariantId === productVariantId
  );

  if (existingLine) {
    // Update existing line instead of creating new one
    return updateItem(existingLine.id, existingLine.quantity + quantity);
  }

  // Create new line if variant doesn't exist in cart
  const variant = await prisma.productVariant.findUnique({
    select: { priceId: true, stock: true },
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

  // Update reserved stock
  await prisma.productVariant.update({
    data: { reservedStock: { increment: quantity } },
    where: { id: productVariantId },
  });

  // Update cart total quantity
  await prisma.cart.update({
    data: { totalQuantity: { increment: quantity } },
    where: { id: cart.id },
  });

  // Return updated cart
  return calculateAndUpdateCartCost(cart.id);
}

async function createNewCart(sessionId, userId) {
  return prisma.cart.create({
    data: {
      checkoutUrl: generateCheckoutUrl(),
      ...(userId && { userId }),
      ...(sessionId && { sessionId }),
      totalQuantity: 0,
    },
  });
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
