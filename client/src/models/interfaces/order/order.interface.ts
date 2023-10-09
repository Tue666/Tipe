import { PaginationQuery, Pagination } from '../common';
import { OrderSchema } from '../schema';

export interface Order extends OrderSchema {}

export interface FindByStatusQuery extends PaginationQuery {
  status?: string;
  search?: string;
}

export interface FindByStatusResponse extends Pagination {
  orders: Order[];
}
