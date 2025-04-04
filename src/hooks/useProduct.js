'use client';

import { useCallback, useMemo } from 'react';

import { shallowEqual } from 'react-redux';

import {
  fetchVariantDetails,
  clearVariantDetails,
} from '@/services/redux/features/product/productSlice';
import { useAppDispatch, useAppSelector } from '@/services/redux/store';

export function useProduct() {
  const dispatch = useAppDispatch();

  // Use shallowEqual to prevent unnecessary re-renders
  const { variantDetails, loading, error } = useAppSelector(
    (state) => ({
      error: state.product.error,
      loading: state.product.loading,
      variantDetails: state.product.variantDetails,
    }),
    shallowEqual
  );

  // Memoize the action dispatchers
  const getVariantDetails = useCallback(
    (variantId) => dispatch(fetchVariantDetails(variantId)),
    [dispatch]
  );

  const resetVariantDetails = useCallback(
    () => dispatch(clearVariantDetails()),
    [dispatch]
  );

  // Memoize the returned object
  return useMemo(
    () => ({
      error,
      getVariantDetails,
      loading,
      resetVariantDetails,
      variantDetails,
    }),
    [error, getVariantDetails, loading, resetVariantDetails, variantDetails]
  );
}
