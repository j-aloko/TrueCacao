import prisma from '@/lib/prisma';

import { fullCartIncludes } from './cartSchema';

export async function calculateAndUpdateCartCost(cartId) {
  const cart = await prisma.cart.findUnique({
    include: {
      discountCodes: true,
      giftCards: {
        include: {
          amountUsed: true,
          balance: true,
          giftCard: true,
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
            },
          },
        },
        orderBy: { position: 'asc' },
      },
    },
    where: { id: cartId },
  });

  if (!cart) throw new Error('Cart not found');

  // Calculate all amounts
  const subtotalAmount = cart.lines.reduce(
    (sum, line) => sum + line.productVariant.price.amount * line.quantity,
    0
  );
  const discountAmount = cart.lines.reduce(
    (sum, line) =>
      sum +
      line.discountAllocations.reduce(
        (lineSum, allocation) => lineSum + allocation.amount.amount,
        0
      ),
    0
  );
  const giftCardAmount = cart.giftCards.reduce(
    (sum, giftCard) => sum + giftCard.amountUsed.amount,
    0
  );
  const currencyCode =
    cart.lines[0]?.productVariant.price.currencyCode || 'USD';

  // Use environment variables for tax rate and shipping amount
  const estimatedTaxRate = +process.env.ESTIMATED_TAX_RATE;
  const estimatedShippingAmount = +process.env.ESTIMATED_SHIPPING_AMOUNT;

  const estimatedTaxAmount = subtotalAmount * estimatedTaxRate;
  const totalAmount = Math.max(
    0,
    subtotalAmount -
      discountAmount -
      giftCardAmount +
      estimatedTaxAmount +
      estimatedShippingAmount
  );

  // Helper function to create money records
  const createMoneyRecord = (amount) => ({
    create: {
      amount,
      currencyCode,
    },
  });

  // Check if cartCost exists
  const existingCartCost = await prisma.cartCost.findUnique({
    where: { cartId },
  });

  if (existingCartCost) {
    // Update existing cart cost
    await prisma.cartCost.update({
      data: {
        discount:
          discountAmount > 0 ? createMoneyRecord(discountAmount) : undefined,
        discountAmount,
        estimatedShipping: createMoneyRecord(estimatedShippingAmount),
        estimatedTax: createMoneyRecord(estimatedTaxAmount),
        shippingAmount: estimatedShippingAmount,
        subtotal: createMoneyRecord(subtotalAmount),
        subtotalAmount,
        total: createMoneyRecord(totalAmount),
        totalAmount,
        totalTax: createMoneyRecord(estimatedTaxAmount),
        totalTaxAmount: estimatedTaxAmount,
      },
      where: { cartId },
    });
  } else {
    await prisma.cartCost.create({
      data: {
        cart: { connect: { id: cartId } }, // Using `cart` to establish the relationship
        discount:
          discountAmount > 0 ? createMoneyRecord(discountAmount) : undefined,
        discountAmount,
        estimatedShipping: createMoneyRecord(estimatedShippingAmount),
        estimatedTax: createMoneyRecord(estimatedTaxAmount),
        shippingAmount: estimatedShippingAmount,
        subtotal: createMoneyRecord(subtotalAmount),
        subtotalAmount,
        total: createMoneyRecord(totalAmount),
        totalAmount,
        totalTax: createMoneyRecord(estimatedTaxAmount),
        totalTaxAmount: estimatedTaxAmount,
      },
    });
  }

  return prisma.cart.findUnique({
    include: fullCartIncludes,
    where: { id: cartId },
  });
}
