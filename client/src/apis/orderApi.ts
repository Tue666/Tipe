import ApiClient from './ApiClient';
import { IOrder } from '@/models/interfaces';
import { RouterUtil } from '@/utils';

const orderApi = {
  // [GET] {{URL}}/api/orders?{{query}}
  findByStatus: (
    findByStatusQuery: IOrder.FindByStatusQuery
  ): Promise<IOrder.FindByStatusResponse> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findByStatusQuery);
    const url = `/orders?${buildQuery}`;
    return ApiClient.get(url);
  },
};

export default orderApi;
