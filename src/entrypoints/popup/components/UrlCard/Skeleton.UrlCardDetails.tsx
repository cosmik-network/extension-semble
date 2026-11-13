import { AspectRatio, Skeleton, Text } from "@mantine/core";

/**
 * Placeholder for UrlCardDetails. Like UrlStatsRow's pending state, each bar
 * overlays the real `Text` markup (with blank content) rather than a guessed
 * height, so it takes exactly the line height, margin and typography the loaded
 * title/description will — nothing below shifts when they land, and the bars
 * can't drift if those styles change.
 */
export function UrlCardDetailsSkeleton() {
  return (
    <>
      <Skeleton visible radius="xl" w="85%">
        <Text fw={600} size="sm" lineClamp={1}>
          &nbsp;
        </Text>
      </Skeleton>
      <Skeleton visible radius="xl" w="60%" mt={4}>
        <Text fz="xs" lineClamp={1}>
          &nbsp;
        </Text>
      </Skeleton>
    </>
  );
}

/** Placeholder for UrlCardImage: the same 45×45 rounded thumbnail. */
export function UrlCardImageSkeleton() {
  return (
    <AspectRatio ratio={1}>
      <Skeleton w={45} h={45} radius="md" />
    </AspectRatio>
  );
}
