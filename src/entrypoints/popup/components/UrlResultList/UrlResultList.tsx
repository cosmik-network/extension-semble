import { Alert, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import type { SimilarUrl } from "../../../../lib/library";
import { useScrollFade } from "../../hooks/useScrollFade";
import { RelatedItem, RelatedItemSkeleton } from "../RelatedItem";

/** Load the next page when scrolled within this many px of the end. */
const NEXT_PAGE_SCROLL_MARGIN = 200;

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
 * Shows skeletons while pending, an alert on error, the empty message, or the
 * results — fetching the next page as the list nears its end.
 */
export function UrlResultList({ query, emptyMessage }: UrlResultListProps) {
  const { data, isPending, isError, error, isFetchingNextPage } = query;
  const { viewportRef, setViewport, maskImage, updateFade } = useScrollFade();

  function handleScrollPositionChange() {
    updateFade();
    const el = viewportRef.current;
    if (!el) return;
    const nearBottom =
      el.scrollTop + el.clientHeight >=
      el.scrollHeight - NEXT_PAGE_SCROLL_MARGIN;
    if (nearBottom && query.hasNextPage && !isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }

  if (isPending) {
    return (
      <Stack gap="xxs">
        {Array.from({ length: 6 }, (_, i) => (
          <RelatedItemSkeleton key={i} />
        ))}
      </Stack>
    );
  }

  if (isError) {
    return (
      <Alert color="red" variant="light">
        {error?.message ?? "Something went wrong."}
      </Alert>
    );
  }

  const items = data?.pages.flatMap((page) => page.urls) ?? [];
  if (items.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        {emptyMessage}
      </Text>
    );
  }

  return (
    <ScrollArea
      type="auto"
      style={{ flex: 1, minHeight: 0 }}
      viewportRef={setViewport}
      onScrollPositionChange={handleScrollPositionChange}
      styles={{
        viewport: maskImage
          ? { maskImage, WebkitMaskImage: maskImage }
          : undefined,
      }}
    >
      <Stack gap="xxs">
        {items.map((item) => (
          <RelatedItem key={item.metadata.url} item={item} />
        ))}
        {isFetchingNextPage && (
          <Loader size="sm" color="gray" mx="auto" my="sm" />
        )}
      </Stack>
    </ScrollArea>
  );
}
