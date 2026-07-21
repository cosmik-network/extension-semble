import { Group, Skeleton } from "@mantine/core";
import { PREVIEW_CARD_WIDTH, PREVIEW_THUMBNAIL_HEIGHT } from "./PreviewCard";

/** Placeholder strip of preview-card thumbnails. */
export function CollectionPreviewsSkeleton() {
  return (
    <Group gap="xs" wrap="nowrap">
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton
          key={index}
          height={PREVIEW_THUMBNAIL_HEIGHT}
          width={PREVIEW_CARD_WIDTH}
          radius="md"
          style={{ flexShrink: 0 }}
        />
      ))}
    </Group>
  );
}
