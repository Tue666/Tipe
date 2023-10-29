import { MessageReponse } from '../common';
import {
  AccountSchema,
  AdministratorSchema,
  CustomerSchema,
  AddressSchema,
  LocationSchema,
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
  region: LocationSchema;
  district: LocationSchema;
  ward: LocationSchema;
}

export interface InitCustomerResponse {
  profile: Omit<Account, 'password' | 'refreshToken'>;
  addresses: Address[];
}

export interface InsertAddressBody
  extends Omit<AddressSchema, '_id' | 'customer_id' | 'country' | 'created_at' | 'updated_at'> {}

export interface InsertAddressResponse extends MessageReponse {
  address: Address;
}

export interface EditAddressBody
  extends Omit<AddressSchema, 'customer_id' | 'country' | 'created_at' | 'updated_at'> {}

export interface EditAddressResponse extends MessageReponse {
  address: Address;
}

export interface SwitchDefaultResponse extends MessageReponse {
  _id: Address['_id'];
}

export interface RemoveAddressResponse extends MessageReponse {
  _id: Address['_id'];
}
