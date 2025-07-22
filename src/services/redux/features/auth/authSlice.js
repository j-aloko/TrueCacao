import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import { EMAIL_VERIFICATION_STATUS, USER_ROLE } from '@/constants/constants';
import { ROUTES } from '@/constants/routes';
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendPasswordResetConfirmationEmail,
} from '@/lib/auth/email-service';
import { showErrorToast, showSuccessToast } from '@/lib/toast/toast';

import { mergeCarts } from '../cart/cartSlice';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, router }, { rejectWithValue, dispatch }) => {
    try {
      const loginResponse = await fetch('/api/v1/auth/login', {
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!loginResponse.ok) {
        const error = await loginResponse.json();
        return rejectWithValue(error);
      }

      const { user } = await loginResponse.json();

      const sessionId = Cookies.get('sessionId');
      await dispatch(mergeCarts({ sessionId, userId: user?.id }));

      return { router, user };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    { name, email, password, role = USER_ROLE.CUSTOMER, router },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/v1/auth/register', {
        body: JSON.stringify({ email, name, password, role }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }
      const { user } = await response.json();
      await sendVerificationEmail(user.email, user.verificationLink);
      return { router, user };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resendEmailVerification = createAsyncThunk(
  'auth/resendEmailverification',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        '/api/v1/auth/resend-email-verification-link',
        {
          body: JSON.stringify({ email }),
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        }
      );
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }
      const { message, user } = await response.json();
      await sendVerificationEmail(user.email, user.verificationLink);
      return { message };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/auth/verify-email?token=${token}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }
      return response.json();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/auth/request-password-reset-link', {
        body: JSON.stringify({ email }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();

        return rejectWithValue(error);
      }
      const { message, user } = await response.json();
      await sendPasswordResetEmail(user.email, user.verificationLink);
      return { message };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password, router }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/v1/auth/reset-password?token=${token}`,
        {
          body: JSON.stringify({ password }),
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        }
      );
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }
      const { message, user } = await response.json();
      await sendPasswordResetConfirmationEmail(user.email);
      return { message, router };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/auth/logout', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error);
      }
      return true;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch('/api/v1/auth/refresh-token', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        dispatch(logoutUser());
        return rejectWithValue(error);
      }
      return true;
    } catch (error) {
      dispatch(logoutUser());
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  emailVerificationStatus: EMAIL_VERIFICATION_STATUS.IDLE,
  error: null,
  isAuthenticated: false,
  isLoading: false,
  isVerified: false,
  lastVisitedPage: null,
  pendingVerificationEmail: null,
  user: null,
};

const authSlice = createSlice({
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, router } = action.payload;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = user;
        state.isVerified = user.verified;
        state.error = null;
        router.push(ROUTES.home);
      })
      .addCase(loginUser.rejected, (state, action) => {
        const { text, message } = action.payload;
        state.isLoading = false;
        state.error = text || message;
        showErrorToast(text || message);
      })

      // Registration
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { user, router } = action.payload;
        state.isLoading = false;
        state.pendingVerificationEmail = user.email;
        state.error = null;
        router.push(ROUTES.verifyEmail);
      })
      .addCase(registerUser.rejected, (state, action) => {
        const { text, message } = action.payload;
        state.isLoading = false;
        state.error = text || message;
        showErrorToast(text || message);
      })

      .addCase(resendEmailVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendEmailVerification.fulfilled, (state, action) => {
        const { message } = action.payload;
        state.isLoading = false;
        state.error = null;
        showSuccessToast(message);
      })
      .addCase(resendEmailVerification.rejected, (state, action) => {
        const { text, message } = action.payload;
        state.isLoading = false;
        state.error = text || message;
        showErrorToast(text || message);
      })

      // Email Verification
      .addCase(verifyEmail.pending, (state) => {
        state.error = null;
        state.emailVerificationStatus = EMAIL_VERIFICATION_STATUS.PENDING;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        const {
          user: { verified },
        } = action.payload;
        state.isVerified = verified;
        state.emailVerificationStatus = EMAIL_VERIFICATION_STATUS.VERIFIED;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        const { text, message } = action.payload;
        state.isLoading = false;
        state.error = text || message;
        showErrorToast(text || message);
        state.emailVerificationStatus = EMAIL_VERIFICATION_STATUS.FAILED;
      })

      // Password Reset
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        const { message } = action.payload;
        state.isLoading = false;
        state.error = null;
        showSuccessToast(message);
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        const { text, message } = action.payload;
        state.isLoading = false;
        state.error = text || message;
        showErrorToast(text || message);
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        const { router, message } = action.payload;
        state.isLoading = false;
        state.error = null;
        showSuccessToast(message);
        router.push(ROUTES.login);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        const { text, message } = action.payload;
        state.isLoading = false;
        state.error = text || message;
        showErrorToast(text || message);
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.pendingVerificationEmail = null;
        state.emailVerificationStatus = EMAIL_VERIFICATION_STATUS.IDLE;
        state.isVerified = false;
        state.lastVisitedPage = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        const { text, message } = action.payload;
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.pendingVerificationEmail = null;
        state.emailVerificationStatus = EMAIL_VERIFICATION_STATUS.IDLE;
        state.isVerified = false;
        state.lastVisitedPage = null;
        state.error = text || message;
        showErrorToast(text || message);
      });
  },
  initialState,
  name: 'auth',
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearPendingVerificationEmail: (state) => {
      state.pendingVerificationEmail = null;
    },
    setLastVisitedPage: (state, action) => {
      state.lastVisitedPage = action.payload;
    },
    setPendingVerificationEmail: (state, action) => {
      state.pendingVerificationEmail = action.payload;
    },
  },
});

export const {
  setLastVisitedPage,
  clearAuthError,
  setPendingVerificationEmail,
  clearPendingVerificationEmail,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
