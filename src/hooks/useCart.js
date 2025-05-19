'use client';

import { useEffect } from 'react';

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

  const { cart, loading, loadingStates, itemLoadingStates, error } =
    useAppSelector(
      (state) => ({
        cart: state.cart.cart,
        error: state.cart.error,
        itemLoadingStates: state.cart.itemLoadingStates,
        loading: state.cart.loading,
        loadingStates: state.cart.loadingStates,
      }),
      shallowEqual
    );

  // Singleton initialization
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

  const addItem = (payload) => dispatch(addCartItem(payload));
  const updateItem = (payload) => dispatch(updateCartItem(payload));
  const removeItem = (payload) => dispatch(removeCartItem(payload));

  return {
    addItem,
    cart,
    error,
    itemLoadingStates,
    loading,
    loadingStates,
    removeItem,
    updateItem,
  };
}
