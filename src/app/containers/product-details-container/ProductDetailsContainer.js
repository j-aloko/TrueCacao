'use client';

import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

import CounterField from '@/app/components/counter-field/CounterField';
import RenderProductButtons from '@/app/components/render-product-buttons/RenderProductButtons';
import TextBlock from '@/app/components/text-block/TextBlock';
import { VARIANT_LABELS } from '@/app/constants/variantLabels';
import {
  decrementQuantity,
  incrementQuantity,
  selectPackaging,
  selectWeight,
  setInitialState,
} from '@/app/services/redux/features/product-selection/productSelectionSlice';
import { useAppDispatch, useAppSelector } from '@/app/services/redux/store';
import { formatString } from '@/app/util/formatString';

function ProductDetailsContainer({ product }) {
  const dispatch = useAppDispatch();
  const {
    allPackagings,
    allWeights,
    selectedPackaging,
    selectedVariant,
    selectedWeight,
    quantity,
    availableWeights,
  } = useAppSelector((state) => state.productSelection);

  // Initialize state on component mount
  useEffect(() => {
    if (product.variants.length && !selectedVariant) {
      // Only initialize if selectedVariant is not already set (i.e., no persisted state)
      const initialPackagings = [
        ...new Set(product.variants.map((v) => v.packaging.type)),
      ];
      const initialWeights = [
        ...new Set(product.variants.map((v) => v.weight)),
      ];
      const defaultVariant =
        product.variants.find((v) => v.stock > 0) || product.variants[0];

      // Calculate available weights and packagings based on the default variant
      const initialAvailableWeights = product.variants
        .filter((v) => v.packaging.type === defaultVariant.packaging.type)
        .map((v) => v.weight);
      const initialAvailablePackagings = product.variants
        .filter((v) => v.weight === defaultVariant.weight)
        .map((v) => v.packaging.type);

      // Dispatch the initial state to Redux
      dispatch(
        setInitialState({
          allPackagings: initialPackagings,
          allWeights: initialWeights,
          availablePackagings: initialAvailablePackagings,
          availableWeights: initialAvailableWeights,
          quantity: 1,
          selectedPackaging: defaultVariant.packaging.type,
          selectedVariant: defaultVariant,
          selectedWeight: defaultVariant.weight,
        })
      );
    }
  }, [dispatch, product, selectedVariant]);

  const handlePackagingSelect = (packaging) => {
    const validWeights = product.variants
      .filter((v) => v.packaging.type === packaging)
      .map((v) => v.weight);
    const foundVariant = product.variants.find(
      (v) => v.packaging.type === packaging && validWeights.includes(v.weight)
    );
    dispatch(
      selectPackaging({
        availableWeights: validWeights,
        packaging,
        variant: foundVariant,
      })
    );
  };

  const handleWeightSelect = (weight) => {
    const validPackagings = product.variants
      .filter((v) => v.weight === weight)
      .map((v) => v.packaging.type);
    const foundVariant = product.variants.find(
      (v) => v.weight === weight && validPackagings.includes(v.packaging.type)
    );
    dispatch(
      selectWeight({
        availablePackagings: validPackagings,
        variant: foundVariant,
        weight,
      })
    );
  };

  const handleIncrement = () => {
    dispatch(incrementQuantity());
  };

  const handleDecrement = () => {
    dispatch(decrementQuantity());
  };

  const onAddToCart = () => {
    console.log('Adding to cart:', {
      quantity,
      variant: selectedVariant,
    });
  };

  const onBuyNow = () => {
    console.log('Buying now:', {
      quantity,
      variant: selectedVariant,
    });
  };

  // Determine if a weight is disabled
  const isWeightDisabled = (weight) =>
    selectedPackaging && !availableWeights.includes(weight);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        <Grid size={7} p={3} border="2px solid red">
          <Box flexGrow={1}>{/* Display first product image */}</Box>
        </Grid>

        <Grid size={5} p={3} border="2px solid yellow">
          <Box flexGrow={1}>
            <Stack spacing={3.5}>
              <TextBlock
                text={product?.name}
                variant="h5"
                component="h1"
                sx={(theme) => ({
                  color: theme.palette.primary.dark,
                  fontWeight: 500,
                })}
              />
              <TextBlock
                text={`GH₵${selectedVariant?.price || 0}`}
                variant="h6"
                component="h2"
              />
              <Divider />
              <Stack spacing={2}>
                <TextBlock
                  text={VARIANT_LABELS.packaging.label}
                  variant="subtitle2"
                />
                <Box direction="row" spacing={1}>
                  {allPackagings.map((packaging) => (
                    <Chip
                      key={packaging}
                      label={formatString(packaging)}
                      color={
                        selectedPackaging === packaging ? 'primary' : 'default'
                      }
                      onClick={() => handlePackagingSelect(packaging)}
                    />
                  ))}
                </Box>
              </Stack>
              <Stack spacing={2}>
                <TextBlock
                  text={VARIANT_LABELS.weight.label}
                  variant="subtitle2"
                />
                <Box direction="row" spacing={1} sx={{ mt: 2 }}>
                  {allWeights.map((weight) => (
                    <Chip
                      key={weight}
                      label={`${weight}g`}
                      color={selectedWeight === weight ? 'primary' : 'default'}
                      onClick={() => handleWeightSelect(weight)}
                      disabled={isWeightDisabled(weight)}
                    />
                  ))}
                </Box>
              </Stack>
              <CounterField
                value={quantity}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
              <RenderProductButtons
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
              />
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductDetailsContainer;
