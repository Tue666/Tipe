import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { ICart } from '@/models/interfaces';
import cartApi from '@/apis/cartApi';
import { productAvailable } from '@/utils';

export type StatisticsGroup = 'guess';

export type Statistics = {
  [K in StatisticsGroup]: {
    value: number;
    sign: 1 | -1;
  };
};

export interface CartState {
  items: ICart.CartItem[];
  statistics: Statistics;
}

export interface CalculateStatisticsProps {
  guess: {
    items: CartState['items'];
  };
}

const calculateStatistics = (calculateStatisticsProps: CalculateStatisticsProps) => {
  const statistics: Partial<Statistics> = {};
  for (const group in calculateStatisticsProps) {
    switch (group) {
      case 'guess':
        const { items } = calculateStatisticsProps[group];
        const selectedItems = items.filter((item) => {
          const { product } = item;
          return item.selected && productAvailable(product.inventory_status, product.quantity);
        });
        statistics[group] = {
          value: selectedItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
          sign: 1,
        };
        break;
      default:
        break;
    }
  }
  return statistics;
};

const initialState: CartState = {
  items: [],
  statistics: {} as CartState['statistics'],
};

export const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initCartSuccess(state: CartState, action: PayloadAction<Pick<CartState, 'items'>>) {
      const { items } = action.payload;
      state.items = items;
      state.statistics = {
        ...state.statistics,
        ...calculateStatistics({ guess: { items: state.items } }),
      };
    },
    addCartSuccess(state: CartState, action: PayloadAction<ICart.CartItem>) {
      const cartItem = action.payload;
      state.items = [...state.items, cartItem];
      state.statistics = {
        ...state.statistics,
        ...calculateStatistics({ guess: { items: state.items } }),
      };
    },
    editQuantitySuccess(state: CartState, action: PayloadAction<ICart.CartItem>) {
      const { _id, quantity } = action.payload;
      state.items = state.items.map((item) => (item._id === _id ? { ...item, quantity } : item));
      state.statistics = {
        ...state.statistics,
        ...calculateStatistics({ guess: { items: state.items } }),
      };
    },
    switchSelectSuccess(
      state: CartState,
      action: PayloadAction<ICart.SwitchSelectResponse['switched']>
    ) {
      const switched = action.payload;
      switch (typeof switched) {
        case 'boolean':
          // _id will be the value to check select all or not
          state.items = state.items.map((item) => ({ ...item, selected: switched }));
          state.statistics = {
            ...state.statistics,
            ...calculateStatistics({ guess: { items: state.items } }),
          };
          break;
        case 'string':
          // _id of the cart item to be changed
          state.items = state.items.map((item) =>
            item._id === switched ? { ...item, selected: !item.selected } : item
          );
          state.statistics = {
            ...state.statistics,
            ...calculateStatistics({ guess: { items: state.items } }),
          };
          break;
        default:
          break;
      }
    },
    removeCartSuccess(
      state: CartState,
      action: PayloadAction<ICart.RemoveCartResponse['removed']>
    ) {
      const removed = action.payload;
      // removed with null will remove all selected items
      if (!removed) {
        state.items = state.items.filter((item) => !item.selected);
        state.statistics = {
          ...state.statistics,
          ...calculateStatistics({ guess: { items: state.items } }),
        };
      } else {
        state.items = state.items.filter((item) => item._id !== removed);
        state.statistics = {
          ...state.statistics,
          ...calculateStatistics({ guess: { items: state.items } }),
        };
      }
    },
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

export const addCart = (params: ICart.AddCartBody) => async (dispatch: AppDispatch) => {
  try {
    const { state, cartItem } = await cartApi.addCart(params);
    if (state === 'INSERTED') dispatch(slice.actions.addCartSuccess(cartItem));
    if (state === 'UPDATED') dispatch(slice.actions.editQuantitySuccess(cartItem));
  } catch (error) {
    console.log(error);
  }
};

export const editQuantity = (params: ICart.EditQuantityBody) => async (dispatch: AppDispatch) => {
  try {
    const { cartItem } = await cartApi.editQuantity(params);
    dispatch(slice.actions.editQuantitySuccess(cartItem));
  } catch (error) {
    console.log(error);
  }
};

export const switchSelect = (params: ICart.SwitchSelectBody) => async (dispatch: AppDispatch) => {
  try {
    const { switched } = await cartApi.switchSelect(params);
    dispatch(slice.actions.switchSelectSuccess(switched));
  } catch (error) {
    console.log(error);
  }
};

export const removeCart = (params: ICart.RemoveCartBody) => async (dispatch: AppDispatch) => {
  try {
    const { removed } = await cartApi.removeCart(params);
    dispatch(slice.actions.removeCartSuccess(removed));
  } catch (error) {
    console.log(error);
  }
};
