import { useInfiniteQuery } from "@tanstack/react-query";
import { getApiKey } from "../semble";
import { listCollectionsForUrl } from "../urlCollections";
import { queryKeys } from "./queryKeys";

export const URL_COLLECTIONS_PAGE_SIZE = 20;

/**
 * Infinite list of collections containing a URL, one page per
 * {@link URL_COLLECTIONS_PAGE_SIZE}. Pass `enabled: false` to defer fetching
 * until the collections screen is opened.
 */
export function useUrlCollections(
  url: string,
  options?: { enabled?: boolean },
) {
  return useInfiniteQuery({
    queryKey: queryKeys.collections.forUrl(url),
    queryFn: ({ pageParam }) =>
      listCollectionsForUrl(url, pageParam, URL_COLLECTIONS_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!url && !!getApiKey() && (options?.enabled ?? true),
  });
}
