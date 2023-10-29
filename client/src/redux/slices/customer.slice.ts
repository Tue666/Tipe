import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { IAccount } from '@/models/interfaces';
import { accountApi } from '@/apis';
import { enqueueNotify } from '@/hooks/useSnackbar';
import { AxiosError } from 'axios';

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
    insertAddressSuccess(
      state: CustomerState,
      action: PayloadAction<IAccount.InsertAddressResponse['address']>
    ) {
      const address = action.payload;
      const { is_default } = address;
      state.addresses = is_default
        ? [address, ...state.addresses.map((address) => ({ ...address, is_default: false }))]
        : [...state.addresses, address];
    },
    editAddressSuccess(
      state: CustomerState,
      action: PayloadAction<IAccount.EditAddressResponse['address']>
    ) {
      const address = action.payload;
      const { _id, ...rest } = address;
      const addressIndex = state.addresses.findIndex((address) => address._id === _id);
      if (addressIndex !== -1) {
        const addresses = rest.is_default
          ? [
              state.addresses[addressIndex],
              ...state.addresses.slice(0, addressIndex),
              ...state.addresses.slice(addressIndex + 1),
            ]
          : state.addresses;
        state.addresses = addresses.map((address) =>
          address._id === _id
            ? { ...address, ...rest }
            : { ...address, is_default: rest.is_default ? false : address.is_default }
        );
      }
    },
    switchDefaultSuccess(
      state: CustomerState,
      action: PayloadAction<IAccount.SwitchDefaultResponse['_id']>
    ) {
      const _id = action.payload;
      const addressSwitchedIndex = state.addresses.findIndex((address) => address._id === _id);
      if (addressSwitchedIndex !== -1) {
        const addresses = [
          state.addresses[addressSwitchedIndex],
          ...state.addresses.slice(0, addressSwitchedIndex),
          ...state.addresses.slice(addressSwitchedIndex + 1),
        ];
        state.addresses = addresses.map((address) => ({
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
    enqueueNotify((error as AxiosError)?.response?.statusText ?? 'Something went wrong', {
      variant: 'error',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
      preventDuplicate: true,
    });
  }
};

export const insertAddress =
  (params: IAccount.InsertAddressBody) => async (dispatch: AppDispatch) => {
    try {
      const { msg, address } = await accountApi.insertAddress(params);
      dispatch(slice.actions.insertAddressSuccess(address));
      enqueueNotify(msg, {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } catch (error) {
      enqueueNotify((error as AxiosError)?.response?.statusText ?? 'Something went wrong', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        preventDuplicate: true,
      });
    }
  };

export const editAddress = (params: IAccount.EditAddressBody) => async (dispatch: AppDispatch) => {
  try {
    const { msg, address } = await accountApi.editAddress(params);
    dispatch(slice.actions.editAddressSuccess(address));
    enqueueNotify(msg, {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  } catch (error) {
    enqueueNotify((error as AxiosError)?.response?.statusText ?? 'Something went wrong', {
      variant: 'error',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
      preventDuplicate: true,
    });
  }
};

export const switchDefault = (_id: IAccount.Address['_id']) => async (dispatch: AppDispatch) => {
  try {
    const { msg, _id: address } = await accountApi.switchDefault(_id);
    dispatch(slice.actions.switchDefaultSuccess(address));
    enqueueNotify(msg, {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  } catch (error) {
    enqueueNotify((error as AxiosError)?.response?.statusText ?? 'Something went wrong', {
      variant: 'error',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
      preventDuplicate: true,
    });
  }
};

export const removeAddress = (_id: IAccount.Address['_id']) => async (dispatch: AppDispatch) => {
  try {
    const { msg, _id: address } = await accountApi.removeAddress(_id);
    dispatch(slice.actions.removeAddressSuccess(address));
    enqueueNotify(msg, {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      },
    });
  } catch (error) {
    enqueueNotify((error as AxiosError)?.response?.statusText ?? 'Something went wrong', {
      variant: 'error',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
      preventDuplicate: true,
    });
  }
};
