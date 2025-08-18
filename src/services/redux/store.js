import { combineReducers, configureStore } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { CookieStorage } from 'redux-persist-cookie-storage';

import { EMAIL_VERIFICATION_EXPIRY } from '@/constants/constants';

import { authReducer } from './features/auth/authSlice';
import { cartReducer } from './features/cart/cartSlice';
import { cartDrawerReducer } from './features/cart-drawer/cartDrawerSlice';
import { cartExpirationMiddleware } from './middleware/cartMiddleware';

const sessionCookieStorage = new CookieStorage(Cookies, {
  expiration: {
    default: EMAIL_VERIFICATION_EXPIRY,
  },
  sameSite: 'Strict',
  secure: process.env.NODE_ENV === 'production',
});

const authPersistConfig = {
  key: 'auth',
  storage: sessionCookieStorage,
  whitelist: [
    'pendingVerificationEmail',
    'user',
    'verificationStatus',
    'lastVisitedPage',
  ],
};

const cartPersistConfig = {
  blacklist: ['loading', 'loadingStates', 'error', 'itemLoadingStates'],
  key: 'cart',
  storage,
  whitelist: ['cart'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  cartDrawer: cartDrawerReducer,
});

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      cartExpirationMiddleware
    ),
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export const useAppStore = useStore;
