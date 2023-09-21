import { IProduct } from '@/models/interfaces';

export const productAvailable = (
  status: IProduct.Product['inventory_status'],
  quantity: IProduct.Product['quantity']
) => {
  return status === 'available' && quantity > 0;
};
