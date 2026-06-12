import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConnection } from "../connections";
import { queryKeys } from "../queries/queryKeys";

/**
 * Creates a typed connection between two URLs. One end is always the current
 * page (whichever, after a direction swap), so invalidating both ends keeps
 * the visible connections list fresh either way.
 */
export function useCreateConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createConnection,
    onSuccess: (_connectionId, variables) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.connections.byUrl(variables.sourceUrl),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.connections.byUrl(variables.targetUrl),
        }),
      ]),
  });
}
