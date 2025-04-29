'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import BreadcrumbsNavigation from '@/components/breadcrumbs-navigation/BreadcrumbsNavigation';

function CheckoutContainer() {
  return (
    <Box p={2}>
      <Stack spacing={2}>
        <BreadcrumbsNavigation
          pathMap={{ cart: 'Cart', checkout: 'Checkout' }}
        />
      </Stack>
    </Box>
  );
}

export default CheckoutContainer;
