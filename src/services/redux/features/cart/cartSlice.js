import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { omit } from 'lodash';

import { showErrorToast } from '@/lib/toast/toast';

import { toggleDrawer } from '../cart-drawer/cartDrawerSlice';

// Async thunks for API operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const sessionId = Cookies.get('sessionId') || crypto.randomUUID();
      if (!Cookies.get('sessionId')) {
        Cookies.set('sessionId', sessionId, {
          expires: +process.env.NEXT_PUBLIC_SESSION_ID_EXPIRY_DAYS,
          secure: process.env.NODE_ENV === 'production',
        });
      }

      const response = await fetch('/api/cart', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `sessionId=${sessionId}`,
        },
        method: 'GET',
      });

      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.message || 'Failed to retrieve cart');
        return rejectWithValue(error.message || 'Failed to retrieve cart');
      }

      return response.json();
    } catch (error) {
      showErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addItem',
  async ({ productVariantId, quantity = 1 }, { dispatch, rejectWithValue }) => {
    try {
      const sessionId = Cookies.get('sessionId');

      const response = await fetch('/api/cart', {
        body: JSON.stringify({ productVariantId, quantity }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Cookie: `sessionId=${sessionId}` } : {}),
        },
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.message || 'Failed to add item');
        return rejectWithValue(error.message || 'Failed to add item');
      }

      dispatch(toggleDrawer());
      return response.json();
    } catch (error) {
      showErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/cart-items/${id}`, {
        body: JSON.stringify({ quantity }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      });
      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.message || 'Failed to update item');
        return rejectWithValue(error.message || 'Failed to update item');
      }
      return await response.json();
    } catch (error) {
      showErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  },
  {
    condition: ({ id }, { getState }) => {
      const { cart } = getState();
      // Prevent duplicate updates if already updating this item
      return !cart.itemLoadingStates[id]?.update;
    },
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/cart-items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.message || 'Failed to remove item');
        return rejectWithValue(error.message || 'Failed to remove item');
      }
      return await response.json();
    } catch (error) {
      showErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const mergeCarts = createAsyncThunk(
  'cart/merge',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const sessionId = Cookies.get('sessionId');

      if (auth.user?.id && sessionId) {
        const response = await fetch('/api/cart/merge', {
          body: JSON.stringify({ sessionId }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });

        if (!response.ok) {
          const error = await response.json();
          showErrorToast(error.message || 'Failed to merge cart');
          return rejectWithValue(error.message || 'Failed to merge cart');
        }
        return response.json();
      }
      return null;
    } catch (error) {
      showErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cart: null,
  error: null,
  itemLoadingStates: {},
  lastUpdated: null,
  loading: false,
  loadingStates: {
    add: false,
    fetch: false,
    merge: false,
    remove: false,
    update: false,
  },
};

const cartSlice = createSlice({
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.loadingStates.fetch = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        state.loadingStates.fetch = false;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.loadingStates.fetch = false;
        state.error = action.error.message;
      })

      // Add Item
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.loadingStates.add = true;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        state.loadingStates.add = false;
        state.lastUpdated = Date.now();
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.loadingStates.add = false;
        state.error = action.error.message;
      })

      // Update Item
      .addCase(updateCartItem.pending, (state, action) => {
        const { id } = action.meta.arg;
        state.loading = true;
        state.loadingStates.update = true;
        state.itemLoadingStates = {
          ...state.itemLoadingStates,
          [id]: { ...state.itemLoadingStates[id], update: true },
        };
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        state.loadingStates.update = false;
        state.itemLoadingStates = {
          ...state.itemLoadingStates,
          [action.meta.arg.id]: {
            ...state.itemLoadingStates[action.meta.arg.id],
            update: false,
          },
        };
        state.lastUpdated = Date.now();
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        const { id } = action.meta.arg;
        state.loading = false;
        state.loadingStates.update = false;
        state.itemLoadingStates = {
          ...state.itemLoadingStates,
          [id]: { ...state.itemLoadingStates[id], update: false },
        };
        state.error = action.error.message;
      })

      // Remove Item
      .addCase(removeCartItem.pending, (state, action) => {
        const { id } = action.meta.arg;
        state.loading = true;
        state.loadingStates.remove = true;
        state.itemLoadingStates = {
          ...state.itemLoadingStates,
          [id]: {
            ...(state.itemLoadingStates[id] || {}),
            remove: true,
          },
        };
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        state.loadingStates.remove = false;

        const { id } = action.meta.arg;
        if (state.itemLoadingStates[id]) {
          state.itemLoadingStates = omit(state.itemLoadingStates, id);
        }

        state.lastUpdated = Date.now();
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        const { id } = action.meta.arg;
        state.loading = false;
        state.loadingStates.remove = false;

        // Only clean up the remove operation, preserve other loading states if they exist
        state.itemLoadingStates = {
          ...state.itemLoadingStates,
          [id]: {
            ...(state.itemLoadingStates[id] || {}),
            remove: false,
          },
        };
      })

      // Merge Carts
      .addCase(mergeCarts.pending, (state) => {
        state.loading = true;
        state.loadingStates.merge = true;
      })
      .addCase(mergeCarts.fulfilled, (state, action) => {
        if (action.payload) {
          state.cart = action.payload;
          state.loading = false;
          state.loadingStates.merge = false;
          state.lastUpdated = Date.now();
        }
      })
      .addCase(mergeCarts.rejected, (state, action) => {
        state.loading = false;
        state.loadingStates.merge = false;
        state.error = action.error.message;
      });
  },
  initialState,
  name: 'cart',
  reducers: {
    clearCart: (state) => {
      state.cart = null;
      state.lastUpdated = Date.now();
    },
  },
});

export const { clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
