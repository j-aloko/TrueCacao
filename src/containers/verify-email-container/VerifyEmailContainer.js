'use client';

import React, { useEffect, useMemo, useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { shallowEqual } from 'react-redux';

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

  const token = useMemo(() => searchParams.get('token'), [searchParams]);
  const encryptedUserId = useMemo(() => searchParams.get('id'), [searchParams]);
  const urlEmail = useMemo(() => searchParams.get('email'), [searchParams]);

  const {
    pendingEmail,
    isResendVerificationLoading,
    isVerified,
    emailVerificationStatus,
  } = useAppSelector(
    (state) => ({
      emailVerificationStatus: state.auth.emailVerificationStatus,
      isResendVerificationLoading: state.auth.isLoading,
      isVerified: state.auth.isVerified,
      pendingEmail: state.auth.pendingVerificationEmail || urlEmail,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (token && !isVerified) {
      dispatch(verifyEmail({ encryptedUserId, token }));
    }
  }, [dispatch, token, isVerified, encryptedUserId]);

  const handleResendVerificationLink = useCallback(() => {
    if (pendingEmail) {
      dispatch(resendEmailVerification({ email: pendingEmail }));
    }
  }, [dispatch, pendingEmail]);

  const renderPending = () => (
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

  const renderVerified = () => (
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
          href={ROUTES.login}
          fullWidth
          sx={{ mt: 2 }}
        >
          Continue to Login
        </Button>
      </Stack>
    </Box>
  );

  const renderDefault = () => (
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
          We&apos;ve sent a verification link to your email address. Please
          check your inbox and click on the link to verify your email.
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

  if (token && emailVerificationStatus === EMAIL_VERIFICATION_STATUS.PENDING) {
    return renderPending();
  }

  if (token && isVerified) {
    return renderVerified();
  }

  return renderDefault();
}

export default VerifyEmailContainer;
