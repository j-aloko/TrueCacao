import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';

import AspectRatioImage from '../aspect-ratio-image/AspectRatioImage';
import TextBlock from '../text-block/TextBlock';

function ProductCard({ product }) {
  return (
    <Card
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
        borderRadius: 3,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxWidth: 'sm',
        width: '100%',
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

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
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
          variant="body2"
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
      </CardContent>
    </Card>
  );
}

export default ProductCard;
