'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

import CustomTextField from '@/components/custom-text-field/CustomTextField';
import GenericForm from '@/components/generic-form/GenericForm';
import TextBlock from '@/components/text-block/TextBlock';
import { ROUTES } from '@/constants/routes';
import { formValidation, Yup } from '@/utils/formValidation';

const fields = [
  {
    component: CustomTextField,
    name: 'password',
    props: { label: 'New Password' },
  },
  {
    component: CustomTextField,
    name: 'confirmPassword',
    props: { label: 'Confirm New Password' },
  },
];

const validationSchema = Yup.object().shape({
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must include at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must include at least one uppercase letter')
    .matches(/[0-9]/, 'Password must include at least one number')
    .matches(
      /[!@#$%^&*]/,
      'Password must include at least one special character (!@#$%^&*)'
    )
    .required('Password is required'),
});

function ResetPasswordContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = (values) => {
    console.log({ ...values, token });
    // After successful password reset, redirect to login with original redirect
    router.push(`${ROUTES.login}?redirect=${encodeURIComponent(redirectPath)}`);
  };

  return (
    <Box maxWidth={420} width="100%">
      <Stack spacing={2}>
        <TextBlock
          text="Reset Password"
          variant="h5"
          component="h1"
          textAlign="center"
          sx={{ fontWeight: 600 }}
        />
        <TextBlock
          text="Please enter your new password"
          variant="body1"
          component="p"
          textAlign="center"
        />
        <GenericForm
          fields={fields}
          onSubmit={handleSubmit}
          validate={formValidation(validationSchema)}
          buttonText="Reset Password"
          buttonFullWidth
          renderButtons={null}
        />
        <Typography variant="body1" component="div" textAlign="center">
          <>
            Remember your password?
            <Link
              href={`${ROUTES.login}?redirect=${encodeURIComponent(redirectPath)}`}
              style={{
                color: 'inherit',
                fontWeight: 'bold',
                marginLeft: '4px',
                textDecoration: 'none',
              }}
            >
              Login
            </Link>
          </>
        </Typography>
      </Stack>
    </Box>
  );
}

export default ResetPasswordContainer;
