import ApiClient from './ApiClient';
import { IAccount } from '@/models/interfaces';

const locationApi = {
  // [GET] {{URL}}/api/locations/regions/:country
  findRegionsByCountry: (
    country: IAccount.Address['country']
  ): Promise<IAccount.Address['region'][]> => {
    const url = `/locations/regions/${country}`;
    return ApiClient.get(url);
  },
};

export default locationApi;
