'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useSearchParams, useRouter } from 'next/navigation';

import CustomTextField from '@/components/custom-text-field/CustomTextField';
import GenericForm from '@/components/generic-form/GenericForm';
import TextBlock from '@/components/text-block/TextBlock';
import { formValidation, Yup } from '@/utils/formValidation';

const fields = [
  {
    component: CustomTextField,
    name: 'currentPassword',
    props: { label: 'Current Password' },
  },
  {
    component: CustomTextField,
    name: 'newPassword',
    props: { label: 'New Password' },
  },
  {
    component: CustomTextField,
    name: 'confirmNewPassword',
    props: { label: 'Confirm New Password' },
  },
];

const validationSchema = Yup.object().shape({
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must include at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must include at least one uppercase letter')
    .matches(/[0-9]/, 'Password must include at least one number')
    .matches(
      /[!@#$%^&*]/,
      'Password must include at least one special character (!@#$%^&*)'
    )
    .notOneOf(
      [Yup.ref('currentPassword')],
      'New password must be different from current password'
    )
    .required('Password is required'),
});

function ChangePasswordContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = (values) => {
    console.log(values);
    // After successful password change, redirect back with success message
    router.push(redirectPath);
  };

  return (
    <Box maxWidth={420} width="100%">
      <Stack spacing={2}>
        <TextBlock
          text="Change Password"
          variant="h5"
          component="h1"
          textAlign="center"
          sx={{ fontWeight: 600 }}
        />
        <TextBlock
          text="Please enter your current and new password"
          variant="body1"
          component="p"
          textAlign="center"
        />
        <GenericForm
          fields={fields}
          onSubmit={handleSubmit}
          validate={formValidation(validationSchema)}
          buttonText="Change Password"
          buttonFullWidth
          renderButtons={null}
        />
      </Stack>
    </Box>
  );
}

export default ChangePasswordContainer;
