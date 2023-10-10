import { Country } from '../common';
import { MetaSchema, SoftDeleteSchema, TimestampsSchema } from './common.interface';

export type Type = {
  [T in Lowercase<'customer' | 'administrator'>]: Uppercase<T>;
};

export interface AccountSchema extends TimestampsSchema, SoftDeleteSchema {
  _id: string;
  phone_number: string;
  is_phone_verified: boolean;
  password: string;
  email: string;
  is_email_verified: boolean;
  name: string;
  avatar_url: string;
  refreshToken: string;
  roles: string[];
  account_type: Type[keyof Type];
}

export interface Social {
  _id: boolean;
  id: string;
  type: string;
}

export interface CustomerSchema extends AccountSchema {
  gender: string;
  socials: Social[];
}

export interface AdministratorSchema extends AccountSchema {}

export type CategoryStatus = 'active' | 'in_active';

export interface CategorySchema extends MetaSchema, TimestampsSchema, SoftDeleteSchema {
  _id: number;
  name: string;
  image: string;
  banners: string[];
  parent_id: number;
  slug: string;
  status: CategoryStatus;
}

export interface QuantitySold {
  text: string;
  value: number;
}

export type InventoryStatus = 'available' | 'out_of_stock';

export interface ProductSchema extends MetaSchema, TimestampsSchema, SoftDeleteSchema {
  _id: string;
  name: string;
  images: string[];
  quantity: number;
  category: CategorySchema['_id'];
  limit: number;
  discount: number;
  discount_rate: number;
  original_price: number;
  price: number;
  description: string;
  quantity_sold: QuantitySold;
  rating_average: number;
  review_count: number;
  favorite_count: number;
  view_count: number;
  slug: string;
  shippable: boolean;
  preview: boolean;
  inventory_status: InventoryStatus;
}

export interface CartSchema {
  _id: string;
  customer_id: CustomerSchema['_id'];
  product_id: ProductSchema['_id'];
  quantity: number;
  selected: boolean;
}

// export interface RegionSchema {
//   _id: string;
//   name: string;
//   code: string;
// }

// export interface WardSchema extends RegionSchema {}

// export interface DistrictSchema extends RegionSchema {
//   wards: WardSchema[];
// }

// export interface LocationSchema extends RegionSchema {
//   country: Country;
//   districts: DistrictSchema[];
// }

export type Scope = 'REGION' | 'DISTRICT' | 'WARD' | 'UNSCOPED';

export interface LocationV2Schema {
  _id: string;
  name: string;
  code: string;
  parent_id: string | null;
  scope: Scope;
}

export type AddressType = 'home' | 'company';

export interface AddressSchema extends TimestampsSchema {
  _id: string;
  customer_id: CustomerSchema['_id'];
  name: string;
  company: string;
  phone_number: AccountSchema['phone_number'];
  region_id: LocationV2Schema['_id'];
  district_id: LocationV2Schema['_id'];
  ward_id: LocationV2Schema['_id'];
  street: string;
  delivery_address_type: AddressType;
  is_default: boolean;
  country: Country;
}

export type OrderStatus =
  | 'all'
  | 'awaiting_payment'
  | 'processing'
  | 'transporting'
  | 'delivered'
  | 'canceled';

export interface OrderSchema extends TimestampsSchema, SoftDeleteSchema {
  _id: string;
  customer_id: CustomerSchema['_id'];
  shipping_address: Omit<AddressSchema, 'customer_id' | 'is_default' | keyof TimestampsSchema>;
  payment_method: {
    method_text: string;
    method_key: string;
    message: string;
    description: string;
  };
  items: Pick<
    ProductSchema,
    | '_id'
    | 'name'
    | 'images'
    | 'original_price'
    | 'price'
    | 'limit'
    | 'quantity'
    | 'inventory_status'
    | 'slug'
  >[];
  price_summary: {
    name: string;
    value: number;
  }[];
  tracking_info: {
    status: OrderStatus;
    status_text: string;
    time: string;
  };
  note: string;
}
