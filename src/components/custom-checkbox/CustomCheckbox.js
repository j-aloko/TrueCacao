'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Field } from 'react-final-form';

function CustomCheckbox({ name, label }) {
  return (
    <Field name={name} type="checkbox">
      {({ input }) => (
        <Box component="div" mt={-2}>
          <FormControlLabel control={<Checkbox {...input} />} label={label} />
        </Box>
      )}
    </Field>
  );
}

export default CustomCheckbox;
