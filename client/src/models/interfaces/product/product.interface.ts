import { Pagination, PaginationQuery } from '../common';

export interface QuantitySold {
  text: string;
  value: number;
}

export type InventoryStatus = 'available' | 'out_of_stock';

export interface Product {
  _id: string;
  name: string;
  images: string[];
  quantity: number;
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
  inventory_status: InventoryStatus;
  slug: string;
}

export type WidgetGroup = 'top_selling' | 'maybe_you_like' | 'similar';

export interface FindForWidgetQuery extends PaginationQuery {
  _id?: Product['_id'];
}

export interface FindForSuggestionQuery extends PaginationQuery {}

export interface FindForSuggestionResponse extends Pagination {
  products: Product[];
}
