'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import CartDrawerHeader from '@/components/cart-drawer-header/CartDrawerHeader';
import CartItem from '@/components/cart-item/CartItem';
import SwipeDrawer from '@/components/swipe-drawer/SwipeDrawer';
import TextBlock from '@/components/text-block/TextBlock';
import {
  openDrawer,
  closeDrawer,
} from '@/services/redux/features/cart-drawer/cartDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/services/redux/store';

function CartDrawerContainer() {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.cartDrawer);

  const price = 359.99;

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header section */}
        <Box sx={{ flexShrink: 0 }}>
          <CartDrawerHeader title="Cart" onClose={handleClose} />
          <Divider />
        </Box>

        {/* Scrollable content section */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CartItem image="/product-images/Alltime-cocoa-powder-1.jpg" />
            <CartItem image="/product-images/royale-cocoa-powder-3.jpg" />
            <CartItem image="/product-images/royale-cocoa-powder-3.jpg" />
            <CartItem image="/product-images/royale-cocoa-powder-3.jpg" />
          </Box>
        </Box>

        {/* Footer section */}
        <Box
          sx={{
            flexShrink: 0,
            marginTop: 'auto',
          }}
        >
          <Divider />
          <Box sx={{ p: 2 }}>
            <TextBlock
              text="Taxes and shipping calculated at checkout"
              variant="body2"
              component="p"
              sx={{ fontWeight: 500, mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              onClick={null}
            >
              {`Checkout \u00A0 . \u00A0 GH₵${price.toFixed(2)}`}
            </Button>
          </Box>
        </Box>
      </Box>
    </SwipeDrawer>
  );
}
export default CartDrawerContainer;
