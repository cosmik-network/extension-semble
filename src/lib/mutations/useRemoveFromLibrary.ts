import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromLibrary } from "../library";
import { requestBadgeRefresh } from "../badge";
import { queryKeys } from "../queries/queryKeys";

/** Removes a card from the user's library. */
export function useRemoveFromLibrary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromLibrary,
    onSuccess: () => {
      requestBadgeRefresh();
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.urlState.all }),
        // Save/collection counts changed (only the card id is known here).
        queryClient.invalidateQueries({ queryKey: queryKeys.urlStats.all }),
        // The current user no longer appears among the URL's savers.
        queryClient.invalidateQueries({ queryKey: queryKeys.savers.all }),
        // Card counts changed.
        queryClient.invalidateQueries({ queryKey: queryKeys.collections.all }),
        // Search results' "Saved" badges no longer apply to this URL.
        queryClient.invalidateQueries({ queryKey: queryKeys.search.all }),
      ]);
    },
  });
}
