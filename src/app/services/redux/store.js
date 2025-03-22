import { combineReducers, configureStore } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import { CookieStorage } from 'redux-persist-cookie-storage';

import { productSelectionReducer } from './features/product-selection/productSelectionSlice';

const cookieStorage = new CookieStorage(Cookies, {
  expiration: {
    default: 60 * 60, // 1hour
  },
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production', // Allow client-side access (set to true if you want server-side only)
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
  productSelection: persistedReducer,
});

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export const useAppDispatch = useDispatch.withTypes();
export const useAppSelector = useSelector.withTypes();
export const useAppStore = useStore.withTypes();
