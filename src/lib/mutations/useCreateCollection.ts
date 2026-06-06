import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCollection } from "../library";
import { queryKeys } from "../queries/queryKeys";

/**
 * Creates a collection. Resolves to the new collection's id once the
 * collections list has been refetched (so the new entry is already visible).
 */
export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollection,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.collections }),
  });
}
