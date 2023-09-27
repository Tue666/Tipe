import ApiClient from './ApiClient';
import { IProduct } from '@/models/interfaces';
import { RouterUtil } from '@/utils';

const productApi = {
  // [GET] {{URL}}/api/products/widget?{{query}}
  findForWidget: (
    group: IProduct.WidgetGroup,
    findForWidgetQuery: IProduct.FindForWidgetQuery
  ): Promise<IProduct.FindForWidgetResponse> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findForWidgetQuery, false);
    const url = `/products/widget/${group}?${buildQuery}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/products/suggestion?{{query}}
  findForSuggestion: (
    findForSuggestionQuery: IProduct.FindForSuggestionQuery
  ): Promise<IProduct.FindForSuggestionResponse> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findForSuggestionQuery, false);
    const url = `/products/suggestion?${buildQuery}`;
    return ApiClient.get(url);
  },

  // [GET] {{URL}}/api/products/:_id
  findById: (_id: IProduct.Product['_id']): Promise<IProduct.NestedProduct> => {
    const url = `/products/${_id}`;
    return ApiClient.get(url);
  },
};

export default productApi;
