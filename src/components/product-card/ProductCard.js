import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import AspectRatioImage from '../aspect-ratio-image/AspectRatioImage';
import TextBlock from '../text-block/TextBlock';

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
        <TextBlock
          text={product.title}
          variant="h5"
          component="h3"
          color="primary"
          gutterBottom
        />

        <TextBlock
          text={product.price}
          variant="h6"
          component="p"
          color="secondary"
          gutterBottom
        />

        <TextBlock
          text={product.description}
          variant="body1"
          component="p"
          color="text.secondary"
          gutterBottom
          sx={{
            flexGrow: 1,
            mb: 3,
          }}
        />

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
