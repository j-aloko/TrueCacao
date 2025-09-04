import prisma from '@/lib/prisma';

import { fullCartIncludes } from './cartSchema';
import { formatAmount, moneyRecord } from '../money/utils';

const ESTIMATED_TAX_RATE = 0;
const ESTIMATED_SHIPPING_AMOUNT = 0;

export async function calculateAndUpdateCartCost(cartId, tx = prisma) {
  const cart = await tx.cart.findUnique({
    select: {
      giftCards: { select: { amountUsed: { select: { amount: true } } } },
      id: true,
      lines: {
        select: {
          discountAllocations: {
            select: { amount: { select: { amount: true } } },
          },
          productVariant: {
            select: { price: { select: { amount: true, currencyCode: true } } },
          },
          quantity: true,
        },
      },
    },
    where: { id: cartId },
  });

  if (!cart) throw new Error('Cart not found');

  // Perform calculations
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
    (sum, giftCard) => sum + (giftCard.amountUsed?.amount || 0),
    0
  );
  const currencyCode =
    cart.lines[0]?.productVariant.price.currencyCode || 'USD';
  const estimatedTaxAmount = subtotalAmount * ESTIMATED_TAX_RATE;
  const totalAmount = Math.max(
    0,
    subtotalAmount -
      discountAmount -
      giftCardAmount +
      estimatedTaxAmount +
      ESTIMATED_SHIPPING_AMOUNT
  );

  await tx.cartCost.upsert({
    create: {
      cart: { connect: { id: cartId } },
      discount:
        discountAmount > 0
          ? moneyRecord(discountAmount, currencyCode)
          : undefined,
      discountAmount: formatAmount(discountAmount),
      estimatedShipping: moneyRecord(ESTIMATED_SHIPPING_AMOUNT, currencyCode),
      estimatedTax: moneyRecord(estimatedTaxAmount, currencyCode),
      shippingAmount: formatAmount(ESTIMATED_SHIPPING_AMOUNT),
      subtotal: moneyRecord(subtotalAmount, currencyCode),
      subtotalAmount: formatAmount(subtotalAmount),
      total: moneyRecord(totalAmount, currencyCode),
      totalAmount: formatAmount(totalAmount),
      totalTax: moneyRecord(estimatedTaxAmount, currencyCode),
      totalTaxAmount: formatAmount(estimatedTaxAmount),
    },
    update: {
      discount:
        discountAmount > 0
          ? moneyRecord(discountAmount, currencyCode)
          : undefined,
      discountAmount: formatAmount(discountAmount),
      estimatedShipping: moneyRecord(ESTIMATED_SHIPPING_AMOUNT, currencyCode),
      estimatedTax: moneyRecord(estimatedTaxAmount, currencyCode),
      shippingAmount: formatAmount(ESTIMATED_SHIPPING_AMOUNT),
      subtotal: moneyRecord(subtotalAmount, currencyCode),
      subtotalAmount: formatAmount(subtotalAmount),
      total: moneyRecord(totalAmount, currencyCode),
      totalAmount: formatAmount(totalAmount),
      totalTax: moneyRecord(estimatedTaxAmount, currencyCode),
      totalTaxAmount: formatAmount(estimatedTaxAmount),
    },
    where: { cartId },
  });

  return tx.cart.findUnique({
    include: fullCartIncludes,
    where: { id: cartId },
  });
}
