import type { SimilarUrl } from "../../../../lib/library";
import { InfiniteList } from "../InfiniteList";
import { RelatedItem, RelatedItemSkeleton } from "../RelatedItem";

/** Structural subset of an infinite-query result of URL pages. */
interface UrlInfiniteQuery {
  data?: { pages: { urls: SimilarUrl[] }[] };
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
}

interface UrlResultListProps {
  query: UrlInfiniteQuery;
  /** Shown when the query succeeds with no results. */
  emptyMessage: string;
}

/**
 * Infinite-scrolling list of URL results shared by the Related and Search tabs.
 * A thin wrapper over {@link InfiniteList} that renders each result as a
 * {@link RelatedItem}.
 */
export function UrlResultList({ query, emptyMessage }: UrlResultListProps) {
  return (
    <InfiniteList
      query={query}
      getItems={(page) => page.urls}
      getKey={(item) => item.metadata.url}
      renderItem={(item) => <RelatedItem item={item} />}
      renderSkeleton={() => <RelatedItemSkeleton />}
      emptyMessage={emptyMessage}
    />
  );
}
