import { QueryClient } from "@tanstack/react-query";

/**
 * Shared TanStack Query client. Hooks live in `lib/queries` (reads) and
 * `lib/mutations` (writes); mutations invalidate the relevant query keys to
 * trigger revalidation.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The popup is short-lived — once fetched, data is fresh for the
      // lifetime of a typical popup session.
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});
