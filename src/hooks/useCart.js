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

  // Memoized action creators with operation-specific loading states
  const addItem = useCallback(
    (payload) => {
      if (loadingStates.add) {
        return Promise.reject(new Error('Add operation already in progress'));
      }
      return dispatch(addCartItem(payload)).unwrap();
    },
    [dispatch, loadingStates.add]
  );

  const updateItem = useCallback(
    (payload) => {
      if (loadingStates.update) {
        return Promise.reject(
          new Error('Update operation already in progress')
        );
      }
      return dispatch(updateCartItem(payload)).unwrap();
    },
    [dispatch, loadingStates.update]
  );

  const removeItem = useCallback(
    (payload) => {
      if (loadingStates.remove) {
        return Promise.reject(
          new Error('Remove operation already in progress')
        );
      }
      return dispatch(removeCartItem(payload)).unwrap();
    },
    [dispatch, loadingStates.remove]
  );

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
