import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { ICart } from '@/models/interfaces';

export interface CartState {
  items: ICart.CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initCartSuccess(state: CartState, action: PayloadAction<CartState>) {
      const { items } = action.payload;
      state.items = items;
    },
  },
});

const { reducer, actions } = slice;
export const {} = actions;
export const selectCart = (state: RootState) => state.cart;
export default reducer;

export const initCart = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(slice.actions.initCartSuccess({ items: [] }));
  } catch (error) {
    console.log(error);
  }
};
