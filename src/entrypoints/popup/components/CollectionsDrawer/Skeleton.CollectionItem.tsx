import { Group, Skeleton, Stack } from "@mantine/core";
import { CollectionPreviewsSkeleton } from "./Skeleton.CollectionPreviews";

export function CollectionItemSkeleton() {
  return (
    <Stack
      gap={8}
      p="xs"
      bd="1px solid var(--mantine-color-default-border)"
      bdrs="md"
    >
      <Skeleton height={12} width={140} radius="sm" />
      <Skeleton height={10} width={220} radius="sm" />
      <CollectionPreviewsSkeleton />
      <Group justify="space-between" mt={4}>
        <Skeleton height={10} width={50} radius="sm" />
        <Skeleton height={10} width={90} radius="sm" />
      </Group>
    </Stack>
  );
}
