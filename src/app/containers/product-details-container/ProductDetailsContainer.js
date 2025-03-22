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
import {
  decrementQuantity,
  incrementQuantity,
  selectVariantProperty,
  setInitialState,
} from '@/app/services/redux/features/product-selection/productSelectionSlice';
import { useAppDispatch, useAppSelector } from '@/app/services/redux/store';
import { formatString } from '@/app/util/formatString';

function ProductDetailsContainer({
  product,
  variantProps,
  labels,
  disableOptions = {},
}) {
  const dispatch = useAppDispatch();
  const {
    allVariantProperties,
    selectedVariant,
    quantity,
    availableVariantProperties,
  } = useAppSelector((state) => state.productSelection);

  // Initialize state on component mount
  useEffect(() => {
    if (product.variants.length && !selectedVariant) {
      // Extract all unique values for each variant property
      const initialVariantProperties = variantProps.reduce((acc, prop) => {
        acc[prop] = [
          ...new Set(product.variants.map((v) => getNestedProperty(v, prop))),
        ];
        return acc;
      }, {});

      const defaultVariant =
        product.variants.find((v) => v.stock > 0) || product.variants[0];

      // Calculate available variant properties based on the default variant
      const initialAvailableVariantProperties = variantProps.reduce(
        (acc, prop) => {
          acc[prop] = product.variants
            .filter((v) =>
              // Check if the variant matches all other selected properties
              variantProps.every((p) => {
                if (p === prop) return true; // Skip the current property
                return (
                  getNestedProperty(v, p) ===
                  getNestedProperty(defaultVariant, p)
                );
              })
            )
            .map((v) => getNestedProperty(v, prop));
          return acc;
        },
        {}
      );

      // Dispatch the initial state to Redux
      dispatch(
        setInitialState({
          allVariantProperties: initialVariantProperties,
          availableVariantProperties: initialAvailableVariantProperties,
          quantity: 1,
          selectedVariant: defaultVariant,
          selectedVariantProperties: variantProps.reduce((acc, prop) => {
            acc[prop] = getNestedProperty(defaultVariant, prop);
            return acc;
          }, {}),
        })
      );
    }
  }, [dispatch, product, selectedVariant, variantProps]);

  const handleVariantPropertySelect = (property, value) => {
    // Find all variants that match the new property value
    const validVariants = product.variants.filter(
      (v) => getNestedProperty(v, property) === value
    );

    // Find the variant that matches the new property value and other selected properties
    const foundVariant =
      validVariants.find((v) =>
        variantProps.every((p) => {
          if (p === property) return true; // Skip the current property
          return (
            getNestedProperty(v, p) === getNestedProperty(selectedVariant, p)
          );
        })
      ) || validVariants[0]; // Fallback to the first valid variant if no exact match is found

    // Calculate available values for each property based on the found variant
    const availableValues = variantProps.reduce((acc, prop) => {
      acc[prop] = [
        ...new Set(
          product.variants
            .filter((v) =>
              variantProps.every((p) => {
                if (p === prop) return true; // Skip the current property
                return (
                  getNestedProperty(v, p) === getNestedProperty(foundVariant, p)
                );
              })
            )
            .map((v) => getNestedProperty(v, prop))
        ),
      ];
      return acc;
    }, {});

    dispatch(
      selectVariantProperty({
        availableValues,
        property,
        value,
        variant: foundVariant,
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

  // Helper function to get nested properties (e.g., 'packaging.type')
  const getNestedProperty = (obj, path) =>
    path.split('.').reduce((acc, part) => acc?.[part], obj);

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
              {variantProps.map((prop) => (
                <Stack key={prop} spacing={2}>
                  <TextBlock
                    text={labels[prop.split('.')[0]] || prop}
                    variant="subtitle2"
                  />
                  <Box direction="row" spacing={1}>
                    {allVariantProperties[prop]?.map((value) => (
                      <Chip
                        key={value}
                        label={
                          typeof value === 'string'
                            ? formatString(value)
                            : `${value}g`
                        }
                        color={
                          getNestedProperty(selectedVariant, prop) === value
                            ? 'primary'
                            : 'default'
                        }
                        onClick={() => handleVariantPropertySelect(prop, value)}
                        disabled={
                          disableOptions[prop.split('.')[0]] && // Check if disabling is enabled for this property
                          !availableVariantProperties[prop]?.includes(value) // Check if the option is unavailable
                        }
                      />
                    ))}
                  </Box>
                </Stack>
              ))}
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
