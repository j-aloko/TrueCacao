import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { formatString } from '@/util/formatString';
import { truncateForMetaDescription } from '@/util/seoTruncate';

import AspectRatioImage from '../aspect-ratio-image/AspectRatioImage';
import ProductName from '../product-name/ProductName';
import ProductSummarizedDescription from '../product-summarized-description/ProductSummarizedDescription';

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
        <AspectRatioImage
          src={product?.images?.[0] || product?.images?.[1]}
          priority
        />

        {product.tag && (
          <Chip
            label={formatString(product.tag)}
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
        <ProductName name={product.name} />
        <ProductSummarizedDescription
          summary={truncateForMetaDescription(
            product.descriptionSummary || '',
            200
          )}
        />
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href={`${ROUTES.products}/${product.slug}`}
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
