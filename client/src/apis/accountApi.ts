import ApiClient from './ApiClient';
import { IAccount } from '@/models/interfaces';

const accountApi = {
  // [GET] {{URL}}/api/accounts/verify-token
  verifyToken: (): Promise<boolean> => {
    const url = `/accounts/verify-token`;
    return ApiClient.get(url);
  },

  // [POST] {{URL}}/api/accounts/verify-exist
  verifyExist: (phone_number: string): Promise<boolean> => {
    const url = `/accounts/verify-exist`;
    return ApiClient.post(url, {
      phone_number,
    });
  },

  // [GET] {{URL}}/api/accounts/refresh-token
  refreshToken: (): Promise<IAccount.Tokens['AC_T']> => {
    const url = `/accounts/refresh-token`;
    return ApiClient.get(url);
  },

  // [POST] {{URL}}/api/accounts/sign-in
  signIn: (signInBody: IAccount.SignInBody): Promise<IAccount.SignInResponse> => {
    const url = `/accounts/sign-in`;
    return ApiClient.post(url, signInBody);
  },

  // [POST] {{URL}}/api/accounts/sign-up
  signUp: (signUpBody: IAccount.SignUpBody): Promise<void> => {
    const url = `/accounts/sign-up`;
    return ApiClient.post(url, signUpBody);
  },

  // [GET] {{URL}}/api/accounts/profile
  getProfile: (): Promise<IAccount.InitCustomerResponse> => {
    const url = `/accounts/profile`;
    return ApiClient.get(url);
  },
};

export default accountApi;
