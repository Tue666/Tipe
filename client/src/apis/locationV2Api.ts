import ApiClient from './ApiClient';
import { ICommon, ILocation } from '@/models/interfaces';

const locationV2Api = {
  // [GET] {{URL}}/api/locations-v2/:country
  find: (country: ICommon.Country): Promise<ILocation.FindResponse> => {
    const url = `/locations-v2/${country}`;
    return ApiClient.get(url);
  },
};

export default locationV2Api;
