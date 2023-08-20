export interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
}

export interface FindQuery {
  parent_id?: number;
}
