import { useInfiniteQuery } from "@tanstack/react-query";
import { listSaversForUrl } from "../savers";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

export const SAVERS_PAGE_SIZE = 20;

/**
 * Infinite list of users who saved a URL, one page per
 * {@link SAVERS_PAGE_SIZE}. Pass `enabled: false` to defer fetching until the
 * savers screen is opened.
 */
export function useUrlSavers(url: string, options?: { enabled?: boolean }) {
  return useInfiniteQuery({
    queryKey: queryKeys.savers.byUrl(url),
    queryFn: ({ pageParam }) =>
      listSaversForUrl(url, pageParam, SAVERS_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!url && !!getApiKey() && (options?.enabled ?? true),
  });
}
