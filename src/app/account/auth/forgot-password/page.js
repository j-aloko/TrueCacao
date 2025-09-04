import React from 'react';

import Box from '@mui/material/Box';

import ForgotPasswordContainer from '@/containers/forgot-password-container/ForgotPasswordContainer';

function ForgotPasswordPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        p: 2,
      }}
    >
      <ForgotPasswordContainer />
    </Box>
  );
}

export default ForgotPasswordPage;
