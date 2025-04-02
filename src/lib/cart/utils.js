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
      include: { lines: true },
      where: { userId },
    });
  } else if (sessionId) {
    cart = await prisma.cart.findFirst({
      include: { lines: true },
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
      include: { lines: true },
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
    include: { lines: true },
    where: { id: cart.id },
  });
}

// Calculate cart totals
export async function calculateCartTotals(cartId) {
  const cart = await prisma.cart.findUnique({
    include: {
      cost: true,
      discountCodes: {
        include: { discount: true },
      },
      giftCards: {
        include: {
          amountUsed: true,
          presentmentAmountUsed: true,
        },
      },
      lines: {
        include: {
          discountAllocations: {
            include: {
              amount: true,
              discount: true,
            },
          },
          productVariant: {
            include: {
              price: true,
              product: true,
            },
          },
        },
      },
    },
    where: { id: cartId },
  });

  if (!cart) throw new Error('Cart not found');

  // Calculate line items subtotal
  const lineItemsSubtotal = cart.lines.reduce(
    (total, line) =>
      total + Number(line.productVariant.price.amount) * line.quantity,
    0
  );

  // Calculate discounts from line items
  const lineItemDiscounts = cart.lines.reduce(
    (total, line) =>
      total +
      line.discountAllocations.reduce(
        (lineTotal, allocation) => lineTotal + Number(allocation.amount.amount),
        0
      ),
    0
  );

  // Calculate cart-level discounts
  const cartLevelDiscounts = cart.discountCodes.reduce(
    (total, discountCode) => {
      if (!discountCode.applicable) return total;

      const { discount } = discountCode;
      if (discount.type === 'FIXED_AMOUNT') {
        return total + Number(discount.value.amount);
      }
      if (discount.type === 'PERCENTAGE') {
        return (
          total + lineItemsSubtotal * (Number(discount.value.amount) / 100)
        );
      }

      return total;
    },
    0
  );

  // Calculate gift cards applied
  const giftCardsAmount = cart.giftCards.reduce(
    (total, giftCard) => total + Number(giftCard.presentmentAmountUsed.amount),
    0
  );

  // Calculate taxes (simplified example)
  const taxRate = 0.08; // 8% tax rate
  const taxableAmount = Math.max(
    0,
    lineItemsSubtotal - lineItemDiscounts - cartLevelDiscounts
  );
  const taxAmount = taxableAmount * taxRate;

  // Calculate shipping (placeholder)
  const shippingAmount = 5.99; // Flat rate example

  // Calculate final totals
  const subtotal = lineItemsSubtotal;
  const totalDiscounts = lineItemDiscounts + cartLevelDiscounts;
  const total = Math.max(
    0,
    subtotal - totalDiscounts + taxAmount + shippingAmount - giftCardsAmount
  );

  // Prepare money data
  const currencyCode =
    cart.lines[0]?.productVariant.price.currencyCode || 'USD';
  const moneyData = {
    amount: total,
    currencyCode,
  };

  // Update cart cost in database
  const costOperations = [];

  if (cart.cost) {
    // Update existing cost record
    costOperations.push(
      prisma.cartCost.update({
        data: {
          discountAmount: totalDiscounts,
          shippingAmount,
          subtotal: { update: { amount: lineItemsSubtotal } },
          subtotalAmount: lineItemsSubtotal,
          total: { update: { amount: total } },
          totalAmount: total,
          totalTax: { update: { amount: taxAmount } },
          totalTaxAmount: taxAmount,
          ...(cart.cost.shippingId && {
            shipping: { update: { amount: shippingAmount } },
          }),
          ...(cart.cost.discountId && {
            discount: { update: { amount: totalDiscounts } },
          }),
        },
        where: { cartId },
      })
    );
  } else {
    // Create new cost record
    costOperations.push(
      prisma.cartCost.create({
        data: {
          cartId,
          discountAmount: totalDiscounts,
          shippingAmount,
          subtotal: { create: { ...moneyData, amount: lineItemsSubtotal } },
          subtotalAmount: lineItemsSubtotal,
          total: { create: moneyData },
          totalAmount: total,
          totalTax: { create: { ...moneyData, amount: taxAmount } },
          totalTaxAmount: taxAmount,
          ...(shippingAmount > 0 && {
            shipping: { create: { ...moneyData, amount: shippingAmount } },
          }),
          ...(totalDiscounts > 0 && {
            discount: { create: { ...moneyData, amount: totalDiscounts } },
          }),
        },
      })
    );
  }

  await prisma.$transaction(costOperations);

  return {
    currencyCode,
    discounts: totalDiscounts,
    giftCards: giftCardsAmount,
    shipping: shippingAmount,
    subtotal,
    tax: taxAmount,
    total,
  };
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
