import {
  AccountSchema,
  AdministratorSchema,
  CustomerSchema,
  AddressSchema,
  RegionSchema,
} from '../schema';
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

export interface Address
  extends Omit<AddressSchema, 'customer_id' | 'region_id' | 'district_id' | 'ward_id'> {
  region: RegionSchema;
  district: RegionSchema;
  ward: RegionSchema;
}

export interface InitCustomerResponse {
  profile: Omit<Account, 'password' | 'refreshToken'>;
  addresses: Address[];
}

export interface SwitchDefaultResponse {
  _id: Address['_id'];
}

export interface RemoveAddressResponse {
  _id: Address['_id'];
}
