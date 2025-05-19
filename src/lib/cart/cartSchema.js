export const fullCartIncludes = {
  cost: {
    select: {
      discount: { select: { amount: true, currencyCode: true } },
      estimatedShipping: { select: { amount: true, currencyCode: true } },
      estimatedTax: { select: { amount: true, currencyCode: true } },
      shipping: { select: { amount: true, currencyCode: true } },
      subtotal: { select: { amount: true, currencyCode: true } },
      total: { select: { amount: true, currencyCode: true } },
      totalTax: { select: { amount: true, currencyCode: true } },
    },
  },
  discountCodes: true,
  giftCards: {
    select: {
      amountUsed: true,
      balance: true,
      giftCard: true,
    },
  },
  lines: {
    orderBy: { position: 'asc' },
    select: {
      discountAllocations: {
        include: {
          amount: true,
          discount: true,
        },
      },
      id: true,
      position: true, // Include position in response
      productVariant: {
        include: {
          price: true,
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      quantity: true,
    },
  },
  user: true,
};
