import React from 'react';

import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';

import { formatString } from '@/util/formatString';

import CounterField from '../counter-field/CounterField';
import TextBlock from '../text-block/TextBlock';
import Tooltip from '../tooltip/Tooltip';

function CartItem({
  id,
  image = '/product-images/royale-cocoa-powder-2.jpg',
  productName,
  itemPrice,
  packaging,
  weight,
  quantity = 1,
  loading = {},
  onCartItemIncrement = null,
  onCartItemDecrement = null,
  onRemoveCartItem = null,
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
            alt={productName}
          />
        </Box>
      </CardContent>

      <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <CardContent sx={{ p: 1 }}>
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
            <TextBlock
              text={itemPrice}
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
                  onIncrement={() =>
                    !loading.update && onCartItemIncrement(id, quantity)
                  }
                  onDecrement={() =>
                    !loading.update && onCartItemDecrement(id, quantity)
                  }
                  fabSize="tiny"
                  typographyVariant="body2"
                  loading={loading.update}
                />
              </Box>
              <Box flex={0.3}>
                <Tooltip title="Remove">
                  <Fab
                    size="small"
                    onClick={() => !loading.remove && onRemoveCartItem(id)}
                    disabled={loading.remove}
                    aria-label="Remove from cart"
                  >
                    {loading.remove ? (
                      <CircularProgress size={15} />
                    ) : (
                      <RemoveShoppingCartIcon sx={{ fontSize: 15 }} />
                    )}
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

export default CartItem;
