import { PartialBy } from '../common';
import { AccountSchema, AdministratorSchema, CustomerSchema } from '../schema';
import { Tokens } from './auth.interface';

export interface Account extends AccountSchema {}

export interface Customer extends CustomerSchema {}

export interface Administrator extends AdministratorSchema {}

export interface SignInBody extends Pick<Account, 'phone_number' | 'password'> {}

export interface SignInResponse {
  name: string;
  accessToken: Tokens['AC_T'];
}

export interface SignUpBody
  extends Pick<Account, 'phone_number' | 'name' | 'password' | 'account_type'> {
  passwordConfirm: string;
}
