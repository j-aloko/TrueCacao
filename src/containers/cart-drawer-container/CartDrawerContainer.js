'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import CartDrawerHeader from '@/components/cart-drawer-header/CartDrawerHeader';
import CartItem from '@/components/cart-item/CartItem';
import SwipeDrawer from '@/components/swipe-drawer/SwipeDrawer';
import TextBlock from '@/components/text-block/TextBlock';
import { useCart } from '@/hooks/useCart';
import {
  openDrawer,
  closeDrawer,
} from '@/services/redux/features/cart-drawer/cartDrawerSlice';
import { useAppDispatch, useAppSelector } from '@/services/redux/store';

function CartDrawerContainer() {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.cartDrawer);

  const { cart } = useCart();

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
            {cart?.lines?.length > 0
              ? React.Children.toArray(
                  cart.lines.map(
                    ({
                      id,
                      productVariant: {
                        packaging,
                        weight,
                        price: { amount, currencyCode },
                        product: { name },
                      },
                      quantity,
                    }) => (
                      <CartItem
                        key={id}
                        image="/product-images/Alltime-cocoa-powder-1.jpg"
                        packaging={packaging}
                        weight={weight}
                        productName={name}
                        itemPrice={`${currencyCode}${amount}`}
                        quantity={quantity}
                      />
                    )
                  )
                )
              : null}
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
              {'Checkout \u00A0 . \u00A0 GH₵300'}
            </Button>
          </Box>
        </Box>
      </Box>
    </SwipeDrawer>
  );
}
export default CartDrawerContainer;
