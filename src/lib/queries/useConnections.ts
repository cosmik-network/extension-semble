import { useInfiniteQuery } from "@tanstack/react-query";
import { listConnectionsForUrl } from "../connections";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

export const CONNECTIONS_PAGE_SIZE = 20;

/**
 * Infinite list of connections for a URL, one page per
 * {@link CONNECTIONS_PAGE_SIZE}. Pass `enabled: false` to defer fetching until
 * the Connections tab becomes active.
 */
export function useConnections(
  url: string,
  options?: { enabled?: boolean },
) {
  return useInfiniteQuery({
    queryKey: queryKeys.connections.byUrl(url),
    queryFn: ({ pageParam }) =>
      listConnectionsForUrl(url, pageParam, CONNECTIONS_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: !!url && !!getApiKey() && (options?.enabled ?? true),
  });
}
