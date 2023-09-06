export interface Category {
  _id: number;
  name: string;
  image: string;
  banners?: string[];
  slug: string;
}

export interface NestedCategory extends Category {
  parents: Pick<Category, '_id' | 'name' | 'slug'>[];
  children: Pick<Category, '_id' | 'name' | 'slug'>[];
}

export interface FindQuery {
  parent_id?: number;
}
