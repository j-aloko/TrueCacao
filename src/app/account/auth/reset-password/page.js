import React from 'react';

import Box from '@mui/material/Box';

import ResetPasswordContainer from '@/containers/reset-password-container/ResetPasswordContainer';

function ResetPasswordPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        p: 2,
      }}
    >
      <ResetPasswordContainer />
    </Box>
  );
}

export default ResetPasswordPage;
