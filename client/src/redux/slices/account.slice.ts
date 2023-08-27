import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AccountState {
  isInitialized: boolean;
  isAuthenticated: boolean;
}

const initialState: AccountState = {
  isInitialized: false,
  isAuthenticated: false,
};

export const slice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
});

const { reducer, actions } = slice;
export const {} = actions;
export const selectAccount = (state: RootState) => state.account;
export default reducer;
