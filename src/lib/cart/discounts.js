import prisma from '@/lib/prisma';

import { calculateAndUpdateCartCost } from './cost-calculator';
import { getOrCreateCart } from './utils';

export async function applyDiscountToCart(sessionId, userId, code) {
  const cart = await getOrCreateCart(sessionId, userId);

  const discount = await prisma.discount.findUnique({
    include: { value: true },
    where: { code },
  });

  if (!discount) throw new Error('Invalid discount code');
  if (discount.usedCount >= discount.maxUses) {
    throw new Error('Discount limit reached');
  }

  if (new Date() < discount.startDate || new Date() > discount.endDate) {
    throw new Error('Discount not valid');
  }

  // Check if discount is already applied
  const existingCode = await prisma.cartDiscountCode.findFirst({
    where: {
      cartId: cart.id,
      code,
    },
  });

  if (existingCode) throw new Error('Discount already applied');

  // Add discount to cart
  await prisma.cartDiscountCode.create({
    data: {
      applicable: true,
      cartId: cart.id,
      code,
    },
  });

  return calculateAndUpdateCartCost(cart.id);
}

export async function removeDiscountFromCart(sessionId, userId, code) {
  const cart = await getOrCreateCart(sessionId, userId);

  await prisma.cartDiscountCode.deleteMany({
    where: {
      cartId: cart.id,
      code,
    },
  });

  return calculateAndUpdateCartCost(cart.id);
}
