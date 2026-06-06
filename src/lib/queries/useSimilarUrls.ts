import { useInfiniteQuery } from "@tanstack/react-query";
import { findSimilarUrls, type UrlType } from "../library";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

export const SIMILAR_URLS_PAGE_SIZE = 20;

/**
 * Infinite list of URLs similar to the given one, one page per
 * {@link SIMILAR_URLS_PAGE_SIZE} results. Pass `enabled: false` to defer
 * fetching (e.g. until the Related tab becomes active) and `urlType` to
 * narrow results to a single content type.
 */
export function useSimilarUrls(
  url: string,
  options?: { enabled?: boolean; urlType?: UrlType },
) {
  return useInfiniteQuery({
    queryKey: queryKeys.similarUrls.byUrl(url, options?.urlType),
    queryFn: ({ pageParam }) =>
      findSimilarUrls(url, pageParam, SIMILAR_URLS_PAGE_SIZE, options?.urlType),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!url && !!getApiKey() && (options?.enabled ?? true),
  });
}
