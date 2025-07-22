'use client';

import React, { useMemo, useState } from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { shallowEqual } from 'react-redux';

import CustomTextField from '@/components/custom-text-field/CustomTextField';
import GenericForm from '@/components/generic-form/GenericForm';
import TextBlock from '@/components/text-block/TextBlock';
import { ROUTES } from '@/constants/routes';
import { resetPassword } from '@/services/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/services/redux/store';
import { formValidation, Yup } from '@/utils/formValidation';

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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading } = useAppSelector(
    (state) => ({
      isLoading: state.auth.isLoading,
    }),
    shallowEqual
  );

  const [showPassword, setShowPassword] = useState(false);

  const token = useMemo(() => searchParams.get('token'), [searchParams]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (values) => {
    dispatch(resetPassword({ ...values, router, token }));
  };

  const fields = useMemo(
    () => [
      {
        component: CustomTextField,
        name: 'password',
        props: {
          adornmentComponent: (
            <Box display="flex">
              <IconButton
                aria-label={
                  showPassword ? 'hide the password' : 'display the password'
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
          ),
          label: 'New Password',
          showEndAdornment: true,
          type: showPassword ? 'text' : 'password',
        },
      },
      {
        component: CustomTextField,
        name: 'confirmPassword',
        props: {
          adornmentComponent: (
            <Box display="flex">
              <IconButton
                aria-label={
                  showPassword ? 'hide the password' : 'display the password'
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
          ),
          label: 'Confirm New Password',
          showEndAdornment: true,
          type: showPassword ? 'text' : 'password',
        },
      },
    ],
    [showPassword]
  );

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
          submitting={isLoading}
          renderButtons={null}
        />
        <Typography variant="body1" component="div" textAlign="center">
          <>
            Remember your password?
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

export default ResetPasswordContainer;
