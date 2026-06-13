import { useQuery } from "@tanstack/react-query";
import { listOpenContributedCollections } from "../library";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

/**
 * Open collections the signed-in user has contributed to. Disabled until both
 * an API key and the user's identifier (their profile id) are available.
 */
export function useOpenCollections(identifier: string | undefined) {
  return useQuery({
    queryKey: queryKeys.collections.open(identifier ?? ""),
    queryFn: () => listOpenContributedCollections(identifier!),
    enabled: !!getApiKey() && !!identifier,
  });
}
