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
  });
}
