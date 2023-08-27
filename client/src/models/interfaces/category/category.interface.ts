export interface Category {
  _id: string;
  name: string;
  image: string;
  banners?: string[];
  slug: string;
  parents: Omit<Category, 'parents'>[];
  children: Omit<Category, 'children'>[];
}

export interface FindQuery {
  parent_id?: number;
}
