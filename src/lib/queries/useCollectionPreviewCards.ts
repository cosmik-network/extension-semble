import { useQuery } from "@tanstack/react-query";
import { getApiKey } from "../semble";
import { listCollectionPreviewCards } from "../urlCollections";
import { queryKeys } from "./queryKeys";

export const PREVIEW_CARD_COUNT = 6;

/**
 * The first {@link PREVIEW_CARD_COUNT} cards of a collection, used as
 * thumbnail previews. Pass `enabled: false` while the previews are off-screen.
 */
export function useCollectionPreviewCards(
  collectionId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.collections.preview(collectionId),
    queryFn: () => listCollectionPreviewCards(collectionId, PREVIEW_CARD_COUNT),
    enabled: !!collectionId && !!getApiKey() && (options?.enabled ?? true),
  });
}
