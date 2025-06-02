'use client';

import React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Field } from 'react-final-form';

import TextBlock from '../text-block/TextBlock';

function CustomRadioGroup({ name, label, options = [] }) {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <FormControl fullWidth error={!!meta.error && meta.touched}>
          <TextBlock text={label} variant="h6" component="h2" sx={{ mb: 1 }} />
          <RadioGroup
            onChange={(event) => input.onChange(event.target.value)}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            {options.map((option, index) => (
              <Box
                key={option.value}
                sx={{
                  bgcolor:
                    input.value === option.value
                      ? 'background.paper'
                      : 'transparent',
                  borderBottom:
                    index !== options.length - 1 ? '1px solid' : 'none',
                  borderBottomLeftRadius:
                    index === options.length - 1 ? '8px' : 0,
                  borderBottomRightRadius:
                    index === options.length - 1 ? '8px' : 0,
                  borderColor: 'divider',
                  borderTopLeftRadius: index === 0 ? '8px' : 0,
                  borderTopRightRadius: index === 0 ? '8px' : 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 16px',
                  transition: 'background-color 0.3s',
                }}
              >
                <FormControlLabel
                  value={option.value}
                  control={<Radio checked={input.value === option.value} />}
                  label={option.label}
                />
                {option?.icon ? <Box>{option.icon}</Box> : null}
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
      )}
    </Field>
  );
}

export default CustomRadioGroup;
