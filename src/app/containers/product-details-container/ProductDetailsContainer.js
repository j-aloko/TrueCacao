'use client';

import React, { useReducer, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';

import CounterField from '@/app/components/counter-field/CounterField';
import RenderProductButtons from '@/app/components/render-product-buttons/RenderProductButtons';
import TextBlock from '@/app/components/text-block/TextBlock';
import { getLocalStorageData } from '@/app/util/get-local-storage-data';

// Helper function to validate savedVariant
const validateSavedVariant = (savedVariant, productVariants) => {
  if (
    savedVariant &&
    typeof savedVariant === 'object' &&
    savedVariant.packaging &&
    savedVariant.packaging.type &&
    savedVariant.weight &&
    productVariants.some((v) => v.id === savedVariant.id)
  ) {
    return savedVariant;
  }
  return null;
};

const initialState = {
  allPackagings: [],
  allWeights: [],
  availablePackagings: [],
  availableWeights: [],
  quantity: 1,
  selectedPackaging: null,
  selectedVariant: null,
  selectedWeight: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_INITIAL':
      return {
        ...state,
        allPackagings: action.packagings,
        allWeights: action.weights,
        availablePackagings: action.availablePackagings,
        availableWeights: action.availableWeights,
        quantity: action.quantity || 1,
        selectedPackaging: action.defaultVariant?.packaging?.type || null,
        selectedVariant: action.defaultVariant,
        selectedWeight: action.defaultVariant?.weight || null, // Initialize quantity from localStorage
      };
    case 'SELECT_PACKAGING':
      return {
        ...state,
        availableWeights: action.weights,
        selectedPackaging: action.payload,
        selectedVariant: action.variant,
        selectedWeight: action.variant?.weight || null,
      };
    case 'SELECT_WEIGHT':
      return {
        ...state,
        availablePackagings: action.packagings,
        selectedPackaging: action.variant?.packaging?.type || null,
        selectedVariant: action.variant,
        selectedWeight: action.payload,
      };
    case 'INCREMENT_QUANTITY':
      return {
        ...state,
        quantity: state.quantity + 1,
      };
    case 'DECREMENT_QUANTITY':
      return {
        ...state,
        quantity: Math.max(1, state.quantity - 1), // Ensure quantity doesn't go below 1
      };
    default:
      return state;
  }
}

function ProductDetailsContainer({ product }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Save selected variant and quantity to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'selectedVariant',
        JSON.stringify(state.selectedVariant)
      );
      localStorage.setItem('quantity', JSON.stringify(state.quantity));
    }
  }, [state.selectedVariant, state.quantity]);

  // Initialize state from localStorage on component mount
  useEffect(() => {
    if (product.variants.length) {
      const packagings = [
        ...new Set(product.variants.map((v) => v.packaging.type)),
      ];
      const weights = [...new Set(product.variants.map((v) => v.weight))];
      const defaultVariant =
        product.variants.find((v) => v.stock > 0) || product.variants[0];

      // Retrieve saved data from localStorage
      const savedVariant = validateSavedVariant(
        getLocalStorageData('selectedVariant', defaultVariant),
        product.variants
      );
      const savedQuantity = getLocalStorageData('quantity', 1);

      // Calculate available weights and packagings based on the saved variant
      const availableWeights = product.variants
        .filter(
          (v) =>
            v.packaging.type === (savedVariant || defaultVariant).packaging.type
        )
        .map((v) => v.weight);
      const availablePackagings = product.variants
        .filter((v) => v.weight === (savedVariant || defaultVariant).weight)
        .map((v) => v.packaging.type);

      dispatch({
        availablePackagings,
        availableWeights,
        defaultVariant: savedVariant || defaultVariant,
        packagings,
        quantity: savedQuantity,
        type: 'SET_INITIAL',
        weights,
      });
    }
  }, [product]);

  const handlePackagingSelect = (packaging) => {
    const validWeights = product.variants
      .filter((v) => v.packaging.type === packaging)
      .map((v) => v.weight);
    const selectedVariant = product.variants.find(
      (v) => v.packaging.type === packaging && validWeights.includes(v.weight)
    );
    dispatch({
      payload: packaging,
      type: 'SELECT_PACKAGING',
      variant: selectedVariant,
      weights: validWeights,
    });
  };

  const handleWeightSelect = (weight) => {
    const validPackagings = product.variants
      .filter((v) => v.weight === weight)
      .map((v) => v.packaging.type);
    const selectedVariant = product.variants.find(
      (v) => v.weight === weight && validPackagings.includes(v.packaging.type)
    );
    dispatch({
      packagings: validPackagings,
      payload: weight,
      type: 'SELECT_WEIGHT',
      variant: selectedVariant,
    });
  };

  const handleIncrement = () => {
    dispatch({ type: 'INCREMENT_QUANTITY' });
  };

  const handleDecrement = () => {
    dispatch({ type: 'DECREMENT_QUANTITY' });
  };

  const onAddToCart = () => {
    console.log('Adding to cart:', {
      quantity: state.quantity,
      variant: state.selectedVariant,
    });
  };

  const onBuyNow = () => {
    console.log('Buying now:', {
      quantity: state.quantity,
      variant: state.selectedVariant,
    });
  };

  const isWeightDisabled = (weight) =>
    state.selectedPackaging && !state.availableWeights.includes(weight);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={2} m={3}>
        <Grid size={7} p={3} border="2px solid red">
          <Box flexGrow={1}>{/* Display first product image */}</Box>
        </Grid>

        <Grid size={5} p={3} border="2px solid yellow">
          <Box flexGrow={1}>
            <Stack spacing={3}>
              <TextBlock text={product?.name} variant="h6" />
              <TextBlock text={`GH₵${state.selectedVariant?.price || 0}`} />
              <Divider />
              <Box direction="row" spacing={1}>
                {state.allPackagings.map((packaging) => (
                  <Chip
                    key={packaging}
                    label={packaging.replace('_', ' ')}
                    color={
                      state.selectedPackaging === packaging
                        ? 'primary'
                        : 'default'
                    }
                    onClick={() => handlePackagingSelect(packaging)}
                  />
                ))}
              </Box>
              <Box direction="row" spacing={1} sx={{ mt: 2 }}>
                {state.allWeights.map((weight) => (
                  <Chip
                    key={weight}
                    label={`${weight}g`}
                    color={
                      state.selectedWeight === weight ? 'primary' : 'default'
                    }
                    onClick={() => handleWeightSelect(weight)}
                    disabled={isWeightDisabled(weight)}
                  />
                ))}
              </Box>
              <CounterField
                value={state.quantity}
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
