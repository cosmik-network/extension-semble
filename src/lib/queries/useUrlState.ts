import { useQuery } from "@tanstack/react-query";
import { loadUrlState } from "../library";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

/**
 * Saved/unsaved state and metadata for a URL. Disabled until a URL is known
 * (and when no API key is configured).
 */
export function useUrlState(url: string) {
  return useQuery({
    queryKey: queryKeys.urlState.byUrl(url),
    queryFn: () => loadUrlState(url),
    enabled: !!url && !!getApiKey(),
    // The URL may have been saved/removed outside the popup (context menu),
    // so always refetch on open rather than trusting the staleTime window.
    refetchOnMount: "always",
  });
}
