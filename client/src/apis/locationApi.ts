import qs from 'query-string';
import ApiClient from './ApiClient';
import { ILocation } from '@/models/interfaces';

const locationApi = {
  // [GET] {{URL}}/api/locations?{{query}}
  find: (findQuery: ILocation.FindQuery): Promise<ILocation.FindResponse> => {
    const query = qs.stringify(findQuery, { arrayFormat: 'comma' });
    const url = `/locations?${query}`;
    return ApiClient.get(url);
  },
};

export default locationApi;
