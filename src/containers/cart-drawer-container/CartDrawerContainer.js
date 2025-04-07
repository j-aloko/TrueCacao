'use client';

import React, { useMemo, useCallback } from 'react';

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

  const totalAmount = useMemo(() => {
    if (!cart?.lines) return 0;
    return cart.lines.reduce(
      (total, line) =>
        total + parseFloat(line.productVariant.price.amount) * line.quantity,
      0
    );
  }, [cart?.lines]);

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
                {cart.lines.map((line) => (
                  <CartItem
                    key={line.id}
                    id={line.id}
                    image="/product-images/Alltime-cocoa-powder-1.jpg"
                    packaging={line.productVariant.packaging}
                    weight={line.productVariant.weight}
                    productName={line.productVariant.product.name}
                    itemPrice={`${line.productVariant.price.currencyCode}${line.productVariant.price.amount}`}
                    quantity={line.quantity}
                    loading={itemLoadingStates?.[line.id] || {}}
                    onCartItemIncrement={handleCartItemIncrement}
                    onCartItemDecrement={handleCartItemDecrement}
                    onRemoveCartItem={handleRemoveCartItem}
                  />
                ))}
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
                  onClick={handleClose} // TODO: Replace with actual checkout handler
                  aria-label={`Checkout for ${totalAmount}`}
                >
                  {`Checkout \u00A0 • \u00A0 ${cart.lines[0].productVariant.price.currencyCode}${totalAmount.toFixed(2)}`}
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
