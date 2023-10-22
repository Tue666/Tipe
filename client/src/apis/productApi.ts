import ApiClient from './ApiClient';
import { IProduct } from '@/models/interfaces';
import { RouterUtil } from '@/utils';

const productApi = {
  // [GET] {{URL}}/api/products/widget?{{query}}
  findForWidget: (
    findForWidgetQuery: IProduct.FindForWidgetQuery
  ): Promise<IProduct.FindForWidgetResponse> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findForWidgetQuery);
    const url = `/products/widget?${buildQuery}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/products/suggestion?{{query}}
  findForSuggestion: (
    findForSuggestionQuery: IProduct.FindForSuggestionQuery
  ): Promise<IProduct.FindForSuggestionResponse> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findForSuggestionQuery);
    const url = `/products/suggestion?${buildQuery}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/products/recommend?{{query}}
  findForRecommend: (
    findForRecommendQuery: IProduct.FindForRecommendQuery
  ): Promise<IProduct.FindForRecommendResponse> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findForRecommendQuery);
    const url = `/products/recommend?${buildQuery}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/products/:_id
  findById: (_id: IProduct.Product['_id']): Promise<IProduct.NestedProduct> => {
    const url = `/products/${_id}`;
    return ApiClient.get(url);
  },
};

export default productApi;
