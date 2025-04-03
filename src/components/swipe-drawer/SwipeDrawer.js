import React from 'react';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';

function SwipeDrawer({
  children,
  open = false,
  anchor = 'right',
  onOpen = null,
  onClose = null,
  transitionDuration = { enter: 300, exit: 200 },
}) {
  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      transitionDuration={transitionDuration}
      sx={(theme) => ({
        '& .MuiDrawer-paper': {
          maxWidth: '400px',
          minWidth: theme.breakpoints.values.xs,
          width: '100%',
        },
      })}
    >
      {children}
    </SwipeableDrawer>
  );
}

export default SwipeDrawer;
