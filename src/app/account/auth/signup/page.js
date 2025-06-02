import React from 'react';

import Box from '@mui/material/Box';

import SignupContainer from '@/containers/signup-container/SignupContainer';

function SignupPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        p: 2,
      }}
    >
      <SignupContainer />
    </Box>
  );
}

export default SignupPage;
