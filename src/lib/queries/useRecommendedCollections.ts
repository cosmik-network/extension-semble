import { useQuery } from "@tanstack/react-query";
import { getRecommendedCollectionsForUrl } from "../library";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

/**
 * Collections recommended for saving the given URL to (own and open, split by
 * the API). Pass `enabled: false` to defer fetching until the Recommended tab
 * becomes active.
 */
export function useRecommendedCollections(
  url: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.collections.recommended(url),
    queryFn: () => getRecommendedCollectionsForUrl(url),
    enabled: !!url && !!getApiKey() && (options?.enabled ?? true),
  });
}
