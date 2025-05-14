'use client';

import React from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useField } from 'react-final-form';

function CustomTextField({
  name,
  size = 'medium',
  label,
  value,
  onChange,
  error,
  helperText,
  showEndAdornment = false,
  adornmentComponent = null,
  ...rest
}) {
  const { input, meta } = useField(name, {
    type: 'text', // Default type
    value, // Optional for controlled components
    ...rest,
  });

  // Combine the error state from both props and meta
  const showError = (meta.touched && meta.error) || error;
  const errorText = meta.error || helperText;

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={label}
      label={label}
      name={input.name}
      value={input.value}
      size={size}
      onChange={(e) => {
        input.onChange(e);
        if (onChange) onChange(e);
      }}
      slotProps={{
        input: showEndAdornment
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  {adornmentComponent}
                </InputAdornment>
              ),
            }
          : {},
      }}
      error={showError}
      helperText={showError ? errorText : ''}
      {...rest}
    />
  );
}

export default CustomTextField;
