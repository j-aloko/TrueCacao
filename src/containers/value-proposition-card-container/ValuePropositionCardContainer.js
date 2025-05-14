'use client';

import React from 'react';

import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SpaIcon from '@mui/icons-material/Spa';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import ValuePropositionCard from '@/components/value-proposition-card/ValuePropositionCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  height: '100%',
  maxHeight: 350,
  padding: theme.spacing(1),
  textAlign: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const features = [
  {
    description:
      'Indulge in premium organic cocoa, expertly crafted by GoldenTree using ethically sourced cocoa beans from organic farms in Ghana, West Africa. ISO-certified for superior quality and rich, authentic flavor.',
    icon: <SpaIcon sx={{ height: '50px', width: '50px' }} color="secondary" />,
    title: 'Organic & Sustainable',
  },
  {
    description:
      'Packed with powerful antioxidants and heart-healthy flavonoids, our cocoa supports cardiovascular wellness while delivering rich, indulgent flavor in every bite.',
    icon: (
      <FavoriteIcon sx={{ height: '50px', width: '50px' }} color="secondary" />
    ),
    title: 'Health Benefits',
  },
  {
    description:
      'Enjoy fast and reliable delivery!, ensuring your premium cocoa products arrive fresh within 2-3 business days.',
    icon: (
      <LocalShippingIcon
        sx={{ height: '50px', width: '50px' }}
        color="secondary"
      />
    ),
    title: 'Fast Shipping',
  },
];

function ValuePropositionCardContainer() {
  return (
    <Grid
      container
      spacing={2}
      sx={{
        height: 'auto',
        width: '100%',
      }}
    >
      {React.Children.toArray(
        features.map((feature) => (
          <Grid size={{ sm: 4, xs: 12 }} key={feature.title}>
            <Item>
              <ValuePropositionCard {...feature} />
            </Item>
          </Grid>
        ))
      )}
    </Grid>
  );
}

export default ValuePropositionCardContainer;
