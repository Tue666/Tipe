import ApiClient from './ApiClient';
import { ILocation } from '@/models/interfaces';
import { RouterUtil } from '@/utils';

const locationApi = {
  // [GET] {{URL}}/api/locations?{{query}}
  find: (findQuery: ILocation.FindQuery): Promise<ILocation.FindResponse> => {
    const buildQuery = RouterUtil.buildUrlQueryParams(findQuery, false);
    const url = `/locations?${buildQuery}`;
    return ApiClient.get(url);
  },
};

export default locationApi;
