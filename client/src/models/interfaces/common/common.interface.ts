export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type NullableBy<T, K extends keyof T> = Omit<T, K> & Record<K, T[K] | null>;

export type Country = 'VN';

export interface MessageReponse {
  msg: string;
}

export interface PaginationQuery {
  newest?: number;
  limit: number;
}

export interface Pagination {
  pagination: {
    currentPage: number;
    totalPage: number;
  };
}
