import { initialState } from '../features/cart/cartSlice';

export const cartExpirationMiddleware = () => (next) => (action) => {
  if (action.type === 'persist/REHYDRATE' && action.payload?.cart?.createdAt) {
    const now = Date.now();
    const expirationTime = 14 * 24 * 60 * 60 * 1000; // 14 days
    const cartCreatedAt = new Date(action.payload.cart.createdAt).getTime();
    if (now - cartCreatedAt > expirationTime) {
      action.payload.cart = initialState;
    }
  }
  return next(action);
};
