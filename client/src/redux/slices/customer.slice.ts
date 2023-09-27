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
    switchDefaultSuccess(
      state: CustomerState,
      action: PayloadAction<IAccount.SwitchDefaultResponse['_id']>
    ) {
      const _id = action.payload;
      const addressSwitchedIndex = state.addresses.findIndex((address) => address._id === _id);
      if (addressSwitchedIndex !== -1) {
        const address = [
          state.addresses[addressSwitchedIndex],
          ...state.addresses.slice(0, addressSwitchedIndex),
          ...state.addresses.slice(addressSwitchedIndex + 1),
        ];
        state.addresses = address.map((address) => ({
          ...address,
          is_default: address._id === _id,
        }));
      }
    },
    removeAddressSuccess(
      state: CustomerState,
      action: PayloadAction<IAccount.RemoveAddressResponse['_id']>
    ) {
      const _id = action.payload;
      state.addresses = state.addresses.filter((address) => address._id !== _id);
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

export const switchDefault = (_id: IAccount.Address['_id']) => async (dispatch: AppDispatch) => {
  try {
    const { _id: address } = await accountApi.switchDefault(_id);
    dispatch(slice.actions.switchDefaultSuccess(address));
  } catch (error) {
    console.log(error);
  }
};

export const removeAddress = (_id: IAccount.Address['_id']) => async (dispatch: AppDispatch) => {
  try {
    const { _id: address } = await accountApi.removeAddress(_id);
    dispatch(slice.actions.removeAddressSuccess(address));
  } catch (error) {
    console.log(error);
  }
};
