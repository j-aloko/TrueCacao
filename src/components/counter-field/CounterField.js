import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';

function CounterField({
  quantity = 1,
  loading = false,
  onIncrement = null,
  onDecrement = null,
  fabSize = 'small', // 'small' | 'medium' | 'tiny' (custom)
  minValue = 1,
  typographyVariant = 'subtitle1',
  typographySx = {},
  disabled = false,
  sx = {},
}) {
  // Handle custom 'tiny' size (smaller than MUI's 'small')
  const getFabSize = () => {
    if (fabSize === 'tiny') {
      return {
        size: 'small',
        sx: { height: 20, minHeight: 20, width: 20 },
      };
    }
    return { size: fabSize, sx: {} };
  };

  const { size: resolvedFabSize, sx: fabSx } = getFabSize();

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        gap: 2,
        justifyContent: 'space-between',
        ...sx,
      }}
    >
      <Fab
        color="primary"
        size={resolvedFabSize}
        onClick={onDecrement}
        disabled={disabled || quantity <= minValue}
        sx={fabSx}
      >
        <RemoveIcon fontSize={fabSize === 'tiny' ? 'small' : 'medium'} />
      </Fab>
      {loading ? (
        <CircularProgress size={15} />
      ) : (
        <Typography
          variant={typographyVariant}
          sx={typographySx}
          component="span"
        >
          {quantity}
        </Typography>
      )}
      <Fab
        color="secondary"
        size={resolvedFabSize}
        onClick={onIncrement}
        disabled={disabled}
        sx={fabSx}
      >
        <AddIcon fontSize={fabSize === 'tiny' ? 'small' : 'medium'} />
      </Fab>
    </Box>
  );
}

export default React.memo(CounterField);
