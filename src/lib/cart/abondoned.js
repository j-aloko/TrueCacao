import prisma from '@/lib/prisma';

import { sendEmail } from './email';

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

export async function checkAbandonedCarts() {
  const threshold = new Date();
  threshold.setHours(threshold.getHours() - 2); // 2 hours threshold

  const abandonedCarts = await prisma.abandonedCart.findMany({
    include: {
      cart: {
        include: {
          lines: {
            include: {
              productVariant: {
                include: {
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
      },
      user: true,
    },
    where: {
      lastUpdated: {
        lt: threshold,
      },
      recovered: false,
    },
  });

  await Promise.all(
    abandonedCarts
      .filter((cart) => cart.user)
      .map((cart) => sendRecoveryEmail(cart))
  );
}

async function sendRecoveryEmail(abandonedCart) {
  const recoveryLink = `${abandonedCart.cart.checkoutUrl}?recovery_token=${abandonedCart.recoveryToken}`;

  await sendEmail({
    html: `
      <p>You left items in your cart!</p>
      <p><a href="${recoveryLink}">Click here to complete your purchase</a></p>
    `,
    subject: 'Complete Your Purchase',
    to: abandonedCart.user.email,
  });

  await prisma.abandonedCart.update({
    data: {
      recoveryAttempts: {
        increment: 1,
      },
    },
    where: { id: abandonedCart.id },
  });
}

// Schedule this to run periodically (e.g., via cron job)
// checkAbandonedCarts();
