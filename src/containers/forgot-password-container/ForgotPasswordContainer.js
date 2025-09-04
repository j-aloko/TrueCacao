'use client';

import React, { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { shallowEqual } from 'react-redux';

import CustomTextField from '@/components/custom-text-field/CustomTextField';
import GenericForm from '@/components/generic-form/GenericForm';
import TextBlock from '@/components/text-block/TextBlock';
import { ROUTES } from '@/constants/routes';
import { forgotPassword } from '@/services/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/services/redux/store';
import { formValidation, Yup } from '@/utils/formValidation';

const fields = [
  {
    component: CustomTextField,
    name: 'email',
    props: { label: 'Email' },
  },
];

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

function ForgotPasswordContainer() {
  const dispatch = useAppDispatch();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const { isLoading } = useAppSelector(
    (state) => ({
      isLoading: state.auth.isLoading,
    }),
    shallowEqual
  );

  const handleSubmit = async ({ email }) => {
    try {
      await dispatch(forgotPassword(email)).unwrap();
      setEmailSent(true);
      setSubmittedEmail(email);
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };

  const handleResendLink = () => {
    if (submittedEmail) {
      dispatch(forgotPassword(submittedEmail));
    }
  };

  return (
    <Box maxWidth={420} width="100%">
      <Stack spacing={3}>
        <TextBlock
          text="Forgot Password"
          variant="h5"
          component="h1"
          textAlign="center"
          sx={{ fontWeight: 600 }}
        />
        {!emailSent ? (
          <>
            <TextBlock
              text="Enter your email to receive a password reset link"
              variant="body1"
              component="p"
              textAlign="center"
            />
            <GenericForm
              fields={fields}
              onSubmit={handleSubmit}
              validate={formValidation(validationSchema)}
              buttonText="Send Reset Link"
              buttonFullWidth
              submitting={isLoading}
              renderButtons={null}
            />
          </>
        ) : (
          <Stack spacing={2} textAlign="center">
            <TextBlock
              text="Password Reset Email Sent"
              variant="body1"
              component="p"
              textAlign="center"
            />
            <Alert severity="info" sx={{ textAlign: 'left' }}>
              If you didn’t receive the email, check your spam folder or click
              below to send another reset link.
            </Alert>
            <Button
              variant="contained"
              loading={isLoading}
              disabled={isLoading}
              onClick={handleResendLink}
              fullWidth
            >
              Resend Reset Link
            </Button>
          </Stack>
        )}
        <Typography variant="body2" component="div" textAlign="center">
          <>
            Remember your password ? &nbsp;
            <Button
              variant="text"
              sx={{
                fontWeight: 'bold',
                lineHeight: 0,
                m: 0,
                minWidth: 'auto',
                p: 0,
                textTransform: 'capitalize',
              }}
              component={Link}
              href={ROUTES.login}
              disabled={isLoading}
            >
              Login
            </Button>
          </>
        </Typography>
      </Stack>
    </Box>
  );
}

export default ForgotPasswordContainer;
