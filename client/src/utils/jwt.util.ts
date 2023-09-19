import _ from 'lodash';
import Cookies from 'js-cookie';
import { ApiClient, accountApi } from '@/apis';
import { Tokens } from '@/models/interfaces/account';

const getToken = () => {
  const accessToken = Cookies.get('AC_T');
  return accessToken;
};

const setToken = (accessToken: Tokens['AC_T'] | null) => {
  if (!_.isNil(accessToken)) {
    Cookies.set('AC_T', accessToken, { expires: 2 });
    ApiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } else {
    Cookies.remove('AC_T');
    delete ApiClient.defaults.headers.common['Authorization'];
  }
};

const isValidToken = async (token: Tokens['AC_T'] | undefined) => {
  if (_.isNil(token)) return false;
  setToken(token);
  return await accountApi.verifyToken();
};

export { getToken, setToken, isValidToken };
