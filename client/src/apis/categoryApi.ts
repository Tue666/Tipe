import qs from 'query-string';
import ApiClient from './ApiClient';
import { ICategory } from '@/models/interfaces';

const categoryApi = {
  // [GET] {{URL}}/api/categories/:_id
  findById: (_id: ICategory.Category['_id']): Promise<ICategory.NestedCategory> => {
    const url = `/categories/${_id}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/categories?{{query}}
  find: (findQuery: ICategory.FindQuery): Promise<ICategory.FindResponse> => {
    const query = qs.stringify(findQuery, { arrayFormat: 'comma' });
    const url = `/categories?${query}`;
    return ApiClient.get(url);
  },
};

export default categoryApi;
