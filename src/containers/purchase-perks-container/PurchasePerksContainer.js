'use client';

import React from 'react';

import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReplayIcon from '@mui/icons-material/Replay';
import VerifiedIcon from '@mui/icons-material/Verified';
import Grid from '@mui/material/Grid2';

import PurchasePerk from '@/components/purchase-perk/PurchasePerk';

const perks = [
  {
    icon: <LocalShippingIcon color="secondary" />,
    title: 'Fast Shipping',
  },
  {
    icon: <ReplayIcon color="secondary" />,
    title: '30-day return policy',
  },
  {
    icon: <VerifiedIcon color="secondary" />,
    title: 'ISO Certified',
  },
];

function PurchasePerksContainer() {
  return (
    <Grid container spacing={1}>
      {React.Children.toArray(
        perks.map((perk) => (
          <Grid size={{ xs: 6 }} key={perk.title}>
            <PurchasePerk {...perk} />
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default PurchasePerksContainer;
