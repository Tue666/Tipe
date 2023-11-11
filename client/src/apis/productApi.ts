import qs from 'query-string';
import ApiClient from './ApiClient';
import { IProduct } from '@/models/interfaces';

const productApi = {
  // [GET] {{URL}}/api/products/widget?{{query}}
  findForWidget: (
    findForWidgetQuery: IProduct.FindForWidgetQuery
  ): Promise<IProduct.FindForWidgetResponse> => {
    const query = qs.stringify(findForWidgetQuery, { arrayFormat: 'comma' });
    const url = `/products/widget?${query}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/products/flash-sale?{{query}}
  findForFlashSale: (
    findForFlashSaleQuery: IProduct.FindForFlashSaleQuery
  ): Promise<IProduct.FindForFlashSaleResponse> => {
    const query = qs.stringify(findForFlashSaleQuery, { arrayFormat: 'comma' });
    const url = `/products/flash-sale?${query}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/products/suggestion?{{query}}
  findForSuggestion: (
    findForSuggestionQuery: IProduct.FindForSuggestionQuery
  ): Promise<IProduct.FindForSuggestionResponse> => {
    const query = qs.stringify(findForSuggestionQuery, { arrayFormat: 'comma' });
    const url = `/products/suggestion?${query}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/products/recommend?{{query}}
  findForRecommend: (
    findForRecommendQuery: IProduct.FindForRecommendQuery
  ): Promise<IProduct.FindForRecommendResponse> => {
    const query = qs.stringify(findForRecommendQuery, { arrayFormat: 'comma' });
    const url = `/products/recommend?${query}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/products/search?{{query}}
  findForSearchKeyword: (
    findForSearchKeywordQuery: IProduct.FindForSearchKeywordQuery
  ): Promise<IProduct.FindForSearchKeywordResponse> => {
    const query = qs.stringify(findForSearchKeywordQuery, { arrayFormat: 'comma' });
    const url = `/products/search?${query}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/products/:_id
  findById: (_id: IProduct.Product['_id']): Promise<IProduct.NestedProduct> => {
    const url = `/products/${_id}`;
    return ApiClient.get(url);
  },
};

export default productApi;
