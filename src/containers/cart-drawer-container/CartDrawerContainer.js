'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import CartDrawerHeader from '@/components/cart-drawer-header/CartDrawerHeader';
import CartItem from '@/components/cart-item/CartItem';
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <CartDrawerHeader title="Cart" onClose={handleClose} />
        <Divider />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
          <CartItem image="/product-images/Alltime-cocoa-powder-1.jpg" />
          <CartItem image="/product-images/royale-cocoa-powder-3.jpg" />
        </Box>
      </Box>
      <Divider />
      <Box sx={{ marginTop: 'auto' }}>Checkout</Box>
    </SwipeDrawer>
  );
}

export default CartDrawerContainer;
