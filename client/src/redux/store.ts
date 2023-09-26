import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './slices/modal.slice';
import cartReducer from './slices/cart.slice';
import customerReducer from './slices/customer.slice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    cart: cartReducer,
    customer: customerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
