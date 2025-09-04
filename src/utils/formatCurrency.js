export const formatCurrency = (currencyCode, amount) => {
  const value = parseFloat(amount || 0);
  return `${currencyCode || ''}${value.toFixed(2)}`;
};
