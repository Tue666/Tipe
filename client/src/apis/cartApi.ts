import ApiClient from './ApiClient';
import { ICart } from '@/models/interfaces';

const cartApi = {
  // [GET] {{URL}}/api/cart
  findByCustomerId: (): Promise<ICart.CartItem[]> => {
    const url = `/cart`;
    return ApiClient.get(url);
  },

  // [POST] {{URL}}/api/cart
  addCart: (addCartBody: ICart.AddCartBody): Promise<ICart.AddCartResponse> => {
    const url = `/cart`;
    return ApiClient.post(url, addCartBody);
  },

  // [PATCH] {{URL}}/api/cart/edit-quantity
  editQuantity: (editQuantityBody: ICart.EditQuantityBody): Promise<ICart.EditQuantityResponse> => {
    const url = `/cart/edit-quantity`;
    return ApiClient.patch(url, editQuantityBody);
  },

  // [PATCH] {{URL}}/api/cart/switch-select
  switchSelect: (switchSelectBody: ICart.SwitchSelectBody): Promise<ICart.SwitchSelectResponse> => {
    const url = `/cart/switch-select`;
    return ApiClient.patch(url, switchSelectBody);
  },

  // [PUT] {{URL}}/api/cart/remove-cart
  removeCart: (removeCartBody: ICart.RemoveCartBody): Promise<ICart.RemoveCartResponse> => {
    const url = `/cart/remove-cart`;
    return ApiClient.put(url, removeCartBody);
  },
};

export default cartApi;
