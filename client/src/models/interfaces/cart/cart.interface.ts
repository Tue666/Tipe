import { CartSchema, FlashSale } from '../schema';
import { Product } from '../product';
import { MessageResponse } from '../common';

export interface FreeShippingPoint {
  value: number;
  minus: number;
}

export interface CartItem extends Pick<CartSchema, '_id' | 'quantity' | 'selected'> {
  product: Omit<Product, 'flash_sale'> & { flash_sale: FlashSale };
}

export interface AddCartBody {
  product_id: string;
  quantity: number;
}

export interface AddCartResponse extends MessageResponse {
  state: 'INSERTED' | 'UPDATED';
  cartItem: CartItem;
}

export interface EditQuantityBody {
  _id: CartItem['_id'];
  product_id: CartItem['product']['_id'];
  new_quantity: CartItem['product']['quantity'];
}

export interface EditQuantityResponse {
  cartItem: CartItem;
}

export interface SwitchSelectBody {
  _id: CartItem['_id'] | boolean;
}

export interface SwitchSelectResponse {
  switched: SwitchSelectBody['_id'];
}

export interface RemoveCartBody {
  _id?: CartItem['_id'];
}

export interface RemoveCartResponse {
  removed: RemoveCartBody['_id'];
}
