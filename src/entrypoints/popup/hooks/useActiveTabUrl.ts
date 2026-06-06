import { useQuery } from "@tanstack/react-query";
import { getActiveTabUrl } from "../../../lib/activeTab";

/**
 * URL of the active tab (`null` when there is none). Browser state rather
 * than a Semble endpoint, so it lives here instead of `lib/queries`. It can't
 * change while the popup is open, hence `staleTime: Infinity`.
 */
export function useActiveTabUrl() {
  return useQuery({
    queryKey: ["activeTabUrl"],
    queryFn: async () => (await getActiveTabUrl()) ?? null,
    staleTime: Infinity,
  });
}
