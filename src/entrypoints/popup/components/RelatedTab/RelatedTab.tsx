import { useEffect } from "react";
import { Alert, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { useSimilarUrls } from "../../../../lib/queries";
import { useScrollFade } from "../../hooks/useScrollFade";
import { RelatedItem, RelatedItemSkeleton } from "../RelatedItem";

/** Start loading the next page when scrolled within this many px of the end. */
const NEXT_PAGE_SCROLL_MARGIN = 200;

/**
 * Infinite list of URLs similar to the current page. Fetches lazily the first
 * time its tab becomes active (the query cache keeps the result), then loads
 * further pages as the list is scrolled.
 */
export function RelatedTab({ url, active }: { url: string; active: boolean }) {
  const {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSimilarUrls(url, { enabled: active });

  const { viewportRef, maskImage, updateFade } = useScrollFade();

  const items = data?.pages.flatMap((page) => page.urls) ?? [];

  // Refresh the fade once results render (and whenever they change).
  useEffect(updateFade, [items.length, updateFade]);

  function handleScrollPositionChange() {
    updateFade();
    const el = viewportRef.current;
    if (!el) return;
    const nearBottom =
      el.scrollTop + el.clientHeight >=
      el.scrollHeight - NEXT_PAGE_SCROLL_MARGIN;
    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }

  // Also covers the disabled (not-yet-active) state.
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
        {error.message}
      </Alert>
    );
  }

  if (items.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        No similar URLs found.
      </Text>
    );
  }

  return (
    <ScrollArea
      type="auto"
      h="100%"
      viewportRef={viewportRef}
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
          <Loader size={"sm"} color="gray" mx={"auto"} my={"sm"} />
        )}
      </Stack>
    </ScrollArea>
  );
}
