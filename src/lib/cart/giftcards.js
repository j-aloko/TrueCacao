import prisma from '@/lib/prisma';

import { calculateAndUpdateCartCost } from './costCalculator';
import { getOrCreateCart } from './utils';

export async function applyGiftCardToCart(sessionId, userId, code) {
  return prisma.$transaction(async (tx) => {
    const cart = await getOrCreateCart(sessionId, userId);

    const giftCard = await tx.giftCard.findUnique({
      include: { balance: true },
      where: { code },
    });

    if (!giftCard) throw new Error('Invalid gift card');
    if (giftCard.balance.amount <= 0) {
      throw new Error('Gift card has no balance');
    }

    if (giftCard.expiresAt && new Date() > giftCard.expiresAt) {
      throw new Error('Gift card expired');
    }

    // Check if gift card is already applied
    const existingCard = await tx.appliedGiftCard.findFirst({
      where: {
        cartId: cart.id,
        giftCardId: giftCard.id,
      },
    });

    if (existingCard) throw new Error('Gift card already applied');

    // Calculate amount to use (up to cart total or gift card balance)
    const cartCost = await tx.cartCost.findUnique({
      include: { total: true },
      where: { cartId: cart.id },
    });

    const amountToUse = Math.min(
      giftCard.balance.amount,
      cartCost?.total?.amount || 0
    );

    if (amountToUse <= 0) throw new Error('No applicable amount to use');

    // Apply gift card to cart
    await tx.appliedGiftCard.create({
      data: {
        amountUsed: {
          create: {
            amount: amountToUse,
            currencyCode: giftCard.balance.currencyCode,
          },
        },
        balance: {
          create: {
            amount: giftCard.balance.amount - amountToUse,
            currencyCode: giftCard.balance.currencyCode,
          },
        },
        cartId: cart.id,
        giftCardId: giftCard.id,
        lastCharacters: code.slice(-4),
        presentmentAmountUsed: {
          create: {
            amount: amountToUse,
            currencyCode: giftCard.balance.currencyCode,
          },
        },
      },
    });

    return calculateAndUpdateCartCost(cart.id);
  });
}

export async function removeGiftCardFromCart(sessionId, userId, code) {
  return prisma.$transaction(async (tx) => {
    const cart = await getOrCreateCart(sessionId, userId);

    const giftCard = await tx.giftCard.findUnique({
      where: { code },
    });

    if (!giftCard) throw new Error('Invalid gift card');

    await tx.appliedGiftCard.deleteMany({
      where: {
        cartId: cart.id,
        giftCardId: giftCard.id,
      },
    });

    return calculateAndUpdateCartCost(cart.id);
  });
}
