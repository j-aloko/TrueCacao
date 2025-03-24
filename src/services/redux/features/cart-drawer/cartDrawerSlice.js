import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
};

const cartDrawerSlice = createSlice({
  initialState,
  name: 'cartDrawer',
  reducers: {
    closeDrawer: (state) => {
      state.isOpen = false;
    },
    openDrawer: (state) => {
      state.isOpen = true;
    },
    toggleDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openDrawer, closeDrawer, toggleDrawer } =
  cartDrawerSlice.actions;
export const cartDrawerReducer = cartDrawerSlice.reducer;
