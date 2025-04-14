import prisma from '@/lib/prisma';

import { fullCartIncludes } from './cartSchema';
import { calculateAndUpdateCartCost } from './cost-calculator';
import { generateCheckoutUrl } from './generateCheckoutUrl';
import { updateItem } from './item-utils';

async function getNextPosition(cartId) {
  const lastItem = await prisma.cartLine.findFirst({
    orderBy: { position: 'desc' },
    select: { position: true },
    where: { cartId },
  });
  return (lastItem?.position || 0) + 1;
}

export async function getOrCreateCart(sessionId, userId = null) {
  const where = userId ? { userId } : { sessionId };

  let cart = await prisma.cart.findFirst({
    include: {
      ...fullCartIncludes,
      lines: {
        ...fullCartIncludes.lines,
        orderBy: { position: 'asc' },
      },
    },
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
      include: {
        ...fullCartIncludes,
        lines: {
          ...fullCartIncludes.lines,
          orderBy: { position: 'asc' },
        },
      },
    });

    await trackAbandonedCart(cart.id, userId);
  }

  return calculateAndUpdateCartCost(cart.id);
}

export async function mergeCarts(sessionId, userId) {
  if (!userId || !sessionId) {
    throw new Error('Missing required parameters');
  }

  // Find guest cart with ordered lines
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
        orderBy: { position: 'asc' },
      },
    },
    where: { sessionId },
  });

  if (!guestCart) {
    throw new Error('Guest cart not found');
  }

  // Find or create user cart with new checkout URL
  let userCart = await prisma.cart.findFirst({
    include: {
      lines: {
        orderBy: { position: 'asc' },
      },
    },
    where: { userId },
  });

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: {
        checkoutUrl: generateCheckoutUrl(),
        userId,
      },
      include: {
        lines: {
          orderBy: { position: 'asc' },
        },
      },
    });
  } else {
    userCart = await prisma.cart.update({
      data: {
        checkoutUrl: generateCheckoutUrl(),
      },
      include: {
        lines: {
          orderBy: { position: 'asc' },
        },
      },
      where: { id: userCart.id },
    });
  }

  // Get next available position in user cart
  const nextPosition = await getNextPosition(userCart.id);

  // Merge cart lines with proper positioning
  await Promise.all(
    guestCart.lines.map(async (line, index) => {
      const existingLine = userCart.lines.find(
        (l) => l.productVariantId === line.productVariantId
      );

      if (existingLine) {
        return prisma.cartLine.update({
          data: {
            quantity: existingLine.quantity + line.quantity,
            // Maintain existing position
          },
          where: { id: existingLine.id },
        });
      }
      return prisma.cartLine.create({
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
          orderBy: { position: 'asc' },
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

  const position = await getNextPosition(cart.id);

  await prisma.cartLine.create({
    data: {
      cartId: cart.id,
      position,
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
