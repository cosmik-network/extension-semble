import { useSuspenseQuery } from "@tanstack/react-query";
import { getUrlStats } from "../library";
import { queryKeys } from "./queryKeys";

/**
 * Aggregated save/collection/connection counts for a URL. Suspends — render it
 * under its own `<Suspense>` so the rest of the popup never waits on it. Only
 * mount it once a URL and API key are known.
 */
export function useUrlStats(url: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.urlStats.byUrl(url),
    queryFn: () => getUrlStats(url),
    // Counts can change outside the popup (context-menu saves, other users),
    // so treat them as stale immediately and refetch on every mount. (Suspense
    // queries clamp this to 1s, which keeps the remount after the initial
    // suspend from firing a second request — `refetchOnMount: "always"` would.)
    staleTime: 0,
  });
}
