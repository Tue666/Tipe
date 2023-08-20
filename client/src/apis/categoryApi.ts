import { ICategory } from '@/models/interfaces';
import axiosInstance from './axiosInstance';
import { RouterUtil } from '@/utils';
import { AxiosResponse } from 'axios';

const categoryApi = {
  // [GET] {{URL}}/api/categories/{{query}}
  find: (findQuery: ICategory.FindQuery = {}): Promise<ICategory.Category[]> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findQuery, false);
    const url = `/categories?${buildQuery}`;
    return axiosInstance.get(url);
  },

  // [GET] {{URL}}/api/categories/{{query}}
  staticFind: (
    findQuery: ICategory.FindQuery = {}
  ): Promise<AxiosResponse<ICategory.Category[]>> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findQuery, false);
    const url = `/categories?${buildQuery}`;
    return axiosInstance.get(url);
  },
};

export default categoryApi;
