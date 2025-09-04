import React from 'react';

import Box from '@mui/material/Box';

import LoginContainer from '@/containers/login-container/LoginContainer';

function LoginPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        p: 2,
      }}
    >
      <LoginContainer />
    </Box>
  );
}

export default LoginPage;
