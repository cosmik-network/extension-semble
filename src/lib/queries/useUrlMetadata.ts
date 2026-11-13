import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getUrlMetadata, type UrlState } from "../library";
import { queryKeys } from "./queryKeys";

/**
 * Title/description/image for a URL. Suspends — render it under its own
 * `<Suspense>` so the rest of the popup never waits on it. Only mount it once a
 * URL and API key are known.
 *
 * A saved URL's metadata already arrived with its library status, so that's
 * used as initial data and no extra request is made.
 */
export function useUrlMetadata(url: string) {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: queryKeys.urlMetadata.byUrl(url),
    queryFn: () => getUrlMetadata(url),
    initialData: () =>
      queryClient.getQueryData<UrlState>(queryKeys.urlState.byUrl(url))
        ?.metadata,
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(queryKeys.urlState.byUrl(url))?.dataUpdatedAt,
  });
}
