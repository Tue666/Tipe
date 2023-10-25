import qs from 'query-string';
import ApiClient from './ApiClient';
import { IOrder } from '@/models/interfaces';

const orderApi = {
  // [GET] {{URL}}/api/orders/:_id
  findById: (_id: IOrder.Order['_id']): Promise<IOrder.Order> => {
    const url = `/orders/${_id}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/orders?{{query}}
  findByStatus: (
    findByStatusQuery: IOrder.FindByStatusQuery
  ): Promise<IOrder.FindByStatusResponse> => {
    const query = qs.stringify(findByStatusQuery, { arrayFormat: 'comma' });
    const url = `/orders?${query}`;
    return ApiClient.get(url);
  },

  // [POST] {{URL}}/api/orders
  insert: (insertBody: IOrder.InsertBody): Promise<IOrder.InsertResponse> => {
    const url = `/orders`;
    return ApiClient.post(url, insertBody);
  },
};

export default orderApi;
