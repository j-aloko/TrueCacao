import React from 'react';

import Box from '@mui/material/Box';

import VerifyEmailContainer from '@/containers/verify-email-container/VerifyEmailContainer';

function VerifyEmailPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        p: 2,
      }}
    >
      <VerifyEmailContainer />
    </Box>
  );
}

export default VerifyEmailPage;
