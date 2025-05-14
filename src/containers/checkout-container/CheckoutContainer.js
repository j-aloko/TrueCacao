'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

import { useCart } from '@/hooks/useCart';

import CheckoutOrderContainer from '../checkout-order-container/CheckoutOrderContainer';
import ShippingInformationContainer from '../shpping-information-container/ShippingInformationContainer';

function CheckoutContainer() {
  const { cart } = useCart();

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {/* Shipping Details Scrolls Normally */}
        <Grid size={7} p={2}>
          <ShippingInformationContainer />
        </Grid>

        {/* Sticky Checkout Order Summary */}
        <Grid
          size={5}
          p={2}
          bgcolor="background.paper"
          borderRadius={4}
          sx={{
            height: 'fit-content',
            overflow: 'visible',
            position: 'sticky',
            top: (theme) => theme.mixins.toolbar.minHeight,
          }}
        >
          <CheckoutOrderContainer cart={cart} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default CheckoutContainer;
