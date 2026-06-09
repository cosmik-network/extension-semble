import { Divider, SegmentedControl, Stack, Text } from "@mantine/core";
import { useOpenMode } from "../../../../lib/hooks";
import type { OpenMode } from "../../../../lib/openMode";
import { canUseSidePanel } from "../../../../lib/sidepanel";

/**
 * App behaviour preferences shown in the settings view. Currently: whether
 * clicking the toolbar icon opens the popup or the side panel. Hidden where the
 * side panel isn't supported (e.g. Firefox), since the choice is moot there.
 */
export function AppPreferences() {
  const [mode, setMode] = useOpenMode();

  if (!canUseSidePanel()) return null;

  return (
    <>
      <Divider />
      <Stack gap={6}>
        <Text fz="sm" fw={500}>
          Open Semble in
        </Text>
        <SegmentedControl
          value={mode}
          onChange={(value) => setMode(value as OpenMode)}
          data={[
            { label: "Popup", value: "popup" },
            { label: "Side panel", value: "sidepanel" },
          ]}
          fullWidth
          size="xs"
        />
      </Stack>
    </>
  );
}
