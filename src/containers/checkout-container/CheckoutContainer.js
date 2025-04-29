'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

import BreadcrumbsNavigation from '@/components/breadcrumbs-navigation/BreadcrumbsNavigation';
import TextBlock from '@/components/text-block/TextBlock';

import CheckoutOrderContainer from '../checkout-order-container/CheckoutOrderContainer';
import ShippingInformationContainer from '../shpping-information-container/ShippingInformationContainer';

function CheckoutContainer() {
  return (
    <Box px={{ lg: 8, md: 6, xs: 2 }} p={2}>
      <Stack spacing={4}>
        <BreadcrumbsNavigation
          pathMap={{ cart: 'Cart', checkout: 'Checkout' }}
        />
        <Stack spacing={2}>
          <TextBlock text="Checkout" variant="h4" component="h2" />
          <Grid container spacing={2}>
            <Grid size={8}>
              <ShippingInformationContainer />
            </Grid>
            <Grid size={4} border="2px solid green">
              <CheckoutOrderContainer />
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </Box>
  );
}

export default CheckoutContainer;
