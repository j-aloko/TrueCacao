'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import ProductCard from '../product-card/ProductCard';
import TextBlock from '../text-block/TextBlock';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  height: '100%',
  maxHeight: 600,
  padding: theme.spacing(1),
  textAlign: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function ProductCards() {
  const products = [
    {
      description:
        '100% pure, unprocessed cocoa powder with rich flavor and antioxidants.',
      id: 1,
      image: '/product-images/royale-cocoa-powder-1.jpg',
      link: '/product-cocoa',
      price: '$12.99',
      tag: 'Best Seller',
      title: 'Royale Cocoa Powder',
    },
    {
      description:
        'Single-origin dark chocolate with 90% cocoa content for true connoisseurs.',
      id: 2,
      image: '/product-images/TQ-premium-dark-chocolate-90.jpg',
      link: '/product-chocolate',
      price: '$8.99',
      tag: 'Best Seller',
      title: 'TQ Premium Dark chocolate',
    },
  ];

  return (
    <Box
      component="section"
      id="products"
      sx={() => ({
        py: 8,
      })}
    >
      <Container maxWidth="xl">
        <TextBlock
          text="Our Premium Selection"
          variant="h4"
          component="h2"
          sx={() => ({
            mb: 6,
            textAlign: 'center',
          })}
        />

        <Grid
          container
          spacing={4}
          sx={(theme) => ({
            bgcolor: theme.palette.background.paper,
            height: 'auto',
            p: { md: 4, xs: 2 },
            width: '100%',
          })}
        >
          {React.Children.toArray(
            products.map((product) => (
              <Grid size={{ md: 6, xs: 12 }} key={product.id}>
                <Item>
                  <ProductCard product={product} />
                </Item>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductCards;
