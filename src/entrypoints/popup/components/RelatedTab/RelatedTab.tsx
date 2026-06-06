import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Group,
  Loader,
  ScrollArea,
  Scroller,
  Stack,
  Text,
} from "@mantine/core";
import { URL_TYPES, type UrlType } from "../../../../lib/library";
import { useSimilarUrls } from "../../../../lib/queries";
import { useScrollFade } from "../../hooks/useScrollFade";
import { RelatedItem, RelatedItemSkeleton } from "../RelatedItem";

/** Start loading the next page when scrolled within this many px of the end. */
const NEXT_PAGE_SCROLL_MARGIN = 200;

/**
 * Infinite list of URLs similar to the current page. Fetches lazily the first
 * time its tab becomes active (the query cache keeps the result), then loads
 * further pages as the list is scrolled. Results can be narrowed to a single
 * content type; the "All" option clears the filter.
 */
export function RelatedTab({ url, active }: { url: string; active: boolean }) {
  const [urlType, setUrlType] = useState<UrlType | null>(null);

  const {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSimilarUrls(url, { enabled: active, urlType: urlType ?? undefined });

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

  return (
    <Stack gap="xs" h="100%">
      {/* Type filter: single-select; "All" clears the filter. Must not
          flex-shrink, or overflowing content (e.g. skeletons) collapses it. */}
      <Scroller style={{ flexShrink: 0 }}>
        <Group gap="xxs" wrap="nowrap">
          <Button
            size="xs"
            color={urlType === null ? "lime" : "gray"}
            variant={urlType === null ? "filled" : "light"}
            onClick={() => setUrlType(null)}
          >
            All
          </Button>
          {URL_TYPES.map((type) => (
            <Button
              key={type}
              size="xs"
              color={urlType === type ? "lime" : "gray"}
              variant={urlType === type ? "filled" : "light"}
              onClick={() => setUrlType(type)}
              tt="capitalize"
            >
              {type}
            </Button>
          ))}
        </Group>
      </Scroller>

      {renderContent()}
    </Stack>
  );

  function renderContent() {
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
        style={{ flex: 1, minHeight: 0 }}
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
}
