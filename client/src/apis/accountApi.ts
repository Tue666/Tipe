import axiosInstance from './axiosInstance';
import { IAccount } from '@/models/interfaces';

const accountApi = {
  // [GET] {{URL}}/api/accounts/verify-token
  verifyToken: (): Promise<boolean> => {
    const url = `/accounts/verify-token`;
    return axiosInstance.get(url);
  },

  // [POST] {{URL}}/api/accounts/verify-exist
  verifyExist: (phone_number: string): Promise<boolean> => {
    const url = `/accounts/verify-exist`;
    return axiosInstance.post(url, {
      phone_number,
    });
  },

  // [GET] {{URL}}/api/accounts/refresh-token
  refreshToken: (): Promise<IAccount.Tokens['AC_T']> => {
    const url = `/accounts/refresh-token`;
    return axiosInstance.get(url);
  },

  // [POST] {{URL}}/api/accounts/sign-in
  signIn: (signInBody: IAccount.SignInBody): Promise<IAccount.SignInResponse> => {
    const { phone_number, password } = signInBody;
    const url = `/accounts/sign-in`;
    return axiosInstance.post(url, {
      phone_number,
      password,
    });
  },

  // [POST] {{URL}}/api/accounts/sign-up
  signUp: (signUpBody: IAccount.SignUpBody): Promise<void> => {
    const { phone_number, password, passwordConfirm, account_type, ...rest } = signUpBody;
    const url = `/accounts/sign-up`;
    return axiosInstance.post(url, {
      phone_number,
      password,
      passwordConfirm,
      account_type,
      ...rest,
    });
  },
};

export default accountApi;
