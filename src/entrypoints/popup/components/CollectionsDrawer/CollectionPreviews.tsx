import { Box, Group } from "@mantine/core";
import { useScroller } from "@mantine/hooks";
import { useCollectionPreviewCards } from "../../../../lib/queries";
import classes from "./CollectionsDrawer.module.css";
import { PreviewCard } from "./PreviewCard";
import { CollectionPreviewsSkeleton } from "./Skeleton.CollectionPreviews";

/** Width of the fade masking each overflowing edge of the preview strip. */
const FADE_WIDTH = 28;

/**
 * Horizontally scrollable strip of the collection's first few cards. Renders
 * nothing for empty collections or when the preview fetch fails.
 */
export function CollectionPreviews(props: {
  collectionId: string;
  cardCount: number;
}) {
  const query = useCollectionPreviewCards(props.collectionId, {
    enabled: props.cardCount > 0,
  });
  const scroller = useScroller();

  if (props.cardCount === 0) return null;
  if (query.isPending) {
    return (
      <Box mt={4}>
        <CollectionPreviewsSkeleton />
      </Box>
    );
  }
  if (query.isError || !query.data?.length) return null;

  // Fade the overflowing edges (left/right) instead of cutting them off,
  // toggled by whether there's more content to scroll in each direction.
  const maskImage =
    scroller.canScrollStart || scroller.canScrollEnd
      ? `linear-gradient(to right, ${
          scroller.canScrollStart ? "transparent" : "#000"
        }, #000 ${FADE_WIDTH}px, #000 calc(100% - ${FADE_WIDTH}px), ${
          scroller.canScrollEnd ? "transparent" : "#000"
        })`
      : undefined;

  return (
    <Box
      ref={scroller.ref}
      {...scroller.dragHandlers}
      className={classes.previews}
      mt={4}
      style={{ maskImage, WebkitMaskImage: maskImage }}
    >
      <Group gap="xs" grow={query.data.length > 2} wrap="nowrap" align="start">
        {query.data.map((card) => (
          <PreviewCard key={card.id} card={card} />
        ))}
      </Group>
    </Box>
  );
}
