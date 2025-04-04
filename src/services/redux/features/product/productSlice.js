import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching variant details
export const fetchVariantDetails = createAsyncThunk(
  'product/fetchVariantDetails',
  async (variantId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/product/variants/${variantId}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch variant details');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  error: null,
  loading: false,
  variantDetails: null,
};

const productSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariantDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVariantDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.variantDetails = action.payload;
      })
      .addCase(fetchVariantDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch variant details';
      });
  },
  initialState,
  name: 'product',
  reducers: {
    clearVariantDetails: (state) => {
      state.variantDetails = null;
      state.error = null;
    },
  },
});

export const { clearVariantDetails } = productSlice.actions;
export const productReducer = productSlice.reducer;
