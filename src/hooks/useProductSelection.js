'use client';

import { useCallback, useReducer } from 'react';

import { getNestedProperty } from '@/util/getNestedProperty';

const initialState = {
  allVariantProperties: {},
  availableVariantProperties: {},
  quantity: 1,
  selectedVariant: null,
  selectedVariantProperties: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return {
        ...state,
        allVariantProperties: action.payload.allVariantProperties,
        availableVariantProperties: action.payload.availableVariantProperties,
        quantity: action.payload.quantity,
        selectedVariant: action.payload.selectedVariant,
        selectedVariantProperties: action.payload.selectedVariantProperties,
      };
    case 'SELECT_VARIANT_PROPERTY':
      return {
        ...state,
        availableVariantProperties: action.payload.availableValues,
        selectedVariant: action.payload.variant,
        selectedVariantProperties: {
          ...state.selectedVariantProperties,
          [action.payload.property]: action.payload.value,
        },
      };
    case 'INCREMENT_QUANTITY':
      return {
        ...state,
        quantity: state.quantity + 1,
      };
    case 'DECREMENT_QUANTITY':
      return {
        ...state,
        quantity: Math.max(1, state.quantity - 1),
      };
    default:
      return state;
  }
}

export function useProductSelection() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initializeState = useCallback((product, variantProps) => {
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
            variantProps.every((p) => {
              if (p === prop) return true; // Skip the current property
              return (
                getNestedProperty(v, p) === getNestedProperty(defaultVariant, p)
              );
            })
          )
          .map((v) => getNestedProperty(v, prop));
        return acc;
      },
      {}
    );

    dispatch({
      payload: {
        allVariantProperties: initialVariantProperties,
        availableVariantProperties: initialAvailableVariantProperties,
        quantity: 1,
        selectedVariant: defaultVariant,
        selectedVariantProperties: variantProps.reduce((acc, prop) => {
          acc[prop] = getNestedProperty(defaultVariant, prop);
          return acc;
        }, {}),
      },
      type: 'SET_INITIAL_STATE',
    });
  }, []);

  const selectVariantProperty = useCallback(
    (product, variantProps, selectedVariant, property, value) => {
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
                    getNestedProperty(v, p) ===
                    getNestedProperty(foundVariant, p)
                  );
                })
              )
              .map((v) => getNestedProperty(v, prop))
          ),
        ];
        return acc;
      }, {});

      dispatch({
        payload: {
          availableValues,
          property,
          value,
          variant: foundVariant,
        },
        type: 'SELECT_VARIANT_PROPERTY',
      });
    },
    []
  );

  const incrementQuantity = useCallback(() => {
    dispatch({ type: 'INCREMENT_QUANTITY' });
  }, []);

  const decrementQuantity = useCallback(() => {
    dispatch({ type: 'DECREMENT_QUANTITY' });
  }, []);

  return {
    decrementQuantity,
    incrementQuantity,
    initializeState,
    selectVariantProperty,
    state,
  };
}
