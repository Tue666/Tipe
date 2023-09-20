import { CartSchema } from '../schema';
import { Product } from '../product';

export interface CartItem extends Pick<CartSchema, '_id' | 'quantity' | 'selected'> {
  product: Product;
}

export interface InsertBody {
  product_id: string;
  quantity: number;
}

export interface InsertResponse {
  state: 'INSERTED' | 'UPDATED';
  cartItem: CartItem;
}
