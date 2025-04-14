export function generateCheckoutUrl() {
  return `/checkout/${crypto.randomUUID()}`;
}
