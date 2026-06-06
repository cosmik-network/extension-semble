import { useState } from "react";
import {
  AspectRatio,
  Badge,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { domainFromUrl } from "../../../../lib/activeTab";
import type { SimilarUrl } from "../../../../lib/library";
import classes from "./RelatedItem.module.css";

export function RelatedItem({ item }: { item: SimilarUrl }) {
  const { metadata, inLibrary } = item;
  const domain = domainFromUrl(metadata.url);
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      component="a"
      href={metadata.url}
      target="_blank"
      rel="noreferrer"
      withBorder
      radius="md"
      p="xs"
      c="inherit"
      td="none"
      className={classes.root}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
        <Stack gap={0} flex={1} miw={0}>
          <Group gap={4} wrap="nowrap">
            <Tooltip label={metadata.url} openDelay={500}>
              <Text c="blue" fw={500} fz="xs" lineClamp={1}>
                {domain}
              </Text>
            </Tooltip>
            {inLibrary && (
              <Badge
                size="xs"
                color="green"
                variant="light"
                style={{ flexShrink: 0 }}
              >
                Saved
              </Badge>
            )}
          </Group>
          {metadata.title && (
            <Text c="bright" fz="sm" fw={500} lineClamp={2}>
              {metadata.title}
            </Text>
          )}
          {metadata.description && (
            <Text c="gray" fz="xs" mt={4} lineClamp={2}>
              {metadata.description}
            </Text>
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
    </Card>
  );
}
