'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import CustomTextField from '@/components/custom-text-field/CustomTextField';
import GenericForm from '@/components/generic-form/GenericForm';
import TextBlock from '@/components/text-block/TextBlock';
import { ROUTES } from '@/constants/routes';
import { formValidation, Yup } from '@/utils/formValidation';

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
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

function LoginContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPath = usePathname();
  const redirectPath = searchParams.get('redirect') || '/';

  const fields = [
    {
      component: CustomTextField,
      name: 'email',
      props: { label: 'Email' },
    },
    {
      component: CustomTextField,
      name: 'password',
      props: {
        adornmentComponent: (
          <Button
            variant="text"
            size="small"
            sx={{ p: 0, textTransform: 'initial' }}
            component={Link}
            href={`${ROUTES.forgotPassword}?redirect=${encodeURIComponent(currentPath)}`}
          >
            Forgot password?
          </Button>
        ),
        label: 'Password',
        showEndAdornment: true,
      },
    },
  ];

  const handleLogin = (values) => {
    console.log(values);
    // TODO: Implement actual login logic
    // After successful login:
    router.push(redirectPath);
  };

  return (
    <Box maxWidth={420} width="100%">
      <Stack spacing={2}>
        <TextBlock
          text="Login"
          variant="h5"
          component="h1"
          textAlign="center"
          sx={{ fontWeight: 600 }}
        />
        <TextBlock
          text="Please enter your e-mail and password"
          variant="body1"
          component="p"
          textAlign="center"
        />
        <GenericForm
          fields={fields}
          onSubmit={handleLogin}
          validate={formValidation(loginValidationSchema)}
          buttonText="Login"
          buttonFullWidth
          renderButtons={null}
        />
        <Typography variant="body1" component="div" textAlign="center">
          <>
            Don&apos;t have an account?
            <Link
              href={`${ROUTES.signup}?redirect=${encodeURIComponent(currentPath)}`}
              style={{
                color: 'inherit',
                fontWeight: 'bold',
                marginLeft: '4px',
                textDecoration: 'none',
              }}
            >
              Create one
            </Link>
          </>
        </Typography>
      </Stack>
    </Box>
  );
}

export default LoginContainer;
