import { combineReducers, configureStore } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import { CookieStorage } from 'redux-persist-cookie-storage';

import { cartReducer } from './features/cart/cartSlice';
import { cartDrawerReducer } from './features/cart-drawer/cartDrawerSlice';

const cartExpiry = 60 * 60 * 24 * 7; // 7 days

const cartCookieStorage = new CookieStorage(Cookies, {
  expiration: {
    default: cartExpiry,
  },
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
});

const cartPersistConfig = {
  blacklist: ['loading', 'loadingStates', 'error', 'itemLoadingStates'],
  key: 'cart',
  storage: cartCookieStorage,
};

const rootReducer = combineReducers({
  cart: persistReducer(cartPersistConfig, cartReducer),
  cartDrawer: cartDrawerReducer,
});

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export const useAppStore = useStore;
