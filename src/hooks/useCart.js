'use client';

import { useCallback, useEffect } from 'react';

import { shallowEqual } from 'react-redux';

import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  mergeCarts,
} from '../services/redux/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../services/redux/store';

let cartInitialized = false;
let mergeAttempted = false;

export function useCart() {
  const dispatch = useAppDispatch();
  const user = null;

  const { cart, loading, error } = useAppSelector(
    (state) => ({
      cart: state.cart.cart,
      error: state.cart.error,
      loading: state.cart.loading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!cartInitialized) {
      cartInitialized = true;
      dispatch(fetchCart());
    }
  }, [dispatch]);

  useEffect(() => {
    if (user && !mergeAttempted && cart?.lines?.length > 0) {
      mergeAttempted = true;
      dispatch(mergeCarts());
    }
  }, [dispatch, user, cart?.lines]);

  // Memoized action creators
  const addItem = useCallback(
    (payload) => dispatch(addCartItem(payload)).unwrap(),
    [dispatch]
  );

  const updateItem = useCallback(
    (payload) => dispatch(updateCartItem(payload)).unwrap(),
    [dispatch]
  );

  const removeItem = useCallback(
    (payload) => dispatch(removeCartItem(payload)).unwrap(),
    [dispatch]
  );

  return {
    addItem,
    cart,
    error,
    loading,
    removeItem,
    updateItem,
  };
}
