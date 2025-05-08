import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
// import { omit } from 'lodash';

import { showErrorToast } from '@/lib/toast/toast';

import { toggleDrawer } from '../cart-drawer/cartDrawerSlice';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const sessionId = Cookies.get('sessionId') || crypto.randomUUID();
      if (!Cookies.get('sessionId')) {
        Cookies.set('sessionId', sessionId, {
          expires: 60 * 60 * 24 * 7, // 7 days
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
  async ({ productVariant, quantity = 1 }, { dispatch, rejectWithValue }) => {
    const sessionId = Cookies.get('sessionId');

    const tempItem = {
      id: `temp-${productVariant?.id}-${Date.now()}`,
      isTemporary: true,
      productVariant,
      quantity,
    };

    dispatch(cartSlice.actions.optimisticAddItem(tempItem));
    dispatch(toggleDrawer());

    try {
      const response = await fetch('/api/cart', {
        body: JSON.stringify({
          productVariantId: productVariant?.id,
          quantity,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { Cookie: `sessionId=${sessionId}` } : {}),
        },
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(
          (await response.json().message) || 'Failed to add item'
        );
      }

      return response.json();
    } catch (error) {
      showErrorToast(error.message);
      dispatch(cartSlice.actions.rollbackAddItem(tempItem.id));
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ id, quantity }, { dispatch, rejectWithValue }) => {
    dispatch(
      cartSlice.actions.optimisticUpdateItem({ id, newQuantity: quantity })
    );

    try {
      const response = await fetch(`/api/cart/cart-items/${id}`, {
        body: JSON.stringify({ quantity }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error(
          (await response.json().message) || 'Failed to update item'
        );
      }

      return await response.json();
    } catch (error) {
      showErrorToast(error.message);
      dispatch(cartSlice.actions.rollbackUpdateItem({ id }));
      return rejectWithValue(error.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async ({ id }, { dispatch, getState, rejectWithValue }) => {
    const item = getState().cart.cart.lines.find((line) => line.id === id);
    dispatch(cartSlice.actions.optimisticRemoveItem(id));

    try {
      const response = await fetch(`/api/cart/cart-items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(
          (await response.json().message) || 'Failed to remove item'
        );
      }

      return await response.json();
    } catch (error) {
      showErrorToast(error.message);
      dispatch(cartSlice.actions.rollbackRemoveItem(item));
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
          headers: { 'Content-Type': 'application/json' },
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

// Initial State
const initialState = {
  cart: { lines: [] },
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

// Cart Slice Definition
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
      /* .addCase(addCartItem.pending, (state) => {
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
      }) */

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
      state.cart = { lines: [] };
      state.lastUpdated = Date.now();
    },
    optimisticAddItem: (state, action) => {
      const { productVariant, quantity } = action.payload;
      // Prevent duplicate additions
      const existingItem = state.cart.lines.find(
        (line) => line.productVariant?.id === productVariant.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const tempItem = {
          id: `temp-${productVariant.id}-${Date.now()}`,
          isTemporary: true,
          productVariant,
          quantity,
        };
        state.cart.lines.push(tempItem);
      }
    },
    optimisticRemoveItem: (state, action) => {
      state.cart.lines = state.cart.lines.filter(
        (item) => item.id !== action.payload
      );
    },
    optimisticUpdateCost: (state) => {
      const subtotalAmount = state.cart.lines.reduce(
        (sum, line) =>
          sum + (line.productVariant.price?.amount || 0) * line.quantity,
        0
      );

      state.cart.cost = {
        subtotal: {
          amount: parseFloat(subtotalAmount.toFixed(2)),
          currencyCode: 'USD',
        },
      };
    },
    optimisticUpdateItem: (state, action) => {
      const { id, newQuantity } = action.payload;
      const cartItem = state.cart.lines.find((item) => item.id === id);
      if (cartItem) cartItem.quantity = newQuantity;
    },
    rollbackAddItem: (state, action) => {
      state.cart.lines = state.cart.lines.filter(
        (item) => item.id !== action.payload
      );
    },
    rollbackRemoveItem: (state, action) => {
      state.cart.lines.push(action.payload);
    },
    rollbackUpdateItem: (state, action) => {
      const { id } = action.payload;
      const cartItem = state.cart.lines.find((item) => item.id === id);
      if (cartItem) cartItem.quantity = action.payload.originalQuantity;
    },
  },
});

export const {
  clearCart,
  optimisticAddItem,
  optimisticRemoveItem,
  optimisticUpdateItem,
  rollbackAddItem,
  rollbackRemoveItem,
  rollbackUpdateItem,
  optimisticUpdateCost,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
