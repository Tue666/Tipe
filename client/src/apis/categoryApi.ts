import ApiClient from './ApiClient';
import { ICategory } from '@/models/interfaces';
import { RouterUtil } from '@/utils';

const categoryApi = {
  // [GET] {{URL}}/api/categories/:_id
  findById: (_id: ICategory.Category['_id']): Promise<ICategory.NestedCategory> => {
    const url = `/categories/${_id}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/categories?{{query}}
  find: (findQuery: ICategory.FindQuery): Promise<ICategory.FindResponse> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findQuery, false);
    const url = `/categories?${buildQuery}`;
    return ApiClient.get(url);
  },
};

export default categoryApi;
