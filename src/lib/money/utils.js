import { round } from 'mathjs';

export const formatAmount = (amount) => {
  if (typeof amount !== 'number') {
    throw new Error('Amount must be a number');
  }

  return round(amount, 2);
};

export const moneyRecord = (amount, currencyCode = 'USD') => ({
  create: { amount: formatAmount(amount), currencyCode },
});
