import { IProduct } from '@/models/interfaces';
import axiosInstance from './axiosInstance';
import { RouterUtil } from '@/utils';
import { AxiosResponse } from 'axios';

const productApi = {
  // [GET] {{URL}}/api/products/widget?{{query}}
  staticFindForWidget: (
    group: IProduct.WidgetGroup,
    findForWidgetQuery: IProduct.FindForWidgetQuery
  ): Promise<AxiosResponse<IProduct.Product[]>> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findForWidgetQuery, false);
    const url = `/products/widget/${group}?${buildQuery}`;
    return axiosInstance.get(url);
  },

  // [GET] {{URL}}/api/products/suggestion?{{query}}
  findForSuggestion: (
    findForSuggestionQuery: IProduct.FindForSuggestionQuery
  ): Promise<IProduct.FindForSuggestionResponse> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findForSuggestionQuery, false);
    const url = `/products/suggestion?${buildQuery}`;
    return axiosInstance.get(url);
  },

  // [GET] {{URL}}/api/products/suggestion?{{query}}
  staticFindForSuggestion: (
    findForSuggestionQuery: IProduct.FindForSuggestionQuery
  ): Promise<AxiosResponse<IProduct.FindForSuggestionResponse>> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findForSuggestionQuery, false);
    const url = `/products/suggestion?${buildQuery}`;
    return axiosInstance.get(url);
  },

  // [GET] {{URL}}/api/products/:_id
  staticFindById: (_id: string): Promise<AxiosResponse<IProduct.Product>> => {
    const url = `/products/${_id}`;
    return axiosInstance.get(url);
  },
};

export default productApi;
