'use client';

import React, { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

import CounterField from '@/app/components/counter-field/CounterField';
import GenericForm from '@/app/components/generic-form/GenericForm';
import RenderProductButtons from '@/app/components/render-product-buttons/RenderProductButtons';
import TextBlock from '@/app/components/text-block/TextBlock';
import VariantSelector from '@/app/components/variant-selector/VariantSelector';
import { formValidation, Yup } from '@/app/util/form-validation';

const fields = [
  {
    component: VariantSelector,
    name: 'weight',
    props: {
      menuItems: [
        { label: '100g', value: '100g' },
        { label: '50g', value: '50g' },
        { label: '20g', value: '20g' },
      ],
    },
  },
  {
    component: VariantSelector,
    name: 'packaging',
    props: {
      menuItems: [
        { label: 'Single Box', value: 'box' },
        { label: 'Carton', value: 'carton' },
      ],
    },
  },
  {
    component: CounterField,
    name: 'quantity',
  },
];

const productFormValidationSchema = Yup.object({
  packaging: Yup.string().required('Required Field'),
  quantity: Yup.number()
    .required('Required Field')
    .min(1, 'Quantity must be at least 1'),
  weight: Yup.string().required('Required Field'),
});

function ProductDetailsContainer() {
  const [actionType, setActionType] = useState(null);

  // Memoized form submission handler
  const handleProductFormSubmit = useCallback(
    (values) => {
      if (actionType === 'addToCart') {
        console.log('Adding to Cart:', values);
        // Call API or dispatch action to add item to cart
      } else if (actionType === 'buyNow') {
        console.log('Buying Now:', values);
        // Redirect to checkout page or process immediate purchase
      }
    },
    [actionType]
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} m={3}>
        <Grid size={7} p={3} border="2px solid red">
          <Box flexGrow={1}>size 8</Box>
        </Grid>
        <Grid size={5} p={3} border="2px solid yellow">
          <Box flexGrow={1}>
            <Stack spacing={2}>
              <Stack spacing={3}>
                <TextBlock text="Royale Cocoa powder" variant="h6" />
                <TextBlock text="GH₵50.00" />
                <Divider />
              </Stack>
              <Stack spacing={3}>
                <GenericForm
                  fields={fields}
                  onSubmit={handleProductFormSubmit}
                  validate={formValidation(productFormValidationSchema)}
                  initialValues={{
                    packaging: 'box',
                    quantity: 1,
                    weight: '100g',
                  }}
                  renderButtons={(props) => (
                    <RenderProductButtons
                      {...props}
                      onAddToCart={() => setActionType('addToCart')}
                      onBuyNow={() => setActionType('buyNow')}
                    />
                  )}
                />
                <Divider />
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductDetailsContainer;
