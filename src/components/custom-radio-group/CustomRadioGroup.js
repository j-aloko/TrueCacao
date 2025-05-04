'use client';

import React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Field } from 'react-final-form';

function CustomRadioGroup({ name, label, options = [] }) {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <FormControl fullWidth error={!!meta.error && meta.touched}>
          <FormLabel
            sx={{
              mb: 1,
            }}
          >
            {label}
          </FormLabel>
          <RadioGroup
            onChange={(event) => input.onChange(event.target.value)}
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            {options.map((option) => (
              <Box
                key={option.value}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 16px',
                }}
              >
                <FormControlLabel
                  value={option.value}
                  control={<Radio checked={input.value === option.value} />}
                  label={option.label}
                />
                <Box>{option.icon}</Box>
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
      )}
    </Field>
  );
}

export default CustomRadioGroup;
