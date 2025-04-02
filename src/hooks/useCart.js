'use client';

import { useEffect } from 'react';

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
  const user = false;

  const {
    cart,
    loading,
    error: cartError,
  } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(mergeCarts());
    }
  }, [dispatch, user]);

  const addItem = ({ productVariantId, quantity = 1 }) =>
    dispatch(addCartItem({ productVariantId, quantity })).unwrap();

  const updateItem = ({ itemId, quantity }) =>
    dispatch(updateCartItem({ itemId, quantity })).unwrap();

  const removeItem = ({ itemId }) => dispatch(removeCartItem(itemId)).unwrap();

  return {
    addItem,
    cart,
    error: cartError,
    loading,
    removeItem,
    updateItem,
  };
}
