import { useQuery } from "@tanstack/react-query";
import { searchCollections, type CollectionAccessType } from "../library";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

/**
 * Full-text collection search, optionally narrowed to an access type. Pass an
 * already-debounced `searchText`. The caller controls `enabled` (default true)
 * — an empty `searchText` is a valid "browse all" query, so gating is left to
 * the caller rather than assumed here.
 */
export function useCollectionSearch(input: {
  searchText: string;
  accessType?: CollectionAccessType;
  enabled?: boolean;
}) {
  const searchText = input.searchText.trim();
  return useQuery({
    queryKey: queryKeys.collections.search(searchText, input.accessType),
    queryFn: () =>
      searchCollections({ searchText, accessType: input.accessType }),
    enabled: !!getApiKey() && input.enabled !== false,
  });
}
