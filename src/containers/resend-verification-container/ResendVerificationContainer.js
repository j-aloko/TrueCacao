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
    name: 'email',
    props: { label: 'Email' },
  },
];

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

function ResendVerificationContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = (values) => {
    console.log(values);
    // After successful submission, show success message
    // Optionally redirect to login with original redirect
    router.push(`${ROUTES.login}?redirect=${encodeURIComponent(redirectPath)}`);
  };

  return (
    <Box maxWidth={420} width="100%">
      <Stack spacing={2}>
        <TextBlock
          text="Resend Verification Email"
          variant="h5"
          component="h1"
          textAlign="center"
          sx={{ fontWeight: 600 }}
        />
        <TextBlock
          text="Enter your email to receive a new verification link"
          variant="body1"
          component="p"
          textAlign="center"
        />
        <GenericForm
          fields={fields}
          onSubmit={handleSubmit}
          validate={formValidation(validationSchema)}
          buttonText="Resend Verification"
          buttonFullWidth
          renderButtons={null}
        />
        <Typography variant="body1" component="div" textAlign="center">
          <>
            Already verified?
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

export default ResendVerificationContainer;
