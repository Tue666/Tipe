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
  level: number;
  slug: string;
  status: CategoryStatus;
}

export interface Attribute {
  k: string;
  v: string;
}

export interface QuantitySold {
  text: string;
  value: number;
}

export interface Ratings {
  rating_average: number;
  rating_count: number;
  scores: number[];
}

export interface Reviews {
  review_count: number;
  comments: unknown[];
}

export type InventoryStatus = 'available' | 'out_of_stock' | 'hidden';

export interface ProductSchema extends MetaSchema, TimestampsSchema, SoftDeleteSchema {
  _id: string;
  name: string;
  images: string[];
  quantity: number;
  category: CategorySchema['_id'];
  attributes: Attribute[];
  specifications: Attribute[];
  warranties: Attribute[];
  limit: number;
  discount: number;
  discount_rate: number;
  original_price: number;
  price: number;
  description: string;
  quantity_sold: QuantitySold;
  ratings: Ratings;
  reviews: Reviews;
  favorite_count: number;
  view_count: number;
  slug: string;
  inventory_status: InventoryStatus;
}

export interface CartSchema {
  _id: string;
  customer_id: CustomerSchema['_id'];
  product_id: ProductSchema['_id'];
  quantity: number;
  selected: boolean;
}

export type Scope = 'REGION' | 'DISTRICT' | 'WARD' | 'UNSCOPED';

export interface LocationSchema {
  _id: string;
  name: string;
  parent_id: string | null;
  level: number;
  scope: Scope;
}

export type AddressType = 'home' | 'company';

export interface AddressSchema extends TimestampsSchema {
  _id: string;
  customer_id: CustomerSchema['_id'];
  name: string;
  company: string;
  phone_number: AccountSchema['phone_number'];
  region_id: LocationSchema['_id'];
  district_id: LocationSchema['_id'];
  ward_id: LocationSchema['_id'];
  street: string;
  delivery_address_type: AddressType;
  is_default: boolean;
}

export type OrderStatus =
  | 'all'
  | 'awaiting_payment'
  | 'processing'
  | 'transporting'
  | 'delivered'
  | 'canceled';

export type PaymentMethod = 'cash' | 'momo' | 'vnpay' | 'international';

export interface Payment {
  method_key: null | PaymentMethod;
  method_text: string;
  message?: string;
  description?: string;
}

export interface PriceSummary {
  name: string;
  value: number;
}

export interface OrderSchema extends TimestampsSchema, SoftDeleteSchema {
  _id: string;
  customer_id: CustomerSchema['_id'];
  shipping_address: Omit<
    AddressSchema,
    'customer_id' | 'region_id' | 'district_id' | 'ward_id' | 'is_default' | keyof TimestampsSchema
  > & {
    region: LocationSchema['name'];
    district: LocationSchema['name'];
    ward: LocationSchema['name'];
  };
  payment_method: Payment;
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
  price_summary: PriceSummary[];
  tracking_info: {
    status: OrderStatus;
    status_text: string;
    time: string;
  };
  note: string;
}
