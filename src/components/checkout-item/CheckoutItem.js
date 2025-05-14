import React from 'react';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';

import { formatString } from '@/util/formatString';

import TextBlock from '../text-block/TextBlock';

function CheckoutItem({
  image = '/product-images/royale-cocoa-powder-2.jpg',
  productName,
  packaging,
  weight,
  itemPrice,
  quantity = 1,
  imageWidth = 60,
  imageHeight = 60,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box display="flex" gap={2}>
        <Badge
          badgeContent={quantity}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}
          color="secondary"
          sx={{
            '& .MuiBadge-badge': {
              borderRadius: '50%',
              fontSize: '0.85rem',
              height: 24,
              minWidth: 24,
            },
          }}
        >
          <Box
            sx={{
              borderRadius: 1,
              height: imageHeight,
              width: imageWidth,
            }}
          >
            <CardMedia
              component="img"
              sx={{
                height: '100%',
                objectFit: 'cover',
                width: '100%',
              }}
              image={image}
              alt={productName}
            />
          </Box>
        </Badge>

        <Stack spacing={0.5}>
          <TextBlock
            text={productName}
            variant="body2"
            component="span"
            sx={{
              textTransform: 'capitalize',
            }}
          />
          <TextBlock
            text={
              typeof packaging === 'string'
                ? `${formatString(packaging)} / ${weight}g`
                : `${weight}g`
            }
            variant="body2"
            component="span"
          />
        </Stack>
      </Box>
      <TextBlock text={itemPrice} variant="body2" component="span" />
    </Box>
  );
}

export default CheckoutItem;
