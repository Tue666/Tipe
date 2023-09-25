import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../store';
import { ICart } from '@/models/interfaces';
import cartApi from '@/apis/cartApi';
import { productAvailable } from '@/utils';
import { FreeShippingPoint } from '@/models/interfaces/cart';

export type StatisticsGroup = 'guess' | 'free ship';

export type Statistics = {
  [K in StatisticsGroup]: {
    value: number;
    sign: 1 | -1;
  };
};

export interface CartState {
  items: ICart.CartItem[];
  statistics: Statistics;
  freeShippingPoints: ICart.FreeShippingPoint[];
}

export interface CalculateStatisticsProps {
  guess?: {
    items: CartState['items'];
  };
  freeShippingPoints?: FreeShippingPoint[];
}

const getFreeShippingPoint = (
  totalGuess: number,
  freeShippingPoints: FreeShippingPoint[]
): FreeShippingPoint => {
  for (let i = freeShippingPoints.length - 1; i >= 0; i--) {
    const freeShippingPoint = freeShippingPoints[i];
    if (totalGuess >= freeShippingPoint.value) return freeShippingPoint;
  }
  return {
    value: 0,
    minus: 0,
  };
};

const calculateStatistics = (calculateStatisticsProps: CalculateStatisticsProps) => {
  const statistics: Partial<Statistics> = {};
  const { freeShippingPoints, ...calculateGroups } = calculateStatisticsProps;
  for (const group in calculateGroups) {
    switch (group) {
      case 'guess':
        const { items } = calculateStatisticsProps[group]!;
        const selectedItems = items.filter((item) => {
          const { product } = item;
          return item.selected && productAvailable(product.inventory_status, product.quantity);
        });
        const totalGuess = selectedItems.reduce(
          (sum, item) => sum + item.quantity * item.product.price,
          0
        );
        statistics[group] = {
          value: totalGuess,
          sign: 1,
        };

        if (freeShippingPoints && freeShippingPoints.length) {
          const freeShippingPoint = getFreeShippingPoint(totalGuess, freeShippingPoints);
          statistics['free ship'] = {
            value: freeShippingPoint.minus,
            sign: -1,
          };
        }
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
  freeShippingPoints: [
    {
      value: 100000,
      minus: 20000,
    },
    {
      value: 162000,
      minus: 30000,
    },
    {
      value: 300000,
      minus: 50000,
    },
  ],
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
        ...calculateStatistics({
          guess: { items: state.items },
          freeShippingPoints: state.freeShippingPoints,
        }),
      };
    },
    addCartSuccess(state: CartState, action: PayloadAction<ICart.CartItem>) {
      const cartItem = action.payload;
      state.items = [...state.items, cartItem];
      state.statistics = {
        ...state.statistics,
        ...calculateStatistics({
          guess: { items: state.items },
          freeShippingPoints: state.freeShippingPoints,
        }),
      };
    },
    editQuantitySuccess(state: CartState, action: PayloadAction<ICart.CartItem>) {
      const { _id, quantity } = action.payload;
      state.items = state.items.map((item) => (item._id === _id ? { ...item, quantity } : item));
      state.statistics = {
        ...state.statistics,
        ...calculateStatistics({
          guess: { items: state.items },
          freeShippingPoints: state.freeShippingPoints,
        }),
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
            ...calculateStatistics({
              guess: { items: state.items },
              freeShippingPoints: state.freeShippingPoints,
            }),
          };
          break;
        case 'string':
          // _id of the cart item to be changed
          state.items = state.items.map((item) =>
            item._id === switched ? { ...item, selected: !item.selected } : item
          );
          state.statistics = {
            ...state.statistics,
            ...calculateStatistics({
              guess: { items: state.items },
              freeShippingPoints: state.freeShippingPoints,
            }),
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
          ...calculateStatistics({
            guess: { items: state.items },
            freeShippingPoints: state.freeShippingPoints,
          }),
        };
      } else {
        state.items = state.items.filter((item) => item._id !== removed);
        state.statistics = {
          ...state.statistics,
          ...calculateStatistics({
            guess: { items: state.items },
            freeShippingPoints: state.freeShippingPoints,
          }),
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
