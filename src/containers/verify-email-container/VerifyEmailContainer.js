'use client';

import React, { useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
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
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(!!token); // Loading only if we have a token to verify

  useEffect(() => {
    if (token) {
      // Verify the token with your API
      const verifyEmail = async () => {
        try {
          console.log('Verifying token:', token);
          // Simulate API call
          // await api.verifyEmail(token);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

          setIsVerified(true);
          setIsLoading(false);
        } catch (error) {
          console.error('Verification failed:', error);
          setIsLoading(false);
          // Handle error state if needed
        }
      };

      verifyEmail();
    }
  }, [token]);

  if (isLoading) {
    return (
      <Box maxWidth={420} width="100%">
        <Stack spacing={2} textAlign="center">
          <TextBlock
            text="Verifying Email..."
            variant="h5"
            component="h1"
            textAlign="center"
            sx={{ fontWeight: 600 }}
          />
          <TextBlock
            text="Please wait while we verify your email address."
            variant="body1"
            component="p"
          />
        </Stack>
      </Box>
    );
  }

  if (isVerified) {
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

  // Default state when no token is present
  return (
    <Box maxWidth={420} width="100%">
      <Stack spacing={2} textAlign="center">
        <TextBlock
          text="Verify Your Email"
          variant="h5"
          component="h1"
          textAlign="center"
          sx={{ fontWeight: 600 }}
        />
        <Alert severity="info" sx={{ textAlign: 'left' }}>
          We&apos;ve sent a verification link to your email address. Please your
          inbox and click on the link to verify your email.
        </Alert>
        <TextBlock
          text="If you didn't receive the email, check your spam folder or request a new verification email."
          variant="body1"
          component="p"
        />
        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
          Resend Confirmation Email
        </Button>
      </Stack>
    </Box>
  );
}

export default VerifyEmailContainer;
