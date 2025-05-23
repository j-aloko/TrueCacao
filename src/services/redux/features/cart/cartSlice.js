import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// Async thunks for API operations
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const sessionId = Cookies.get('sessionId') || crypto.randomUUID();
  if (!Cookies.get('sessionId')) {
    Cookies.set('sessionId', sessionId, {
      expires: 30,
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
  return response.json();
});

export const addCartItem = createAsyncThunk(
  'cart/addItem',
  async ({ productVariantId, quantity = 1 }) => {
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
    return response.json();
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, quantity }) => {
    const response = await fetch(`/api/cart-items/${itemId}`, {
      body: JSON.stringify({ quantity }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
    return response.json();
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (itemId) => {
    await fetch(`/api/cart-items/${itemId}`, {
      method: 'DELETE',
    });
    return itemId;
  }
);

export const mergeCarts = createAsyncThunk(
  'cart/merge',
  async (_, { getState }) => {
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
      return response.json();
    }
    return null;
  }
);

const initialState = {
  cart: null,
  error: null,
  lastUpdated: null,
  loading: false,
};

const cartSlice = createSlice({
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add Item
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart.lines = state.cart.lines.map((line) =>
            line.id === action.payload.id ? action.payload : line
          );
        }
        state.loading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Remove Item
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart.lines = state.cart.lines.filter(
            (line) => line.id !== action.payload
          );
        }
        state.loading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Merge Carts
      .addCase(mergeCarts.fulfilled, (state, action) => {
        if (action.payload) {
          state.cart = action.payload;
          state.lastUpdated = Date.now();
        }
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
