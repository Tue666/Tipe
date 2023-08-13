import { SignInPayload, SignInResponse, SignUpPayload, Tokens } from '@/models/interfaces/account';
import axiosInstance from './axiosInstance';

const accountApi = {
  // [GET] /accounts/verify-token/:type
  verifyToken: (type: string): Promise<boolean> => {
    const url = `/accounts/verify-token/${type}`;
    return axiosInstance.get(url);
  },

  // [POST] /accounts/verify-exist
  verifyExist: (phone_number: string): Promise<boolean> => {
    const url = `/accounts/verify-exist`;
    return axiosInstance.post(url, {
      phone_number,
    });
  },

  // [GET] /accounts/refresh-token
  refreshToken: (): Promise<Tokens['AC_T']> => {
    const url = `/accounts/refresh-token`;
    return axiosInstance.get(url);
  },

  // [POST] /accounts/sign-in
  signIn: (body: SignInPayload): Promise<SignInResponse> => {
    const { phone_number, password } = body;

    const url = `/accounts/sign-in`;
    return axiosInstance.post(url, {
      phone_number,
      password,
    });
  },

  // [POST] /accounts/sign-up
  signUp: (body: SignUpPayload) => {
    const url = `/accounts/sign-up`;
    return axiosInstance.post(url, {
      ...body,
    });
  },
};

export default accountApi;
