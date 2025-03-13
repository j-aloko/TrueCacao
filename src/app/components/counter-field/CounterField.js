import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import { Field } from 'react-final-form';

function CounterField({ name }) {
  return (
    <Field name={name}>
      {({ input }) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Fab
            color="primary"
            size="small"
            onClick={() => input.onChange(Math.max(1, input.value - 1))}
            disabled={input.value <= 1}
          >
            <RemoveIcon />
          </Fab>
          <Typography variant="h6">{input.value}</Typography>
          <Fab
            color="secondary"
            size="small"
            onClick={() => input.onChange(input.value + 1)}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}
    </Field>
  );
}

export default CounterField;
