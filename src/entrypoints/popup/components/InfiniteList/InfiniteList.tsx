import { Fragment, type ReactNode } from "react";
import {
  Alert,
  Loader,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useScrollFade } from "../../hooks/useScrollFade";

/** Load the next page when scrolled within this many px of the end. */
const NEXT_PAGE_SCROLL_MARGIN = 200;

/** Structural subset of a TanStack infinite-query result over pages of `P`. */
interface InfiniteListQuery<P> {
  data?: { pages: P[] };
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
}

interface InfiniteListProps<P, T> {
  query: InfiniteListQuery<P>;
  /** Extracts the items from a page. */
  getItems: (page: P) => T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  /** Shown when the query succeeds with no results. */
  emptyMessage: string;
  /** Placeholder row rendered while pending (defaults to a plain Skeleton). */
  renderSkeleton?: () => ReactNode;
  skeletonCount?: number;
}

/**
 * Infinite-scrolling list shell: handles the pending/error/empty/results states,
 * edge fade, and near-bottom paging — leaving item extraction and rendering to
 * the caller. Shared by the URL tabs (Related, Search) and the Connections tab.
 */
export function InfiniteList<P, T>({
  query,
  getItems,
  getKey,
  renderItem,
  emptyMessage,
  renderSkeleton,
  skeletonCount = 6,
}: InfiniteListProps<P, T>) {
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
        {Array.from({ length: skeletonCount }, (_, i) => (
          <Fragment key={i}>
            {renderSkeleton ? (
              renderSkeleton()
            ) : (
              <Skeleton height={60} radius="lg" />
            )}
          </Fragment>
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

  const items = data?.pages.flatMap(getItems) ?? [];
  if (items.length === 0) {
    return (
      <Text size="sm" fw={500} c="dimmed" mx={"auto"} my={"xs"}>
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
          <Fragment key={getKey(item)}>{renderItem(item)}</Fragment>
        ))}
        {isFetchingNextPage && (
          <Loader size="sm" color="gray" mx="auto" my="sm" />
        )}
      </Stack>
    </ScrollArea>
  );
}
