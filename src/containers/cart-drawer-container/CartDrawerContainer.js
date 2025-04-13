'use client';

import React, { useCallback, useMemo } from 'react';

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
  const { cart, updateItem, removeItem, itemLoadingStates } = useCart();

  const handleOpen = useCallback(() => {
    dispatch(openDrawer());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(closeDrawer());
  }, [dispatch]);

  const hasItems = cart?.lines?.length > 0;

  const handleCartItemIncrement = useCallback(
    (id, currentQuantity) => {
      updateItem({ id, quantity: currentQuantity + 1 });
    },
    [updateItem]
  );

  const handleCartItemDecrement = useCallback(
    (id, currentQuantity) => {
      updateItem({ id, quantity: currentQuantity - 1 });
    },
    [updateItem]
  );

  const handleRemoveCartItem = useCallback(
    (id) => {
      removeItem({ id });
    },
    [removeItem]
  );

  const cartItems = useMemo(() => {
    if (!hasItems) return null;

    return cart.lines.map((line) => {
      const lineId = line?.id || '';
      const variant = line?.productVariant || {};
      const product = variant?.product || {};
      const price = variant?.price || {};

      return (
        <CartItem
          key={lineId}
          id={lineId}
          image="/product-images/Alltime-cocoa-powder-1.jpg"
          packaging={variant.packaging}
          weight={variant.weight}
          productName={product.name}
          itemPrice={`${price.currencyCode || ''}${price.amount || ''}`}
          quantity={line.quantity || 0}
          loading={itemLoadingStates?.[lineId] || {}}
          onCartItemIncrement={handleCartItemIncrement}
          onCartItemDecrement={handleCartItemDecrement}
          onRemoveCartItem={handleRemoveCartItem}
        />
      );
    });
  }, [
    cart?.lines,
    hasItems,
    itemLoadingStates,
    handleCartItemIncrement,
    handleCartItemDecrement,
    handleRemoveCartItem,
  ]);

  const checkoutTotal = useMemo(() => {
    if (!cart?.cost?.subtotal) return 'Checkout';
    return `Checkout \u00A0 • \u00A0 ${cart.cost.subtotal.currencyCode || ''}${cart.cost.subtotal.amount || ''}`;
  }, [cart?.cost?.subtotal]);

  return (
    <SwipeDrawer
      anchor="right"
      open={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      data-testid="cart-drawer"
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

        {/* Main content section */}
        {hasItems ? (
          <>
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                p: 2,
              }}
              role="region"
              aria-label="Cart items"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cartItems}
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
                  onClick={handleClose}
                  aria-label={checkoutTotal}
                >
                  {checkoutTotal}
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'center',
            }}
            aria-live="polite"
          >
            <TextBlock text="Your Cart is Empty" variant="h6" component="p" />
          </Box>
        )}
      </Box>
    </SwipeDrawer>
  );
}

export default React.memo(CartDrawerContainer);
