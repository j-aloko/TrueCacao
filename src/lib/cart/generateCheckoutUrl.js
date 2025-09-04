import { ROUTES } from '@/constants/routes';

export function generateCheckoutUrl(cartId) {
  return `${ROUTES.checkout}/${cartId}`;
}
