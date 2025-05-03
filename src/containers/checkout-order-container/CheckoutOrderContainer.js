import React, { useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';

import CheckoutItem from '@/components/checkout-item/CheckoutItem';
import CheckoutTotals from '@/components/checkout-totals/CheckoutTotals';
import CustomTextField from '@/components/custom-text-field/CustomTextField';
import GenericForm from '@/components/generic-form/GenericForm';
import { formatCurrency } from '@/util/formatCurrency';

const fields = [
  {
    component: CustomTextField,
    name: 'discountCode',
    props: { label: 'Discount Code', size: 'small' },
  },
];

function CheckoutOrderContainer({ cart }) {
  const hasItems = cart?.lines?.length > 0;
  const cost = cart?.cost || null;

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
          itemPrice={formatCurrency(price.currencyCode, price.amount)}
          quantity={line.quantity || 0}
        />
      );
    });
  }, [cart.lines, hasItems]);

  const priceItems = useMemo(
    () => [
      {
        amount: formatCurrency(
          cost?.subtotal?.currencyCode,
          cost?.subtotal?.amount
        ),
        name: 'Subtotal',
      },
      {
        amount: cost?.estimatedShipping?.amount
          ? formatCurrency(
              cost.estimatedShipping.currencyCode,
              cost.estimatedShipping.amount
            )
          : 'Calculated at next step',
        name: 'Shipping',
      },
      {
        amount: formatCurrency(
          cost?.totalTax?.currencyCode,
          cost?.totalTax?.amount
        ),
        name: 'Tax',
      },
      {
        amount: formatCurrency(cost?.total?.currencyCode, cost?.total?.amount),
        isTotal: true,
        name: 'Total',
      },
    ],
    [cost]
  );

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {checkoutItems}
          </Box>
          <GenericForm
            fields={fields}
            onSubmit={handleDiscountCodeApplication}
            buttonOrientation="row"
            buttonSize="medium"
            buttonText="Apply"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {priceItems?.map((item) => (
              <CheckoutTotals key={item.name} item={item} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(CheckoutOrderContainer);
