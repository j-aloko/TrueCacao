'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import ProductCard from '../../components/product-card/ProductCard';
import TextBlock from '../../components/text-block/TextBlock';

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

function ProductCardsContainer({ products }) {
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
          sx={{
            height: 'auto',
            width: '100%',
          }}
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

export default ProductCardsContainer;
