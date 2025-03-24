import { combineReducers, configureStore } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import { CookieStorage } from 'redux-persist-cookie-storage';

import { cartDrawerReducer } from './features/cart-drawer/cartDrawerSlice';
import { productSelectionReducer } from './features/product-selection/productSelectionSlice';

const cookieStorage = new CookieStorage(Cookies, {
  expiration: {
    default: 60 * 60, // 1 hour
  },
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
});

const productSelectionPersistConfig = {
  key: 'productSelection',
  storage: cookieStorage,
};

const persistedReducer = persistReducer(
  productSelectionPersistConfig,
  productSelectionReducer
);

const rootReducer = combineReducers({
  cartDrawer: cartDrawerReducer,
  productSelection: persistedReducer,
});

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export const useAppStore = useStore;
