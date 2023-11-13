import ApiClient from './ApiClient';
import { IFlashSale } from '@/models/interfaces';

const flashSaleApi = {
  // [GET] {{URL}}/api/flash-sale/sessions
  findForSessions: (): Promise<IFlashSale.FindForSessionsResponse> => {
    const url = `/flash-sale/sessions`;
    return ApiClient.get(url);
  },
};

export default flashSaleApi;
