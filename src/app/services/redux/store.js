import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import { productSelectionReducer } from './features/product-selection/productSelectionSlice';

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  removeItem() {
    return Promise.resolve();
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
});

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const productSelectionPersistConfig = {
  key: 'productSelection',
  storage,
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
