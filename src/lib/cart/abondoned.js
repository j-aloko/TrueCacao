import { randomBytes } from 'crypto';

import { releaseStock } from '@/lib/inventory/stockUtils';
import prisma from '@/lib/prisma';

import { sendEmail } from './email';

export async function trackAbandonedCart(cartId, userId = null) {
  return prisma.abandonedCart.upsert({
    create: {
      cartId,
      lastUpdated: new Date(),
      recoveryToken: generateRecoveryToken(),
      userId,
    },
    update: {
      lastUpdated: new Date(),
    },
    where: { cartId },
  });
}

export async function processAbandonedCarts() {
  const threshold = new Date();
  threshold.setHours(threshold.getHours() - 2); // 2 hours threshold

  const abandonedCarts = await prisma.abandonedCart.findMany({
    include: {
      cart: {
        include: {
          lines: {
            include: {
              productVariant: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
      user: {
        select: {
          email: true,
          id: true,
        },
      },
    },
    where: {
      lastUpdated: { lt: threshold },
      recovered: false,
      recoveryAttempts: { lt: 3 }, // Max 3 attempts
    },
  });

  // Process user carts (send recovery emails)
  await Promise.all(
    abandonedCarts
      .filter((cart) => cart.user)
      .map((cart) => sendRecoveryEmail(cart))
  );

  // Process guest carts (release stock)
  await Promise.all(
    abandonedCarts
      .filter((cart) => !cart.user)
      .map((cart) => releaseGuestCartStock(cart))
  );
}

async function sendRecoveryEmail(abandonedCart) {
  const recoveryLink = `${process.env.BASE_URL}/cart/recover?token=${abandonedCart.recoveryToken}`;

  try {
    await sendEmail({
      html: `
      <h2>You left items in your cart!</h2>
      <p>We've saved your cart for you. Click below to complete your purchase:</p>
      <a href="${recoveryLink}">Complete My Order</a>
      <p>This link will expire in 24 hours.</p>
    `,
      subject: 'Complete Your Purchase',
      to: abandonedCart.user.email,
    });

    await prisma.abandonedCart.update({
      data: {
        lastAttempt: new Date(),
        recoveryAttempts: { increment: 1 },
      },
      where: { id: abandonedCart.id },
    });
  } catch (error) {
    console.error('Failed to send recovery email:', error);
  }
}

async function releaseGuestCartStock(abandonedCart) {
  try {
    await prisma.$transaction(async (tx) => {
      // Release all reserved stock
      await Promise.all(
        abandonedCart.cart.lines.map((line) =>
          releaseStock(line.productVariant.id, line.quantity, tx)
        )
      );

      // Mark as processed
      await tx.abandonedCart.update({
        data: { processed: true },
        where: { cartId: abandonedCart.cartId },
      });

      // Delete the cart
      await tx.cart.delete({
        where: { id: abandonedCart.cartId },
      });
    });
  } catch (error) {
    console.error('Failed to release guest cart stock:', error);
  }
}

function generateRecoveryToken() {
  return randomBytes(32).toString('hex');
}

// Schedule this to run periodically (e.g., via cron job)
// processAbandonedCarts();
