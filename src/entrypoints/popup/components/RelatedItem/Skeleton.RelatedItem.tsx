import { Card, Group, Skeleton, Stack } from "@mantine/core";

/** Loading placeholder mirroring {@link RelatedItem}'s structure. */
export function RelatedItemSkeleton() {
  return (
    <Card withBorder radius="lg" p="xs">
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
        <Stack gap={"sm"} flex={1} miw={0}>
          {/* domain */}
          <Skeleton height={12} width="30%" radius="xl" />
          {/* title */}
          <Skeleton height={14} width="90%" radius="xl" />
          {/* description */}
          <Skeleton height={12} width="70%" radius="xl" />
        </Stack>
        {/* thumbnail */}
        <Skeleton
          height={45}
          width={45}
          radius="md"
          style={{ flexShrink: 0 }}
        />
      </Group>
    </Card>
  );
}
