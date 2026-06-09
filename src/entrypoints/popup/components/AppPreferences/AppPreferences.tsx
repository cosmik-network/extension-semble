import { Divider, Group, Stack, Text, UnstyledButton } from "@mantine/core";
import { useOpenMode } from "../../../../lib/hooks";
import type { OpenMode } from "../../../../lib/openMode";
import { canUseSidePanel } from "../../../../lib/sidepanel";
import classes from "./AppPreferences.module.css";

interface ModeOptionProps {
  label: string;
  mode: OpenMode;
  checked: boolean;
  onSelect: (mode: OpenMode) => void;
}

/**
 * One selectable card: a mini browser sketch showing where the extension UI
 * opens (a box under the toolbar icon, or a panel docked at the side).
 */
function ModeOption(props: ModeOptionProps) {
  return (
    <UnstyledButton
      role="radio"
      p={"xs"}
      aria-checked={props.checked}
      data-checked={props.checked || undefined}
      className={classes.option}
      onClick={() => props.onSelect(props.mode)}
    >
      <div className={classes.frame}>
        <div className={classes.toolbar} />
        <div className={classes.toolbarIcon} />
        <div
          className={props.mode === "popup" ? classes.popup : classes.panel}
        />
      </div>
      <Text fz="xs" fw={500} ta="center" mt={6}>
        {props.label}
      </Text>
    </UnstyledButton>
  );
}

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
        <Group gap="xs" grow role="radiogroup" aria-label="Open Semble in">
          <ModeOption
            label="Popup"
            mode="popup"
            checked={mode === "popup"}
            onSelect={setMode}
          />
          <ModeOption
            label="Side panel"
            mode="sidepanel"
            checked={mode === "sidepanel"}
            onSelect={setMode}
          />
        </Group>
      </Stack>
    </>
  );
}
