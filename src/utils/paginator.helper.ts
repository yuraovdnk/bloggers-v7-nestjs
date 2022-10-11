import { PaginatedItems, QueryParamsType } from '../types/global-types';

export function paginator<T>(items: Array<T>, queryParams: QueryParamsType): PaginatedItems<T> {
  const totalCount = items.length;
  return {
    pagesCount: Math.ceil(totalCount / queryParams.pageSize),
    page: queryParams.pageNumber,
    pageSize: queryParams.pageSize,
    totalCount,
    items,
  };
}
