import { CategorySchema } from '../schema';

export interface Category extends CategorySchema {}

export interface FindQuery {
  parent_id?: number;
}

export interface FindResponse {
  categories: Pick<Category, '_id' | 'name' | 'image' | 'slug'>[];
}

export interface NestedCategory extends Category {
  parents: Pick<Category, '_id' | 'name' | 'slug'>[];
  children: Pick<Category, '_id' | 'name' | 'slug'>[];
}
