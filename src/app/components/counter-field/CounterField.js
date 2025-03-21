import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';

function CounterField({ value, onIncrement, onDecrement }) {
  return (
    <Box
      flexGrow={1}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
    >
      <Fab
        color="primary"
        size="small"
        onClick={onDecrement}
        disabled={value <= 1}
      >
        <RemoveIcon />
      </Fab>
      <Typography variant="h6">{value}</Typography>
      <Fab color="secondary" size="small" onClick={onIncrement}>
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default CounterField;
