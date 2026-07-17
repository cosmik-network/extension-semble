import { useQuery } from "@tanstack/react-query";
import { listMyCollections } from "../library";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

/**
 * Server-side search across all of the user's own collections (name and
 * description). Pass an already-debounced `searchText`; the caller controls
 * `enabled` (default true).
 */
export function useMyCollectionSearch(input: {
  searchText: string;
  enabled?: boolean;
}) {
  const searchText = input.searchText.trim();
  return useQuery({
    queryKey: queryKeys.collections.mySearch(searchText),
    queryFn: () => listMyCollections({ searchText }),
    enabled: !!getApiKey() && input.enabled !== false,
  });
}
