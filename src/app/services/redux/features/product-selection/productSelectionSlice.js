import { createSlice } from '@reduxjs/toolkit';

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
    selectPackaging: (state, action) => {
      const { packaging, variant, availableWeights } = action.payload;
      state.selectedPackaging = packaging;
      state.selectedVariant = variant;
      state.selectedWeight = variant?.weight || null;
      state.availableWeights = availableWeights;
    },
    selectWeight: (state, action) => {
      const { weight, variant, availablePackagings } = action.payload;
      state.selectedWeight = weight;
      state.selectedVariant = variant;
      state.selectedPackaging = variant?.packaging?.type || null;
      state.availablePackagings = availablePackagings;
    },
    setInitialState: (state, action) => {
      const {
        allPackagings,
        allWeights,
        selectedPackaging,
        selectedVariant,
        selectedWeight,
        quantity,
        availablePackagings,
        availableWeights,
      } = action.payload;

      state.allPackagings = allPackagings;
      state.allWeights = allWeights;
      state.selectedPackaging = selectedPackaging;
      state.selectedVariant = selectedVariant;
      state.selectedWeight = selectedWeight;
      state.quantity = quantity;
      state.availablePackagings = availablePackagings;
      state.availableWeights = availableWeights;
    },
  },
});

export const {
  setInitialState,
  selectPackaging,
  selectWeight,
  incrementQuantity,
  decrementQuantity,
} = productSelectionSlice.actions;

export const productSelectionReducer = productSelectionSlice.reducer;
