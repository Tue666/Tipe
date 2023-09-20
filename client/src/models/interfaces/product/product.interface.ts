import { ProductSchema } from '../schema';
import { Pagination, PaginationQuery } from '../common';

export interface Product extends ProductSchema {}

export interface Breadcrumb {
  _id: number;
  name: string;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
  slug: string;
}

export interface NestedProduct extends Product {
  breadcrumbs: Breadcrumb[];
}

export interface ProductCard
  extends Pick<
    Product,
    | '_id'
    | 'name'
    | 'images'
    | 'discount'
    | 'discount_rate'
    | 'original_price'
    | 'price'
    | 'quantity_sold'
    | 'rating_average'
    | 'slug'
  > {}

export type WidgetGroup = 'top_selling' | 'maybe_you_like' | 'similar';

export interface FindForWidgetQuery extends PaginationQuery {
  _id?: Product['_id'];
}

export interface FindForWidgetResponse {
  products: ProductCard[];
}

export interface FindForSuggestionQuery extends PaginationQuery {}

export interface FindForSuggestionResponse extends Pagination {
  products: ProductCard[];
}
