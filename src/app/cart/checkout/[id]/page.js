import React from 'react';

import CheckoutContainer from '@/containers/checkout-container/CheckoutContainer';

export default async function CheckoutPage({ params }) {
  const { id } = await params;

  return <CheckoutContainer id={id} />;
}
