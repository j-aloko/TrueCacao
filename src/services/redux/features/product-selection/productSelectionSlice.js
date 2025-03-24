import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allVariantProperties: {},
  availableVariantProperties: {},
  quantity: 1,
  selectedVariant: null,
  selectedVariantProperties: {},
};

export const productSelectionSlice = createSlice({
  initialState,
  name: 'productSelection',
  reducers: {
    decrementQuantity: (state) => {
      state.quantity = Math.max(1, state.quantity - 1);
    },
    incrementQuantity: (state) => {
      state.quantity += 1;
    },
    selectVariantProperty: (state, action) => {
      const { property, value, variant, availableValues } = action.payload;
      state.selectedVariantProperties[property] = value;
      state.selectedVariant = variant;
      state.availableVariantProperties = availableValues;
    },
    setInitialState: (state, action) => {
      const {
        allVariantProperties,
        availableVariantProperties,
        selectedVariant,
        selectedVariantProperties,
        quantity,
      } = action.payload;

      state.allVariantProperties = allVariantProperties;
      state.availableVariantProperties = availableVariantProperties;
      state.selectedVariant = selectedVariant;
      state.selectedVariantProperties = selectedVariantProperties;
      state.quantity = quantity;
    },
  },
});

export const {
  decrementQuantity,
  incrementQuantity,
  selectVariantProperty,
  setInitialState,
} = productSelectionSlice.actions;

export const productSelectionReducer = productSelectionSlice.reducer;
