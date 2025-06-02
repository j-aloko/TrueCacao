import React from 'react';

import Box from '@mui/material/Box';

import ChangePasswordContainer from '@/containers/change-password-container/ChangePasswordContainer';

function ChangePasswordPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        p: 2,
      }}
    >
      <ChangePasswordContainer />
    </Box>
  );
}

export default ChangePasswordPage;
