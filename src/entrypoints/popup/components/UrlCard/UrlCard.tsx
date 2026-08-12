import { useState } from "react";
import {
  Anchor,
  AspectRatio,
  Badge,
  Group,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { domainFromUrl } from "../../../../lib/activeTab";
import type { UrlMetadata, UrlStats } from "../../../../lib/library";
import { CollectionsDrawer } from "../CollectionsDrawer";
import { SaversDrawer } from "../SaversDrawer";
import { UrlStatsRow } from "../UrlStatsRow";

export function UrlCard(props: {
  metadata: UrlMetadata;
  inLibrary?: boolean;
  /** Omit to hide the stats row; `"pending"` shows it as a skeleton. */
  stats?: UrlStats | "pending";
}) {
  const { metadata } = props;
  const domain = domainFromUrl(metadata.url);
  const [imageError, setImageError] = useState(false);
  const [saversOpened, setSaversOpened] = useState(false);
  const [collectionsOpened, setCollectionsOpened] = useState(false);

  return (
    <>
      <Group
        justify="space-between"
        align="flex-start"
        wrap="nowrap"
        gap="md"
        flex={1}
        miw={0}
      >
        <Stack gap={2} miw={0}>
          <Group gap={"xxs"} wrap="nowrap" miw={0}>
            <Tooltip label={metadata.url}>
              <Anchor
                href={metadata.url}
                target="_blank"
                rel="noreferrer"
                size="xs"
                c="blue"
                fw={500}
                lineClamp={1}
                style={{ flex: "0 1 auto", minWidth: 0 }}
              >
                {domain}
              </Anchor>
            </Tooltip>
            {props.inLibrary && (
              <Badge
                size="xs"
                color="green"
                variant="light"
                style={{ flexShrink: 0 }}
              >
                In library
              </Badge>
            )}
          </Group>
          <Text fw={600} size="sm" lineClamp={2}>
            {metadata.title || metadata.url}
          </Text>
          {metadata.description && (
            <Text c="gray" fz="xs" mt={4} lineClamp={1}>
              {metadata.description}
            </Text>
          )}
          {/* Omitted entirely when there are no stats to show; `"pending"`
              reserves the row's height while they load. */}
          {props.stats && (
            <UrlStatsRow
              stats={props.stats}
              onSavesClick={() => setSaversOpened(true)}
              onCollectionsClick={() => setCollectionsOpened(true)}
            />
          )}
        </Stack>
        {metadata.imageUrl && !imageError && (
          <AspectRatio ratio={1}>
            <Image
              src={metadata.imageUrl}
              alt=""
              radius="md"
              w={45}
              h={45}
              onError={() => setImageError(true)}
            />
          </AspectRatio>
        )}
      </Group>
      {/* Portal-rendered; kept out of the layout tree above. */}
      <SaversDrawer
        url={metadata.url}
        opened={saversOpened}
        onClose={() => setSaversOpened(false)}
      />
      <CollectionsDrawer
        url={metadata.url}
        opened={collectionsOpened}
        onClose={() => setCollectionsOpened(false)}
      />
    </>
  );
}
