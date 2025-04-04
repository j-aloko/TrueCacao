import prisma from '../prisma';

export async function getTaxRateForCart(cartId) {
  try {
    // Try to get tax rate based on shipping address
    const cartWithAddress = await prisma.cart.findUnique({
      select: {
        user: {
          select: {
            addresses: {
              select: { country: true, state: true },
              where: { isDefault: true },
            },
          },
        },
      },
      where: { id: cartId },
    });

    // Default tax rate (8%)
    let taxRate = 0.08;

    if (cartWithAddress?.user?.addresses?.length > 0) {
      const address = cartWithAddress.user.addresses[0];

      // You could implement more sophisticated tax logic here
      // For example, query a tax service or database table
      const regionalTaxRate = await prisma.taxRate.findFirst({
        select: { rate: true },
        where: {
          country: address.country,
          state: address.state || undefined,
        },
      });

      if (regionalTaxRate) {
        taxRate = Number(regionalTaxRate.rate) / 100;
      }
    }

    return taxRate;
  } catch (error) {
    console.error('Error calculating tax rate:', error);
    return 0.08; // Fallback to default rate
  }
}
