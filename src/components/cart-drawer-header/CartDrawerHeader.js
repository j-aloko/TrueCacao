import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import TextBlock from '../text-block/TextBlock';

function CartDrawerHeader({ title = 'Cart', onClose = null }) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        p: 2,
      }}
    >
      <TextBlock text={title} variant="h5" sx={{ fontWeight: 600 }} />
      <IconButton
        onClick={onClose}
        aria-label="close cart"
        sx={{ color: 'text.primary' }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}

export default CartDrawerHeader;
