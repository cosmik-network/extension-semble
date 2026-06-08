import { useInfiniteQuery } from "@tanstack/react-query";
import { searchSemble, type UrlType } from "../library";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

export const SEARCH_PAGE_SIZE = 20;

/**
 * Infinite full-text search across Semble, one page per
 * {@link SEARCH_PAGE_SIZE} results. Stays disabled until `query` is non-empty
 * (and a key exists); pass `enabled: false` to also defer until the Search tab
 * is active, and `urlType` to narrow results to a single content type.
 */
export function useSembleSearch(
  query: string,
  options?: { enabled?: boolean; urlType?: UrlType },
) {
  const trimmed = query.trim();
  return useInfiniteQuery({
    queryKey: queryKeys.search.byQuery(trimmed, options?.urlType),
    queryFn: ({ pageParam }) =>
      searchSemble(trimmed, pageParam, SEARCH_PAGE_SIZE, options?.urlType),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!trimmed && !!getApiKey() && (options?.enabled ?? true),
  });
}
