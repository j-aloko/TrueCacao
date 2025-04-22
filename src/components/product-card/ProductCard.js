import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import AspectRatioImage from '../aspect-ratio-image/AspectRatioImage';
import ProductDescription from '../product-description/ProductDescription';
import ProductName from '../product-name/ProductName';
import ProductPrice from '../product-price/ProductPrice';

function ProductCard({ product }) {
  return (
    <Stack
      spacing={2}
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
        p: 2,
      }}
    >
      <Box
        sx={{
          height: 350,
          position: 'relative',
          width: '100%',
        }}
      >
        <AspectRatioImage src={product.image} priority />

        {product.tag && (
          <Chip
            label={product.tag}
            color="secondary"
            sx={{
              fontWeight: 'bold',
              position: 'absolute',
              right: 16,
              top: 16,
            }}
          />
        )}
      </Box>

      <Stack spacing={2}>
        <ProductName name={product.title} />
        <ProductPrice price={product.price} />
        <ProductDescription productDescription={product.description} />
        <Button
          variant="contained"
          color="primary"
          href={product.link}
          sx={{
            alignSelf: 'flex-start',
            px: 4,
          }}
        >
          View Details
        </Button>
      </Stack>
    </Stack>
  );
}

export default ProductCard;
