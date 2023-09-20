import ApiClient from './ApiClient';
import { ICart } from '@/models/interfaces';

const cartApi = {
  // [GET] {{URL}}/api/cart
  findByCustomerId: (): Promise<ICart.CartItem[]> => {
    const url = `/cart`;
    return ApiClient.get(url);
  },

  // [POST] {{URL}}/api/cart
  insert: (insertBody: ICart.InsertBody): Promise<ICart.InsertResponse> => {
    const url = `/cart`;
    return ApiClient.post(url, insertBody);
  },
};

export default cartApi;
