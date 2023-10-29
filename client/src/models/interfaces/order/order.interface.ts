import { PaginationQuery, Pagination, PartialBy } from '../common';
import { Product } from '../product';
import { OrderSchema, OrderStatus, SoftDeleteSchema, TimestampsSchema } from '../schema';

export interface Order extends OrderSchema {}

export interface FindQuery extends PaginationQuery {
  status?: OrderStatus;
  search?: string;
}

export interface FindResponse extends Pagination {
  orders: Order[];
}

export interface InsertBody
  extends PartialBy<
    Omit<Order, '_id' | 'customer_id' | keyof TimestampsSchema | keyof SoftDeleteSchema>,
    'tracking_info' | 'note'
  > {}

export interface InsertResponse {
  _id: Order['_id'];
  orderedItems: Product['_id'][];
}

export interface TrackingOrderBody {}
