import { CartSchema } from '../schema';
import { Product } from '../product';

export interface CartItem extends Pick<CartSchema, '_id' | 'quantity' | 'selected'> {
  product: Product;
}
