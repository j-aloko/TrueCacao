'use client';

import React from 'react';

import { useCart } from '@/hooks/useCart';

export default function CartBootProvider({ children }) {
  useCart(); // fetches cart once on mount

  return <>{children}</>;
}
