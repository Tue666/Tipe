import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './slices/modal.slice';
import accountReducer from './slices/account.slice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
