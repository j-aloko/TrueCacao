import React, { useCallback } from 'react';

import Box from '@mui/material/Box';

import CustomTextField from '@/components/custom-text-field/CustomTextField';
import GenericForm from '@/components/generic-form/GenericForm';
import VariantSelector from '@/components/variant-selector/VariantSelector';
import { formValidation, Yup } from '@/util/formValidation';

const fields = [
  {
    component: CustomTextField,
    name: 'email',
    props: { label: 'Email' },
  },
  {
    component: VariantSelector,
    name: 'deliveryMethod',
    props: {
      label: 'Delivery Method',
      menuItems: [
        { label: 'Ship', value: 'ship' },
        { label: 'Pick in Store', value: 'pickInStore' },
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
    .oneOf(['ship', 'pickInStore'], 'Invalid delivery method')
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

  /* phone: Yup.string()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      'Please enter a valid phone number'
    )
    .nullable(), */

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
    <Box>
      <GenericForm
        fields={fields}
        onSubmit={handleShippingFormSubmit}
        validate={formValidation(shippingInfoValidationSchema)}
        initialValues={null}
        renderButtons={null}
      />
    </Box>
  );
}

export default ShippingInformationContainer;
