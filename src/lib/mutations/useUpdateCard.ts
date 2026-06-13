import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCard } from "../library";
import { requestBadgeRefresh } from "../badge";
import { queryKeys } from "../queries/queryKeys";

/** Updates an already-saved card: its note and/or collection membership. */
export function useUpdateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCard,
    onSuccess: () => {
      requestBadgeRefresh();
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.urlState.all }),
        // Card counts changed.
        queryClient.invalidateQueries({ queryKey: queryKeys.collections.all }),
        // Note/collection changes are reflected in search results.
        queryClient.invalidateQueries({ queryKey: queryKeys.search.all }),
      ]);
    },
  });
}
