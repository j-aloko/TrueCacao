'use client';

import { useEffect } from 'react';

import { fetchCart } from '../services/redux/features/cart/cartSlice';
import { useAppDispatch } from '../services/redux/store';

export function useCart() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const cartBoot = async () => {
      dispatch(fetchCart());
    };
    cartBoot();
  }, [dispatch]);
}
