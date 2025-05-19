export const formatAmount = (amount) => {
  if (typeof amount !== 'number') {
    throw new Error('Amount must be a number');
  }

  return parseFloat(amount.toFixed(2));
};

export const moneyRecord = (amount, currencyCode = 'USD') => ({
  create: { amount: formatAmount(amount), currencyCode },
});
