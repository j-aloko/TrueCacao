import prisma from '../prisma';

export function generateCheckoutUrl() {
  return `/checkout/${crypto.randomUUID()}`;
}

// Get or create cart for guest or user
export async function getOrCreateCart(sessionId, userId = null) {
  let cart;

  // Try to find existing cart
  if (userId) {
    cart = await prisma.cart.findFirst({
      include: {
        lines: {
          include: {
            productVariant: {
              include: {
                price: {
                  select: {
                    amount: true,
                    currencyCode: true,
                  },
                },
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      where: { userId },
    });
  } else if (sessionId) {
    cart = await prisma.cart.findFirst({
      include: {
        lines: {
          include: {
            productVariant: {
              include: {
                price: {
                  select: {
                    amount: true,
                    currencyCode: true,
                  },
                },
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      where: { sessionId },
    });
  }

  // Create new cart if none exists
  if (!cart) {
    const checkoutUrl = generateCheckoutUrl();

    cart = await prisma.cart.create({
      data: {
        ...(userId ? { user: { connect: { id: userId } } } : {}),
        ...(sessionId ? { sessionId } : {}),
        checkoutUrl,
        totalQuantity: 0,
      },
      include: {
        lines: {
          include: {
            productVariant: {
              include: {
                price: {
                  select: {
                    amount: true,
                    currencyCode: true,
                  },
                },
                product: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  return cart;
}

// src/lib/cart/utils.js
export async function addItemToCart(sessionId, productVariantId, quantity = 1) {
  const cart = await getOrCreateCart(sessionId);
  const existingLine = cart.lines.find(
    (line) => line.productVariantId === productVariantId
  );

  let newTotalQuantity = cart.totalQuantity;

  if (existingLine) {
    // Update existing line and calculate new total quantity
    await prisma.cartLine.update({
      data: { quantity: existingLine.quantity + quantity },
      where: { id: existingLine.id },
    });
    newTotalQuantity += quantity;
  } else {
    // Add new line and calculate new total quantity
    const variant = await prisma.productVariant.findUnique({
      select: { priceId: true },
      where: { id: productVariantId },
    });

    if (!variant) throw new Error('Product variant not found');

    await prisma.cartLine.create({
      data: {
        cartId: cart.id,
        priceId: variant.priceId,
        productVariantId,
        quantity,
      },
    });
    newTotalQuantity += quantity;
  }

  // Update cart's total quantity
  await prisma.cart.update({
    data: { totalQuantity: newTotalQuantity },
    where: { id: cart.id },
  });

  return prisma.cart.findUnique({
    include: {
      lines: {
        include: {
          productVariant: {
            include: {
              price: {
                select: {
                  amount: true,
                  currencyCode: true,
                },
              },
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    where: { id: cart.id },
  });
}

// Validate product variant stock
export async function validateStock(productVariantId, quantity) {
  const variant = await prisma.productVariant.findUnique({
    select: { stock: true },
    where: { id: productVariantId },
  });

  if (!variant || variant.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  return true;
}
