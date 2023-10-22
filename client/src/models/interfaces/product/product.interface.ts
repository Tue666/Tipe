import { Attribute, ProductSchema } from '../schema';
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
    | 'ratings'
    | 'slug'
  > {}

export type WidgetGroup = 'top_selling' | 'top_favorite' | 'top_view' | 'related';

export interface FindForWidgetQuery extends Pick<PaginationQuery, 'limit'> {
  group: WidgetGroup;
  _id?: Product['_id'];
}

export interface FindForWidgetResponse {
  products: ProductCard[];
}

export interface FindForSuggestionQuery extends PaginationQuery {}

export interface FindForSuggestionResponse extends Pagination {
  products: ProductCard[];
}

export type RecommendSort = 'popular' | 'top_selling' | 'newest' | 'price';

export interface FindForRecommendQuery extends PaginationQuery {
  categories?: String; // Id of categories separate by ","
  sort?: RecommendSort;
  direction?: -1 | 1;
}

export interface FindForRecommendResponse extends Pagination {
  products: ProductCard[];
  attributes: Attribute[];
  totalProduct: number;
  totalAttribute: number;
}
