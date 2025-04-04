import prisma from '../prisma';
import { calculateShippingForCart } from './shipping';
import { getTaxRateForCart } from './tax';

// src/lib/cart/totals.js
export async function calculateCartTotals(cartId) {
  // Step 1: Fetch minimal required data first
  const cart = await prisma.cart.findUnique({
    select: {
      cost: true,
      lines: {
        select: {
          id: true,
          productVariant: {
            select: {
              id: true,
              price: {
                select: {
                  amount: true,
                  currencyCode: true,
                },
              },
            },
          },
          quantity: true,
        },
      },
    },
    where: { id: cartId },
  });

  if (!cart) throw new Error('Cart not found');

  const currencyCode =
    cart.lines[0]?.productVariant.price.currencyCode || 'USD';

  // Step 2: Calculate line items subtotal
  const lineItemsSubtotal = cart.lines.reduce(
    (total, line) =>
      total + Number(line.productVariant.price.amount) * line.quantity,
    0
  );

  // Step 3: Fetch and calculate discounts in separate queries
  const [discounts, giftCards] = await Promise.all([
    prisma.cartDiscountCode.findMany({
      include: { discount: { include: { value: true } } },
      where: { applicable: true, cartId },
    }),
    prisma.appliedGiftCard.findMany({
      include: { presentmentAmountUsed: true },
      where: { cartId },
    }),
  ]);

  // Step 4: Calculate all discounts
  const discountResults = await calculateDiscounts({
    cartId,
    currencyCode,
    discounts,
    lineItemsSubtotal,
  });

  // Step 5: Calculate gift cards
  const giftCardsAmount = giftCards.reduce(
    (total, card) => total + Number(card.presentmentAmountUsed.amount),
    0
  );

  // Step 6: Calculate taxes (from config or database)
  const taxRate = await getTaxRateForCart(cartId);
  const taxableAmount = Math.max(
    0,
    lineItemsSubtotal - discountResults.totalDiscounts
  );
  const taxAmount = taxableAmount * taxRate;

  // Step 7: Calculate shipping (from shipping service)
  const shippingAmount = await calculateShippingForCart(cartId);

  // Step 8: Final totals
  const total = Math.max(
    0,
    lineItemsSubtotal -
      discountResults.totalDiscounts +
      taxAmount +
      shippingAmount -
      giftCardsAmount
  );

  // Step 9: Update cart cost
  await updateCartCost({
    cartId,
    currencyCode,
    existingCost: cart.cost,
    lineItemsSubtotal,
    shippingAmount,
    taxAmount,
    total,
    totalDiscounts: discountResults.totalDiscounts,
  });

  return {
    currencyCode,
    discounts: discountResults,
    giftCards: giftCardsAmount,
    shipping: shippingAmount,
    subtotal: lineItemsSubtotal,
    tax: taxAmount,
    total,
  };
}

// Helper function for discount calculations
async function calculateDiscounts({ cartId, lineItemsSubtotal, discounts }) {
  const lineItemDiscounts = await prisma.discountAllocation.findMany({
    include: { amount: true },
    where: { cartLine: { cartId } },
  });

  const lineItemDiscountsTotal = lineItemDiscounts.reduce(
    (total, allocation) => total + Number(allocation.amount.amount),
    0
  );

  const cartLevelDiscounts = discounts.reduce((total, discountCode) => {
    const { discount } = discountCode;
    if (discount.type === 'FIXED_AMOUNT') {
      return total + Number(discount.value.amount);
    }
    if (discount.type === 'PERCENTAGE') {
      return total + lineItemsSubtotal * (Number(discount.value.amount) / 100);
    }
    return total;
  }, 0);

  return {
    cartLevelDiscounts,
    lineItemDiscounts: lineItemDiscountsTotal,
    totalDiscounts: lineItemDiscountsTotal + cartLevelDiscounts,
  };
}

// Helper function for updating cart cost
async function updateCartCost({
  cartId,
  currencyCode,
  lineItemsSubtotal,
  totalDiscounts,
  taxAmount,
  shippingAmount,
  total,
  existingCost,
}) {
  const moneyFields = {
    amount: 0, // Will be overridden
    currencyCode,
  };

  const costData = {
    discountAmount: totalDiscounts,
    shippingAmount,
    subtotal: { update: { ...moneyFields, amount: lineItemsSubtotal } },
    subtotalAmount: lineItemsSubtotal,
    total: { update: { ...moneyFields, amount: total } },
    totalAmount: total,
    totalTax: { update: { ...moneyFields, amount: taxAmount } },
    totalTaxAmount: taxAmount,
  };

  if (existingCost) {
    await prisma.cartCost.update({
      data: costData,
      where: { cartId },
    });
  } else {
    await prisma.cartCost.create({
      data: {
        cart: { connect: { id: cartId } },
        ...costData,
        subtotal: { create: { ...moneyFields, amount: lineItemsSubtotal } },
        total: { create: { ...moneyFields, amount: total } },
        totalTax: { create: { ...moneyFields, amount: taxAmount } },
        ...(shippingAmount > 0 && {
          shipping: { create: { ...moneyFields, amount: shippingAmount } },
        }),
        ...(totalDiscounts > 0 && {
          discount: { create: { ...moneyFields, amount: totalDiscounts } },
        }),
      },
    });
  }
}
