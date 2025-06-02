import React from 'react';

import Box from '@mui/material/Box';

import ResendVerificationContainer from '@/containers/resend-verification-container/ResendVerificationContainer';

function ResendVerificationPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        p: 2,
      }}
    >
      <ResendVerificationContainer />
    </Box>
  );
}

export default ResendVerificationPage;
