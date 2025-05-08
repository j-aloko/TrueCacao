'use client';

import { useCallback, useEffect } from 'react';

import { shallowEqual } from 'react-redux';

import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  mergeCarts,
  optimisticAddItem,
  rollbackAddItem,
  optimisticUpdateItem,
  rollbackUpdateItem,
  optimisticRemoveItem,
  rollbackRemoveItem,
  optimisticUpdateCost,
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

  const addItem = useCallback(
    async (payload) => {
      dispatch(optimisticAddItem(payload));
      dispatch(optimisticUpdateCost());

      try {
        await dispatch(addCartItem(payload)).unwrap();
      } catch {
        dispatch(rollbackAddItem(payload.productVariant?.id));
      }
    },
    [dispatch]
  );

  const updateItem = useCallback(
    async ({ id, quantity }) => {
      const originalQuantity = cart.lines.find(
        (item) => item.id === id
      )?.quantity;
      dispatch(optimisticUpdateItem({ id, newQuantity: quantity }));
      dispatch(optimisticUpdateCost());

      try {
        await dispatch(updateCartItem({ id, quantity })).unwrap();
      } catch {
        dispatch(rollbackUpdateItem({ id, originalQuantity }));
      }
    },
    [dispatch, cart.lines]
  );

  const removeItem = useCallback(
    async (payload) => {
      const item = cart.lines.find((line) => line.id === payload.id);
      dispatch(optimisticRemoveItem(payload.id));
      dispatch(optimisticUpdateCost());

      try {
        await dispatch(removeCartItem(payload)).unwrap();
      } catch {
        dispatch(rollbackRemoveItem(item));
      }
    },
    [dispatch, cart.lines]
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
