import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { ICart } from '@/models/interfaces';
import cartApi from '@/apis/cartApi';

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
    addCartSuccess(state: CartState, action: PayloadAction<ICart.CartItem>) {
      const cartItem = action.payload;
      state.items = [...state.items, cartItem];
    },
    editQuantitySuccess(state: CartState, action: PayloadAction<ICart.CartItem>) {
      const { _id, quantity } = action.payload;
      state.items = state.items.map((item) => (item._id === _id ? { ...item, quantity } : item));
    },
    switchSelectSuccess(state: CartState) {},
  },
});

const { reducer, actions } = slice;
export const {} = actions;
export const selectCart = (state: RootState) => state.cart;
export default reducer;

export const initCart = () => async (dispatch: AppDispatch) => {
  try {
    const cartItems = await cartApi.findByCustomerId();
    dispatch(slice.actions.initCartSuccess({ items: cartItems }));
  } catch (error) {
    console.log(error);
  }
};

export const addCart = (params: ICart.InsertBody) => async (dispatch: AppDispatch) => {
  try {
    const { state, cartItem } = await cartApi.insert(params);
    if (state === 'INSERTED') dispatch(slice.actions.addCartSuccess(cartItem));
    if (state === 'UPDATED') dispatch(slice.actions.editQuantitySuccess(cartItem));
  } catch (error) {
    console.log(error);
  }
};

export const switchSelect = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(slice.actions.switchSelectSuccess());
  } catch (error) {
    console.log(error);
  }
};
