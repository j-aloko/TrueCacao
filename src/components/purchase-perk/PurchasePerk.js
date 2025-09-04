import React from 'react';

import Box from '@mui/material/Box';

import TextBlock from '../text-block/TextBlock';

export default function PurchasePerk({ icon, title }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Box>{icon}</Box>
        <TextBlock text={title} variant="body2" component="span" />
      </Box>
    </Box>
  );
}
