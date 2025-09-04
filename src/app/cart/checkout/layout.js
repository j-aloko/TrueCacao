import React from 'react';

import LayoutContainer from '@/containers/layout-container/LayoutContainer';

export default function CheckoutLayout({ children }) {
  return <LayoutContainer showFooter={false}>{children}</LayoutContainer>;
}
