import React from 'react';

import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

function SwipeDrawer({
  children,
  open = false,
  anchor = 'right',
  onOpen = null,
  onClose = null,
}) {
  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      sx={(theme) => ({
        '& .MuiDrawer-paper': {
          maxWidth: '400px',
          minWidth: theme.breakpoints.values.xs,
          width: '100%',
        },
      })}
    >
      <Box sx={{ p: 2, width: '100%' }}>{children}</Box>
    </SwipeableDrawer>
  );
}

export default SwipeDrawer;
