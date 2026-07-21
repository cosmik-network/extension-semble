import { useState } from "react";
import {
  AspectRatio,
  Box,
  Card,
  Center,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { BiWorld } from "react-icons/bi";
import { domainFromUrl } from "../../../../lib/activeTab";
import type { CollectionPreviewCard } from "../../../../lib/urlCollections";

/** Tile width; the thumbnail is 16:9. Mirrors the web app's PreviewCard. */
export const PREVIEW_CARD_WIDTH = 110;
export const PREVIEW_THUMBNAIL_HEIGHT = PREVIEW_CARD_WIDTH * (9 / 16);

/** One card thumbnail (domain + title) in the collection preview strip. */
export function PreviewCard(props: { card: CollectionPreviewCard }) {
  const { card } = props;
  const [imageError, setImageError] = useState(false);
  return (
    <Box w={PREVIEW_CARD_WIDTH} miw={PREVIEW_CARD_WIDTH}>
      <AspectRatio ratio={16 / 9}>
        {card.imageUrl && !imageError ? (
          <Image
            src={card.imageUrl}
            alt=""
            radius="md"
            fit="cover"
            draggable={false}
            onError={() => setImageError(true)}
          />
        ) : (
          <Card p="xs" radius="md" withBorder>
            <Center my="auto">
              <BiWorld size={24} color="var(--mantine-color-dimmed)" />
            </Center>
          </Card>
        )}
      </AspectRatio>
      <Stack gap={0} mt={6}>
        <Text c="gray" fz={11} lineClamp={1}>
          {domainFromUrl(card.url)}
        </Text>
        {card.title && (
          <Text c="bright" fz={12} fw={500} lineClamp={2}>
            {card.title}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
