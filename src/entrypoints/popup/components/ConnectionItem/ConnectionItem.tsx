import { useState } from "react";
import {
  AspectRatio,
  Avatar,
  Badge,
  Box,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { domainFromUrl } from "../../../../lib/activeTab";
import type { Connection } from "../../../../lib/connections";
import { CONNECTION_TYPE_CONFIG } from "./connectionTypeConfig";
import classes from "./ConnectionItem.module.css";

/** "LEADS_TO" -> "Leads to" (fallback for unknown types). */
function humanizeType(type: string): string {
  const words = type.toLowerCase().replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function ConnectionItem(props: { connection: Connection }) {
  const { other, type, note, curator } = props.connection;
  const domain = domainFromUrl(other.url);
  const [imageError, setImageError] = useState(false);

  const typeConfig = type ? CONNECTION_TYPE_CONFIG[type] : undefined;
  const TypeIcon = typeConfig?.icon;

  return (
    <Card
      component="a"
      href={other.url}
      target="_blank"
      rel="noreferrer"
      withBorder
      radius="lg"
      p="xs"
      c="inherit"
      td="none"
      className={classes.root}
    >
      <Stack gap={6}>
        <Group
          justify="space-between"
          align="flex-start"
          wrap="nowrap"
          gap="md"
        >
          <Stack gap={0} flex={1} miw={0}>
            <Group gap={4} wrap="nowrap">
              <Tooltip label={other.url} openDelay={500}>
                <Text c="blue" fw={500} fz="xs" lineClamp={1}>
                  {domain}
                </Text>
              </Tooltip>
              {type && (
                <Badge
                  size="xs"
                  variant="light"
                  color="green"
                  style={{ flexShrink: 0 }}
                  leftSection={TypeIcon ? <TypeIcon size={11} /> : undefined}
                >
                  {typeConfig?.label ?? humanizeType(type)}
                </Badge>
              )}
            </Group>
            {other.title && (
              <Text c="bright" fz="sm" fw={500} lineClamp={2}>
                {other.title}
              </Text>
            )}
          </Stack>
          {other.imageUrl && !imageError && (
            <AspectRatio ratio={1}>
              <Image
                src={other.imageUrl}
                alt=""
                radius="md"
                w={45}
                h={45}
                onError={() => setImageError(true)}
              />
            </AspectRatio>
          )}
        </Group>

        {note && (
          <Box className={classes.note}>
            <Text c="gray" fz="xs" fs="italic" lineClamp={3}>
              {note}
            </Text>
          </Box>
        )}

        <Group gap={"xxs"} wrap="nowrap">
          <Avatar
            src={curator.avatarUrl}
            name={curator.name}
            size={"xs"}
            radius="sm"
          />
          <Text c="dimmed" fw={500} fz="xs" lineClamp={1}>
            @{curator.handle}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
