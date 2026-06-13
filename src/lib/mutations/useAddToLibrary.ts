import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToLibrary } from "../library";
import { requestBadgeRefresh } from "../badge";
import { queryKeys } from "../queries/queryKeys";

/**
 * First-time save of a URL (with optional note and collections). Resolves to
 * the new card id once the URL's state has been refetched.
 */
export function useAddToLibrary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToLibrary,
    onSuccess: (_cardId, variables) => {
      requestBadgeRefresh();
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.urlState.byUrl(variables.url),
        }),
        // Card counts changed.
        queryClient.invalidateQueries({ queryKey: queryKeys.collections.all }),
        // Search results' "Saved" badges may now apply to this URL.
        queryClient.invalidateQueries({ queryKey: queryKeys.search.all }),
      ]);
    },
  });
}
