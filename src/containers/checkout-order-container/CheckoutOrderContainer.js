import React, { useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';

import CheckoutItem from '@/components/checkout-item/CheckoutItem';
import CustomTextField from '@/components/custom-text-field/CustomTextField';
import GenericForm from '@/components/generic-form/GenericForm';
import { formValidation, Yup } from '@/util/formValidation';

const fields = [
  {
    component: CustomTextField,
    name: 'discountCode',
    props: { label: 'Discount Code' },
  },
];

const discountCodeValidationSchema = Yup.object().shape({
  discountCode: Yup.string()
    .trim()
    .uppercase()
    .matches(/^[A-Z0-9-]+$/, 'Invalid discount code format') // Restricts format to alphanumeric+hyphens
    .min(5, 'Discount code must be at least 5 characters')
    .max(30, 'Discount code is too long')
    .nullable(),
});

function CheckoutOrderContainer({ cart }) {
  const hasItems = cart?.lines?.length > 0;

  const checkoutItems = useMemo(() => {
    if (!hasItems) return null;

    return cart.lines.map((line) => {
      const lineId = line?.id || '';
      const variant = line?.productVariant || {};
      const product = variant?.product || {};
      const price = variant?.price || {};

      return (
        <CheckoutItem
          key={lineId}
          id={lineId}
          image="/product-images/Alltime-cocoa-powder-1.jpg"
          packaging={variant.packaging.type}
          weight={variant.weight}
          productName={product.name}
          itemPrice={`${price.currencyCode || ''}${price.amount || ''}`}
          quantity={line.quantity || 0}
        />
      );
    });
  }, [cart.lines, hasItems]);

  const handleDiscountCodeApplication = useCallback((values) => {
    console.log(values);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
        }}
        role="region"
        aria-label="Cart items"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {checkoutItems}
          <GenericForm
            fields={fields}
            onSubmit={handleDiscountCodeApplication}
            validate={formValidation(discountCodeValidationSchema)}
            buttonOrientation="row"
            buttonText="Apply"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(CheckoutOrderContainer);
