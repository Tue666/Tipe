import ApiClient from './ApiClient';
import { ICart } from '@/models/interfaces';

const cartApi = {
  // [GET] {{URL}}/api/cart
  findByCustomerId: (): Promise<ICart.CartItem[]> => {
    const url = `/cart`;
    return ApiClient.get(url);
  },
};

export default cartApi;
