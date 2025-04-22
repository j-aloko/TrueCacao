import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import TextBlock from '../text-block/TextBlock';

export default function ValuePropositionCard({ icon, title, description }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack spacing={2} p={2}>
        <Box display="flex" justifyContent="center">
          {icon}
        </Box>
        <TextBlock
          text={title}
          variant="h6"
          component="h1"
          textAlign="center"
        />
        <TextBlock
          text={description}
          variant="body1"
          component="p"
          textAlign="center"
        />
      </Stack>
    </Box>
  );
}
