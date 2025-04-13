export const fullCartIncludes = {
  cost: {
    select: {
      discount: true,
      estimatedShipping: true,
      estimatedTax: true,
      shipping: true,
      subtotal: true,
      total: true,
      totalTax: true,
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
    select: {
      discountAllocations: {
        include: {
          amount: true,
          discount: true,
        },
      },
      id: true,
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
};
