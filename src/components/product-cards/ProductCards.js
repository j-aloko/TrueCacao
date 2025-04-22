'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';

import ProductCard from '../product-card/ProductCard';
import TextBlock from '../text-block/TextBlock';

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
      sx={(theme) => ({
        backgroundColor: theme.palette.grey[100],
        py: 8,
      })}
    >
      <Container maxWidth="xl">
        <TextBlock
          text="Our Premium Selection"
          variant="h4"
          component="h2"
          sx={(theme) => ({
            color: theme.palette.primary.main,
            mb: 6,
            textAlign: 'center',
          })}
        />

        <Grid container spacing={4} justifyContent="center">
          {React.Children.toArray(
            products.map((product) => (
              <Grid
                key={product.id}
                size={{ lg: 6, md: 6, sm: 6, xs: 12 }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <ProductCard product={product} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductCards;
