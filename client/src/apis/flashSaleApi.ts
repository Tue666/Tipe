import ApiClient from './ApiClient';
import { IFlashSale } from '@/models/interfaces';

const flashSaleApi = {
  // [PATCH] {{URL}}/api/flash-sale/next-flash-sale
  nextFlashSale: (): Promise<IFlashSale.NextFlashSaleResponse> => {
    const url = `/flash-sale/next-flash-sale`;
    return ApiClient.patch(url);
  },

  // [GET] {{URL}}/api/flash-sale/sessions
  findForSessions: (): Promise<IFlashSale.FindForSessionsResponse> => {
    const url = `/flash-sale/sessions`;
    return ApiClient.get(url);
  },
};

export default flashSaleApi;
