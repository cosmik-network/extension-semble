import { Anchor, Group, Stack, Text } from "@mantine/core";
import {
  sembleCollectionUrl,
  sembleProfileUrl,
} from "../../../../lib/sembleWeb";
import { pluralize } from "../../../../lib/text";
import { getRelativeTime } from "../../../../lib/time";
import type { UrlCollection } from "../../../../lib/urlCollections";
import { CollectionPreviews } from "./CollectionPreviews";
import classes from "./CollectionsDrawer.module.css";

export function CollectionItem(props: { collection: UrlCollection }) {
  const { collection } = props;
  // The record key should always be present; fall back to the author's
  // profile (which lists their collections) rather than a broken link.
  const href = collection.rkey
    ? sembleCollectionUrl(collection.authorHandle, collection.rkey)
    : sembleProfileUrl(collection.authorHandle);
  const age = getRelativeTime(collection.updatedAt);
  return (
    <Anchor
      href={href}
      target="_blank"
      rel="noreferrer"
      underline="never"
      c="inherit"
      display="block"
      p="xs"
      bd="1px solid var(--mantine-color-default-border)"
      bdrs="md"
      className={classes.item}
    >
      <Stack gap={4} miw={0}>
        <Text fz="sm" fw={600} c="bright" lineClamp={1}>
          {collection.name}
        </Text>
        {collection.description && (
          <Text fz="xs" c="dimmed" lineClamp={2}>
            {collection.description}
          </Text>
        )}
        <CollectionPreviews
          collectionId={collection.id}
          cardCount={collection.cardCount}
        />
        <Group justify="space-between" gap="xs" mt={4}>
          <Text fz="xs" fw={500} c="dimmed">
            {collection.cardCount} {pluralize(collection.cardCount, "card")}
          </Text>
          <Text fz="xs" fw={500} c="dimmed">
            {age === "now" ? "updated just now" : `updated ${age} ago`}
          </Text>
        </Group>
      </Stack>
    </Anchor>
  );
}
