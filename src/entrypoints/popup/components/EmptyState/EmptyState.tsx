import { Box, Stack, Text } from "@mantine/core";
import type { IconType } from "react-icons";

/**
 * Centered icon + message shown when a list has nothing in it — the web app's
 * SembleEmptyTab, restyled to the extension's dimmed small-text look.
 */
export function EmptyState(props: { icon: IconType; message: string }) {
  return (
    <Stack gap={4} align="center" my="auto">
      <Box c="dimmed" lh={1}>
        <props.icon size={28} />
      </Box>
      <Text fz="sm" fw={600} c="dimmed" ta="center" maw={200}>
        {props.message}
      </Text>
    </Stack>
  );
}
