import { productSelectionSlice } from '../features/product-selection/productSelectionSlice';

export const rootReducer = {
  [productSelectionSlice.name]: productSelectionSlice.reducer,
};
