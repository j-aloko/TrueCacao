import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

import { EMAIL_VERIFICATION_STATUS, USER_ROLE } from '@/constants/constants';
import { ROUTES } from '@/constants/routes';
import { sendVerificationEmail } from '@/lib/auth/email-service';
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
        showErrorToast(error.message || 'Login failed');
        return rejectWithValue(error.message || 'Login failed');
      }

      const { user } = await loginResponse.json();

      const sessionId = Cookies.get('sessionId');
      await dispatch(mergeCarts({ sessionId, userId: user?.id }));

      return { router, user };
    } catch (error) {
      return rejectWithValue(error.message || 'Unexpected error during login');
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
        showErrorToast(error.message || 'Failed to create user');
        return rejectWithValue(error.message || 'Failed to create user');
      }

      const { user, message } = await response.json();

      // Create verification link
      const verificationLink = `${window.location.origin}${ROUTES.verifyEmail}?token=${user.verificationToken}&email=${encodeURIComponent(user.email)}`;
      await sendVerificationEmail(user.email, verificationLink);
      showSuccessToast(message);
      return { router, user };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resendEmailVerification = createAsyncThunk(
  'auth/resendEmailverification',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/auth/resend-verification', {
        body: JSON.stringify({ email }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();
        showErrorToast(error.message || 'Failed to resend verification');
        return rejectWithValue(
          error.message || 'Failed to resend verification'
        );
      }
      const { message, user } = await response.json();
      // Create verification link
      const verificationLink = `${window.location.origin}${ROUTES.verifyEmail}?token=${user.verificationToken}&email=${encodeURIComponent(user.email)}`;
      await sendVerificationEmail(user.email, verificationLink);
      showSuccessToast(message);
      return message;
    } catch (error) {
      return rejectWithValue(error.message);
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
        showErrorToast(error.message || 'Failed to verify email');
        return rejectWithValue(error.message || 'Failed to verify email');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        body: JSON.stringify({ email }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        body: JSON.stringify({ newPassword, token }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/auth/change-password', {
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
        return rejectWithValue(error.message || 'Logout failed');
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.message || 'Logout failed');
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
        return rejectWithValue(error.message || 'Refresh token expired');
      }
      return true;
    } catch (error) {
      dispatch(logoutUser());
      return rejectWithValue(error.message || 'Session expired');
    }
  }
);

const initialState = {
  error: null,
  isAuthenticated: false,
  isLoading: false,
  lastVisitedPage: null,
  pendingVerificationEmail: null,
  user: null,
  verificationStatus: EMAIL_VERIFICATION_STATUS.IDLE,
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
        state.verificationStatus = user.verified
          ? EMAIL_VERIFICATION_STATUS.VERIFIED
          : EMAIL_VERIFICATION_STATUS.IDLE;
        state.error = null;
        router.push(ROUTES.home);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
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
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      })

      .addCase(resendEmailVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendEmailVerification.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendEmailVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || 'Failed to resend verification link';
      })

      // Email Verification
      .addCase(verifyEmail.pending, (state) => {
        state.verificationStatus = EMAIL_VERIFICATION_STATUS.PENDING;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.verificationStatus = EMAIL_VERIFICATION_STATUS.VERIFIED;
        state.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verificationStatus = EMAIL_VERIFICATION_STATUS.FAILED;
        state.error = action.payload?.message || 'Email verification failed';
      })

      // Password Reset
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Password reset failed';
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Password reset failed';
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Password change failed';
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
        state.verificationStatus = EMAIL_VERIFICATION_STATUS.IDLE;
        state.lastVisitedPage = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.pendingVerificationEmail = null;
        state.verificationStatus = EMAIL_VERIFICATION_STATUS.IDLE;
        state.lastVisitedPage = null;
        state.error = action.payload || 'Logout failed';
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
