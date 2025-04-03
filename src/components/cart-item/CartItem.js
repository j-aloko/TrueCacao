import React from 'react';

import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';

import { formatString } from '@/util/formatString';

import CounterField from '../counter-field/CounterField';
import TextBlock from '../text-block/TextBlock';
import Tooltip from '../tooltip/Tooltip';

export default function CartItem({
  image = '/product-images/royale-cocoa-powder-2.jpg',
  title = 'Pure, unprocessed cocoa powder',
  description = `${formatString('CARTON_OF_JARS')} / ${400}g`,
  price = 359.99,
  quantity = 0,
  onIncrement = null,
  onDecrement = null,
  onRemove = null,
  imageWidth = 120,
  ImageHeight = 120,
}) {
  return (
    <Card sx={{ boxShadow: 1, display: 'flex' }}>
      <CardContent sx={{ p: 1 }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexShrink: 0,
            height: ImageHeight,
            justifyContent: 'center',
            overflow: 'hidden',
            width: imageWidth,
          }}
        >
          <CardMedia
            component="img"
            sx={{
              height: 'auto',
              maxHeight: '100%',
              objectFit: 'scale-down',
              width: '100%',
            }}
            image={image}
            alt={title}
          />
        </Box>
      </CardContent>

      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <CardContent sx={{ p: 1 }}>
          <Stack spacing={0.5}>
            <TextBlock
              text={title}
              variant="caption"
              component="h3"
              sx={{
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            />
            <TextBlock
              text={description}
              variant="caption"
              component="p"
              sx={{ fontWeight: 500, textTransform: 'lowercase' }}
            />
            <TextBlock
              text={`GH₵${price.toFixed(2)}`}
              variant="caption"
              component="p"
              sx={{ fontWeight: 600 }}
            />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                pb: 1,
              }}
            >
              <Box flex={0.5}>
                <CounterField
                  quantity={quantity}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  fabSize="tiny"
                  typographyVariant="body2"
                />
              </Box>
              <Box flex={0.3}>
                <Tooltip title="Remove" placement="bottom-start">
                  <Fab
                    size="small"
                    onClick={onRemove}
                    aria-label="Remove from cart"
                    sx={{ height: 20, minHeight: 20, width: 20 }}
                  >
                    <RemoveShoppingCartIcon sx={{ fontSize: 15 }} />
                  </Fab>
                </Tooltip>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
}
