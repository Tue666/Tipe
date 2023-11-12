import ApiClient from './ApiClient';
import { IFlashSale } from '@/models/interfaces';

const flashSaleApi = {
  // [GET] {{URL}}/api/flash-sale
  find: (): Promise<IFlashSale.FindResponse> => {
    const url = `/flash-sale`;
    return ApiClient.get(url);
  },
};

export default flashSaleApi;
