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
