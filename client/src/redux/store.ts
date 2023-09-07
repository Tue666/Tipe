import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './slices/modal.slice';
import cartReducer from './slices/cart.slice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
