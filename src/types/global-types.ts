export type QueryParamsType = {
  pageSize: number;
  pageNumber: number;
  searchNameTerm: string | object;
  skip: number;
};

export type PaginatedItems<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<T>;
};
