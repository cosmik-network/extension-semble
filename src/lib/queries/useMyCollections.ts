import { useQuery } from "@tanstack/react-query";
import { listMyCollections } from "../library";
import { getApiKey } from "../semble";
import { queryKeys } from "./queryKeys";

/** The user's collections. Disabled when no API key is configured. */
export function useMyCollections() {
  return useQuery({
    queryKey: queryKeys.collections.my,
    queryFn: listMyCollections,
    enabled: !!getApiKey(),
  });
}
