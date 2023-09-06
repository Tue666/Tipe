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
