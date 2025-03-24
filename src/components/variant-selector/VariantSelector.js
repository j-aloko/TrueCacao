'use client';

import React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { Select } from 'mui-rff';

function VariantSelector({ name, menuItems = [], onChange }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          name={name}
          labelId="variant-select-label"
          label={name}
          id="variant-select"
          onChange={onChange} // Pass the onChange handler
        >
          {menuItems.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default VariantSelector;
