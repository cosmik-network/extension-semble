import { useState } from "react";
import {
  Button,
  CheckboxCard,
  CheckboxIndicator,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { domainFromUrl, faviconUrl } from "../../../../lib/activeTab";
import type { SaveAllCandidate } from "../../../../lib/saveAllTabs";
import { useScrollFade } from "../../hooks/useScrollFade";
import classes from "./SaveAllConfirm.module.css";

interface SaveAllConfirmProps {
  /** The window's saveable tabs, all checked to start. */
  candidates: SaveAllCandidate[];
  /** Start saving the checked tabs. */
  onConfirm: (urls: string[]) => void;
  /** Discard the request without saving anything. */
  onCancel: () => void;
}

function TabRow(props: {
  candidate: SaveAllCandidate;
  checked: boolean;
  onToggle: (url: string, checked: boolean) => void;
}) {
  const url = props.candidate.url;
  return (
    <CheckboxCard
      className={classes.root}
      p="xs"
      radius="lg"
      value={url}
      checked={props.checked}
      onChange={(value) => props.onToggle(url, value)}
    >
      <Group wrap="nowrap" gap="xs">
        <Image src={faviconUrl(url, 32)} alt="" w={16} h={16} />
        <Stack gap={0} flex={1} miw={0}>
          <Text fz="sm" fw={500} lineClamp={1}>
            {props.candidate.title || url}
          </Text>
          <Text fz="xs" c="dimmed" lineClamp={1}>
            {domainFromUrl(url)}
          </Text>
        </Stack>
        <CheckboxIndicator checked={props.checked} size="sm" />
      </Group>
    </CheckboxCard>
  );
}

/**
 * Asks the user to confirm a "save all tabs in this window" request before the
 * background starts saving — the context-menu item is easy to hit by mistake.
 * Lists the tabs with checkboxes so individual ones can be left out.
 */
export function SaveAllConfirm(props: SaveAllConfirmProps) {
  const [selected, setSelected] = useState(
    () => new Set(props.candidates.map((candidate) => candidate.url)),
  );
  const { setViewport, maskImage, updateFade } = useScrollFade();

  const total = props.candidates.length;
  const count = selected.size;
  const allSelected = count === total;
  const noun = count === 1 ? "tab" : "tabs";

  function toggle(url: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(url);
      else next.delete(url);
      return next;
    });
  }

  function toggleAll() {
    setSelected(
      allSelected
        ? new Set()
        : new Set(props.candidates.map((candidate) => candidate.url)),
    );
  }

  function confirm() {
    // Keep the window's tab order rather than the order they were toggled.
    props.onConfirm(
      props.candidates
        .map((candidate) => candidate.url)
        .filter((url) => selected.has(url)),
    );
  }

  return (
    <Stack gap="sm" style={{ flex: 1, minHeight: 0 }}>
      <Group justify="space-between" wrap="nowrap">
        <Stack gap={0}>
          <Text fw={600} fz="sm">
            Save tabs to Semble?
          </Text>
          <Text fz="xs" c="dimmed">
            {count} of {total} selected
          </Text>
        </Stack>
        <Button variant="light" color="gray" size="xs" onClick={toggleAll}>
          {allSelected ? "Deselect all" : "Select all"}
        </Button>
      </Group>

      <ScrollArea
        type="auto"
        style={{ flex: 1, minHeight: 0 }}
        viewportRef={setViewport}
        onScrollPositionChange={updateFade}
        styles={{
          viewport: maskImage
            ? { maskImage, WebkitMaskImage: maskImage }
            : undefined,
        }}
      >
        <Stack gap="xxs">
          {props.candidates.map((candidate) => (
            <TabRow
              key={candidate.url}
              candidate={candidate}
              checked={selected.has(candidate.url)}
              onToggle={toggle}
            />
          ))}
        </Stack>
      </ScrollArea>

      <Group gap="xs" grow>
        <Button variant="light" color="gray" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button variant="filled" disabled={count === 0} onClick={confirm}>
          {count === 0 ? "Save" : `Save ${count} ${noun}`}
        </Button>
      </Group>
    </Stack>
  );
}
