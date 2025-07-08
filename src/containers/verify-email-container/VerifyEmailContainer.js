'use client';

import React, { useEffect } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import TextBlock from '@/components/text-block/TextBlock';
import { EMAIL_VERIFICATION_STATUS } from '@/constants/constants';
import { ROUTES } from '@/constants/routes';
import {
  resendEmailVerification,
  verifyEmail,
} from '@/services/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/services/redux/store';

function VerifyEmailContainer() {
  const searchParams = useSearchParams();

  const dispatch = useAppDispatch();

  const pendingEmail =
    useAppSelector((state) => state.auth.pendingVerificationEmail) ||
    searchParams.get('email');

  const isResendVerificationLoading = useAppSelector(
    (state) => state.auth.isLoading
  );
  const emailVerifictionStatus = useAppSelector(
    (state) => state.auth.verificationStatus
  );

  const token = searchParams.get('token');
  const redirectPath = searchParams.get('redirect') || '/';

  const handleResendVerificationLink = () => {
    dispatch(resendEmailVerification({ email: pendingEmail }));
  };

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [dispatch, token]);

  if (token && emailVerifictionStatus === EMAIL_VERIFICATION_STATUS.PENDING) {
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

  if (token && emailVerifictionStatus === EMAIL_VERIFICATION_STATUS.VERIFIED) {
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
        <Button
          variant="contained"
          loading={isResendVerificationLoading}
          disabled={isResendVerificationLoading}
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleResendVerificationLink}
        >
          Resend Confirmation Email
        </Button>
      </Stack>
    </Box>
  );
}

export default VerifyEmailContainer;
