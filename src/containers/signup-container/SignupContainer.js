'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import CustomTextField from '@/components/custom-text-field/CustomTextField';
import GenericForm from '@/components/generic-form/GenericForm';
import TextBlock from '@/components/text-block/TextBlock';
import { ROUTES } from '@/constants/routes';
import { registerUser } from '@/services/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/services/redux/store';
import { formValidation, Yup } from '@/utils/formValidation';

const signupValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  name: Yup.string().required('Full name is required'),
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

function SignupContainer() {
  const dispatch = useAppDispatch();
  const isSigningUpLoading = useAppSelector((state) => state.auth.isLoading);
  const router = useRouter();

  const fields = [
    {
      component: CustomTextField,
      name: 'name',
      props: { label: 'Full Name' },
    },
    {
      component: CustomTextField,
      name: 'email',
      props: { label: 'Email' },
    },
    {
      component: CustomTextField,
      name: 'password',
      props: {
        label: 'Password',
      },
    },
  ];

  const handleSignup = (values) => {
    dispatch(registerUser({ ...values, router }));
  };

  return (
    <Box maxWidth={420} width="100%">
      <Stack spacing={2}>
        <TextBlock
          text="Register"
          variant="h5"
          component="h1"
          textAlign="center"
          sx={{ fontWeight: 600 }}
        />
        <TextBlock
          text="Please fill in the information below"
          variant="body1"
          component="p"
          textAlign="center"
        />
        <GenericForm
          fields={fields}
          onSubmit={handleSignup}
          validate={formValidation(signupValidationSchema)}
          buttonText="Create My Account"
          buttonFullWidth
          submitting={isSigningUpLoading}
          renderButtons={null}
        />
        <Typography variant="body1" component="div" textAlign="center">
          <>
            Already have an account?
            <Link
              href={ROUTES.login}
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

export default SignupContainer;
