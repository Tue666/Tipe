import { Tokens } from './auth.interface';

export type Type = {
  [T in Lowercase<'customer' | 'administrator'>]: Uppercase<T>;
};

export interface SocialProps {
  id?: string;
  type?: string;
}

export interface Account {
  phone_number: string;
  is_phone_verified?: boolean;
  password: string;
  email?: string;
  is_email_verified?: boolean;
  name?: string;
  avatar_url?: string;
  refreshToken?: string;
  roles?: string[];
  account_type: Type[keyof Type];
}

export interface Customer extends Account {
  gender?: string;
  social: SocialProps[];
}

export interface Administrator extends Account {}

export interface SignInPayload extends Pick<Account, 'phone_number' | 'password'> {}

export interface SignInResponse {
  name: string;
  accessToken: Tokens['AC_T'];
}

export interface SignUpPayload extends Account {
  passwordConfirm: string;
  account_type: Type[keyof Type];
}
