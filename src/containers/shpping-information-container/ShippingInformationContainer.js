import React, { useCallback } from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';

import CustomCheckbox from '@/components/custom-checkbox/CustomCheckbox';
import CustomRadioGroup from '@/components/custom-radio-group/CustomRadioGroup';
import CustomTextField from '@/components/custom-text-field/CustomTextField';
import GenericForm from '@/components/generic-form/GenericForm';
import TextBlock from '@/components/text-block/TextBlock';
import Tooltip from '@/components/tooltip/Tooltip';
import { ROUTES } from '@/constants/routes';
import { formValidation, Yup } from '@/utils/formValidation';

const fields = [
  {
    component: CustomTextField,
    name: 'email',
    props: { label: 'Email' },
  },
  {
    component: CustomCheckbox,
    name: 'emailMarketting',
    props: {
      label: 'Email me with news and offers',
    },
  },
  {
    component: CustomRadioGroup,
    name: 'deliveryMethod',
    props: {
      label: 'Delivery Method',
      options: [
        {
          icon: <LocalShippingOutlinedIcon />,
          label: 'Shipping',
          value: 'SHIP',
        },
        {
          icon: <StorefrontOutlinedIcon />,
          label: 'Pick in Store',
          value: 'PICK_IN_STORE',
        },
      ],
    },
  },
  {
    component: CustomTextField,
    name: 'country',
    props: { label: 'Country/Region' },
  },
  {
    fields: [
      {
        component: CustomTextField,
        name: 'firstName',
        props: { label: 'First Name' },
        xs: 6,
      },
      {
        component: CustomTextField,
        name: 'lastName',
        props: { label: 'Last Name' },
        xs: 6,
      },
    ],
    group: 'row',
    id: 'group-1',
  },
  {
    component: CustomTextField,
    name: 'address',
    props: { label: 'Address' },
  },
  {
    component: CustomTextField,
    name: 'apartment',
    props: { label: 'Apartment, suite, etc. (Optional)' },
  },
  {
    fields: [
      {
        component: CustomTextField,
        name: 'city',
        props: { label: 'City' },
        xs: 8,
      },
      {
        component: CustomTextField,
        name: 'postalCode',
        props: { label: 'Postal Code (Optional)' },
        xs: 4,
      },
    ],
    group: 'row',
    id: 'group-2',
  },
  {
    component: CustomTextField,
    name: 'phone',
    props: {
      adornmentComponent: (
        <Tooltip
          placement="top"
          title="Incase we need to contact you about your order"
          sx={{ maxWidth: 150, textAlign: 'center' }}
        >
          <IconButton>
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      ),
      label: 'Phone (optional)',
      showEndAdornment: true,
    },
  },
  {
    component: CustomCheckbox,
    name: 'saveShippingInformation',
    props: {
      label: 'Save this information for next time',
    },
  },
];

const shippingInfoValidationSchema = Yup.object().shape({
  address: Yup.string()
    .required('Address is required')
    .max(100, 'Address is too long'),

  apartment: Yup.string().max(100, 'Apartment info is too long').nullable(),

  city: Yup.string()
    .required('City is required')
    .max(50, 'City name is too long'),

  country: Yup.string().required('Country/Region is required'),

  deliveryMethod: Yup.string()
    .oneOf(['SHIP', 'PICK_IN_STORE'], 'Invalid delivery method')
    .required('Delivery method is required'),

  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),

  firstName: Yup.string()
    .required('First name is required')
    .max(50, 'First name is too long'),

  lastName: Yup.string()
    .required('Last name is required')
    .max(50, 'Last name is too long'),

  phone: Yup.string()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      'Please enter a valid phone number'
    )
    .nullable(),

  postalCode: Yup.string()
    .matches(/^[a-zA-Z0-9\s-]*$/, 'Please enter a valid postal code')
    .max(20, 'Postal code is too long')
    .nullable(),
});

function ShippingInformationContainer() {
  const handleShippingFormSubmit = useCallback((values) => {
    console.log(values);
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <TextBlock text="Contact" variant="h6" component="h2" />
        <Button
          component={Link}
          href={`${ROUTES.login}?redirect=${encodeURIComponent(window.location.pathname)}`}
          size="small"
          variant="text"
          aria-label="login"
          sx={{ textDecoration: 'underline', textTransform: 'capitalize' }}
        >
          Login
        </Button>
      </Box>
      <GenericForm
        fields={fields}
        onSubmit={handleShippingFormSubmit}
        validate={formValidation(shippingInfoValidationSchema)}
        buttonText="Pay Now"
        initialValues={{
          deliveryMethod: 'SHIP',
          emailMarketting: true,
          saveShippingInformation: false,
        }}
        renderButtons={null}
      />
    </Box>
  );
}

export default ShippingInformationContainer;
