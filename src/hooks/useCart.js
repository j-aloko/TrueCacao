'use client';

import { useCallback, useEffect, useMemo } from 'react';

import { shallowEqual } from 'react-redux';

import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  mergeCarts,
} from '../services/redux/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../services/redux/store';

export function useCart() {
  const dispatch = useAppDispatch();
  const user = false; // Consider moving this to Redux or context if it changes

  // Use shallowEqual to prevent re-renders when cart properties haven't changed
  const {
    cart,
    loading,
    error: cartError,
  } = useAppSelector(
    (state) => ({
      cart: state.cart.cart,
      error: state.cart.error,
      loading: state.cart.loading,
    }),
    shallowEqual
  );

  // Memoize the cart fetch
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Memoize the merge carts effect
  useEffect(() => {
    if (user) {
      dispatch(mergeCarts());
    }
  }, [dispatch, user]);

  // Memoize action dispatchers to maintain stable references
  const addItem = useCallback(
    ({ productVariantId, quantity = 1 }) =>
      dispatch(addCartItem({ productVariantId, quantity })).unwrap(),
    [dispatch]
  );

  const updateItem = useCallback(
    ({ itemId, quantity }) =>
      dispatch(updateCartItem({ itemId, quantity })).unwrap(),
    [dispatch]
  );

  const removeItem = useCallback(
    ({ itemId }) => dispatch(removeCartItem(itemId)).unwrap(),
    [dispatch]
  );

  // Memoize the returned object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      addItem,
      cart,
      error: cartError,
      loading,
      removeItem,
      updateItem,
    }),
    [addItem, cart, cartError, loading, removeItem, updateItem]
  );
}
