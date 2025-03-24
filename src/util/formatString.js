export const formatString = (str) => {
  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }
  return str.replace(/_/g, ' ');
};
