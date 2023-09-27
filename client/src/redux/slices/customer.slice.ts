import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { IAccount } from '@/models/interfaces';
import { accountApi } from '@/apis';

export interface CustomerState {
  profile: IAccount.InitCustomerResponse['profile'];
  addresses: IAccount.InitCustomerResponse['addresses'];
}

const initialState: CustomerState = {
  profile: {} as CustomerState['profile'],
  addresses: [],
};

export const slice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    initCustomerSuccess(state: CustomerState, action: PayloadAction<CustomerState>) {
      const { profile, addresses } = action.payload;
      state.profile = profile;
      state.addresses = addresses;
    },
    clearCustomer(state: CustomerState) {
      state.profile = {} as CustomerState['profile'];
      state.addresses = [];
    },
  },
});

const { reducer, actions } = slice;
export const { clearCustomer } = actions;
export const selectCustomer = (state: RootState) => state.customer;
export default reducer;

export const initCustomer = () => async (dispatch: AppDispatch) => {
  try {
    const { profile, addresses } = await accountApi.getProfile();
    dispatch(
      slice.actions.initCustomerSuccess({
        profile,
        addresses,
      })
    );
  } catch (error) {
    console.log(error);
  }
};
