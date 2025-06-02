'use client';

import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import TextBlock from '@/components/text-block/TextBlock';
import { ROUTES } from '@/constants/routes';

function VerifyEmailContainer() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const redirectPath = searchParams.get('redirect') || '/';

  useEffect(() => {
    // Here you would verify the token with your API
    console.log('Verifying token:', token);
    // After verification, you might want to automatically log the user in
    // or redirect them to login with the original redirect path
  }, [token]);

  return (
    <Box maxWidth={420} width="100%">
      <Stack spacing={2} textAlign="center">
        <TextBlock
          text="Email Verified"
          variant="h5"
          component="h1"
          textAlign="center"
          sx={{ fontWeight: 600 }}
        />
        <TextBlock
          text="Your email has been successfully verified. You can now login to your account."
          variant="body1"
          component="p"
        />
        <Button
          variant="contained"
          component={Link}
          href={`${ROUTES.login}?redirect=${encodeURIComponent(redirectPath)}`}
          fullWidth
          sx={{ mt: 2 }}
        >
          Continue to Login
        </Button>
      </Stack>
    </Box>
  );
}

export default VerifyEmailContainer;
