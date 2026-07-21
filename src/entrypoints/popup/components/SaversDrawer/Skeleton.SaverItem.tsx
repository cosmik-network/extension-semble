import { Group, Skeleton, Stack } from "@mantine/core";

export function SaverItemSkeleton() {
  return (
    <Group gap="xxs" wrap="nowrap" p={4}>
      <Skeleton height={38} width={38} radius="md" />
      <Stack gap={6}>
        <Skeleton height={10} width={120} radius="sm" />
        <Skeleton height={10} width={80} radius="sm" />
      </Stack>
    </Group>
  );
}
