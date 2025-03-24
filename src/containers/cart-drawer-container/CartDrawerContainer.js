'use client';

import React from 'react';

import SwipeDrawer from '@/components/swipe-drawer/SwipeDrawer';
import {
  openDrawer,
  closeDrawer,
} from '@/services/redux/features/cart-drawer/cartDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/services/redux/store';

function CartDrawerContainer() {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.cartDrawer);

  const handleOpen = () => {
    dispatch(openDrawer());
  };

  const handleClose = () => {
    dispatch(closeDrawer());
  };

  return (
    <SwipeDrawer
      anchor="right"
      open={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
    >
      CartDrawer Items
    </SwipeDrawer>
  );
}

export default CartDrawerContainer;
