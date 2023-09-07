import { ProductSchema } from '../schema';
import { Pagination, PaginationQuery } from '../common';

export interface Product extends ProductSchema {}

export type WidgetGroup = 'top_selling' | 'maybe_you_like' | 'similar';

export interface FindForWidgetQuery extends PaginationQuery {
  _id?: Product['_id'];
}

export interface FindForSuggestionQuery extends PaginationQuery {}

export interface FindForSuggestionResponse extends Pagination {
  products: Product[];
}
