import React from 'react';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
    <Card sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
      <CardContent>
        <Box display="flex" gap={2}>
          <Badge
            badgeContent={quantity}
            anchorOrigin={{
              horizontal: 'left',
              vertical: 'top',
            }}
            color="secondary"
            sx={{
              '& .MuiBadge-badge': {
                borderRadius: '50%',
                fontSize: '0.85rem',
                height: 28,
                minWidth: 28,
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
              variant="caption"
              component="h3"
              sx={{
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            />
            <TextBlock
              text={
                typeof packaging === 'string'
                  ? `${formatString(packaging)} / ${weight}g`
                  : `${weight}g`
              }
              variant="caption"
              component="p"
              sx={{ fontWeight: 500 }}
            />
          </Stack>
        </Box>
      </CardContent>
      <CardContent>
        <TextBlock
          text={itemPrice}
          variant="caption"
          component="p"
          sx={{ fontWeight: 600 }}
        />
      </CardContent>
    </Card>
  );
}

export default CheckoutItem;
