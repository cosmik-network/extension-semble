import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFromLibrary } from "../library";
import { queryKeys } from "../queries/queryKeys";

/** Removes a card from the user's library. */
export function useRemoveFromLibrary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromLibrary,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.urlState.all }),
        // Card counts changed.
        queryClient.invalidateQueries({ queryKey: queryKeys.collections }),
      ]),
  });
}
