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
        <Grid size={7} p={2}>
          <ShippingInformationContainer />
        </Grid>
        <Grid size={5} p={2} bgcolor="background.paper" borderRadius={4}>
          <CheckoutOrderContainer cart={cart} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default CheckoutContainer;
