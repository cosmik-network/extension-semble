import { useQuery } from "@tanstack/react-query";
import { getUrlStats } from "../library";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

/**
 * Aggregated save/collection/connection counts for a URL. Fetched separately
 * from {@link useUrlState} so the popup renders without waiting on it — the
 * counts pop in when this resolves.
 */
export function useUrlStats(url: string) {
  return useQuery({
    queryKey: queryKeys.urlStats.byUrl(url),
    queryFn: () => getUrlStats(url),
    enabled: !!url && !!getApiKey(),
    // Counts can change outside the popup (context-menu saves, other users),
    // so always refetch on open rather than trusting the staleTime window.
    refetchOnMount: "always",
  });
}
