import prisma from '@/lib/prisma';

import { fullCartIncludes } from './cartSchema';

// Helper function to format amounts with 2 decimal places
const formatAmount = (amount) => parseFloat(amount.toFixed(2));

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

  // Calculate all amounts and format them to 2 decimal places
  const subtotalAmount = formatAmount(
    cart.lines.reduce(
      (sum, line) => sum + line.productVariant.price.amount * line.quantity,
      0
    )
  );

  const discountAmount = formatAmount(
    cart.lines.reduce(
      (sum, line) =>
        sum +
        line.discountAllocations.reduce(
          (lineSum, allocation) => lineSum + allocation.amount.amount,
          0
        ),
      0
    )
  );

  const giftCardAmount = formatAmount(
    cart.giftCards.reduce(
      (sum, giftCard) => sum + giftCard.amountUsed.amount,
      0
    )
  );

  const currencyCode =
    cart.lines[0]?.productVariant.price.currencyCode || 'USD';

  // Use environment variables for tax rate and shipping amount
  const estimatedTaxRate = +process.env.ESTIMATED_TAX_RATE;
  const estimatedShippingAmount = formatAmount(
    +process.env.ESTIMATED_SHIPPING_AMOUNT
  );

  const estimatedTaxAmount = formatAmount(subtotalAmount * estimatedTaxRate);
  const totalAmount = formatAmount(
    Math.max(
      0,
      subtotalAmount -
        discountAmount -
        giftCardAmount +
        estimatedTaxAmount +
        estimatedShippingAmount
    )
  );

  // Helper function to create money records with formatted amounts
  const createMoneyRecord = (amount) => ({
    create: {
      amount: formatAmount(amount),
      currencyCode,
    },
  });

  // Check if cartCost exists
  const existingCartCost = await prisma.cartCost.findUnique({
    where: { cartId },
  });

  const updateData = {
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
  };

  if (existingCartCost) {
    // Update existing cart cost
    await prisma.cartCost.update({
      data: updateData,
      where: { cartId },
    });
  } else {
    await prisma.cartCost.create({
      data: {
        cart: { connect: { id: cartId } },
        ...updateData,
      },
    });
  }

  return prisma.cart.findUnique({
    include: fullCartIncludes,
    where: { id: cartId },
  });
}
