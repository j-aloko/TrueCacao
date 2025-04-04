import prisma from '../prisma';

export async function calculateShippingForCart(cartId) {
  try {
    // Get cart with necessary information
    const cart = await prisma.cart.findUnique({
      include: {
        lines: {
          include: {
            productVariant: {
              select: { weight: true },
            },
          },
        },
        user: {
          select: {
            addresses: {
              select: { country: true },
              where: { isDefault: true },
            },
          },
        },
      },
      where: { id: cartId },
    });

    if (!cart || cart.lines.length === 0) return 0;

    // Calculate total weight
    const totalWeight = cart.lines.reduce(
      (sum, line) => sum + line.productVariant.weight * line.quantity,
      0
    );

    // Determine destination country
    const country = cart.user?.addresses?.[0]?.country || 'US';

    // Simple shipping calculation logic - replace with your actual shipping service integration
    if (country === 'US') {
      if (totalWeight < 500) return 5.99; // Under 500g
      if (totalWeight < 2000) return 9.99; // Under 2kg
      return 14.99; // Over 2kg
    }
    // International shipping
    if (totalWeight < 500) return 14.99;
    if (totalWeight < 2000) return 24.99;
    return 39.99;
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return 5.99; // Fallback flat rate
  }
}
