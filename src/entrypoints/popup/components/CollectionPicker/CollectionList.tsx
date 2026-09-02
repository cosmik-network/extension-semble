import { Fragment, useState, type ReactNode } from "react";
import { FiPlus } from "react-icons/fi";
import { FaSeedling } from "react-icons/fa";
import {
  Button,
  CheckboxCard,
  CheckboxIndicator,
  CloseButton,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import type { CollectionSummary } from "../../../../lib/library";
import { useScrollFade } from "../../hooks/useScrollFade";
import classes from "./CollectionPicker.module.css";

interface Section {
  label: string;
  items: CollectionSummary[];
}

interface Props {
  /** Candidate collections for the main (unselected) list. */
  items: CollectionSummary[];
  /**
   * Optional labeled groupings of `items` (e.g. the Recommended tab's "Your
   * collections" / "Open collections"). When provided, the candidate list is
   * rendered per section with a dimmed header above each non-empty one.
   */
  sections?: Section[];
  /** All currently-selected collections — pinned at the top, always checked. */
  selectedCollections: CollectionSummary[];
  selectedIds: string[];
  onToggle: (collection: CollectionSummary, checked: boolean) => void;
  /** Whether the search field is revealed (toggled from the picker). */
  searchOpen: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  /** Provided only when the query can be created — renders the create button. */
  onCreate?: () => Promise<void>;
  createLabel?: ReactNode;
  /** Server-side fetch/search in flight (open tab). */
  loading?: boolean;
  emptyLabel: string;
}

function CollectionRow(props: {
  collection: CollectionSummary;
  checked: boolean;
  onToggle: (collection: CollectionSummary, checked: boolean) => void;
}) {
  const col = props.collection;
  return (
    <CheckboxCard
      className={classes.root}
      p="xs"
      radius="lg"
      value={col.id}
      checked={props.checked}
      onChange={(value) => props.onToggle(col, value)}
    >
      <Group justify="space-between" wrap="nowrap" gap="xs">
        <Group gap={6} wrap="nowrap" flex={1} miw={0}>
          {col.accessType === "OPEN" && (
            <ThemeIcon variant="light" radius="xl" size="xs" color="green">
              <FaSeedling size={10} />
            </ThemeIcon>
          )}
          <Text size="sm" fw={500} lineClamp={1}>
            {col.name}
          </Text>
        </Group>
        <CheckboxIndicator checked={props.checked} size="sm" />
      </Group>
    </CheckboxCard>
  );
}

/**
 * Presentational collection list shared by both picker tabs: a search box, an
 * optional inline "create" button, a pinned section of selected collections
 * (so they stay visible/uncheckable even when filtered or searched away), and
 * the remaining candidates. The owning tab supplies the items, the search
 * wiring, and the create action.
 */
export function CollectionList(props: Props) {
  const [creating, setCreating] = useState(false);
  const { setViewport, maskImage, updateFade } = useScrollFade();

  const selectedIdSet = new Set(props.selectedIds);
  // Selected collections are pinned above, so drop them from the candidates.
  const sections = (props.sections ?? [{ label: "", items: props.items }])
    .map((s) => ({
      ...s,
      items: s.items.filter((c) => !selectedIdSet.has(c.id)),
    }))
    .filter((s) => s.items.length > 0);
  const hasSelected = props.selectedCollections.length > 0;
  const isEmpty = !props.loading && !hasSelected && sections.length === 0;

  async function handleCreate() {
    if (creating || !props.onCreate) return;
    setCreating(true);
    try {
      await props.onCreate();
    } finally {
      setCreating(false);
    }
  }

  return (
    // minHeight: 0 down to the scroll area lets the list shrink below 180px
    // when the tab runs out of room (e.g. search open), instead of pushing
    // the note below the fold.
    <Stack gap="xs" style={{ minHeight: 0 }}>
      {props.searchOpen && (
        <TextInput
          autoFocus
          variant="filled"
          size="sm"
          placeholder={props.searchPlaceholder}
          value={props.searchValue}
          rightSection={
            <CloseButton
              aria-label="Clear input"
              onClick={() => props.onSearchChange("")}
              style={{ display: props.searchValue ? undefined : "none" }}
            />
          }
          onChange={(e) => props.onSearchChange(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && props.onCreate) void handleCreate();
          }}
        />
      )}

      <ScrollArea.Autosize
        mah={180}
        style={{ minHeight: 0 }}
        viewportRef={setViewport}
        onScrollPositionChange={updateFade}
        styles={{
          viewport: maskImage
            ? { maskImage, WebkitMaskImage: maskImage }
            : undefined,
        }}
      >
        <Stack gap="xxs">
          {props.onCreate && (
            <Button
              variant="light"
              color="grape"
              size="sm"
              fullWidth
              justify="flex-start"
              leftSection={<FiPlus />}
              radius="md"
              loading={creating}
              onClick={() => void handleCreate()}
            >
              {props.createLabel}
            </Button>
          )}

          {props.loading && (
            <Group justify="center" py="xs">
              <Loader size="sm" color="gray" />
            </Group>
          )}

          {props.selectedCollections.map((col) => (
            <CollectionRow
              key={col.id}
              collection={col}
              checked
              onToggle={props.onToggle}
            />
          ))}

          {sections.map((section) => (
            <Fragment key={section.label}>
              {section.label && (
                <Text size="xs" c="dimmed" fw={500} mt={4}>
                  {section.label}
                </Text>
              )}
              {section.items.map((col) => (
                <CollectionRow
                  key={col.id}
                  collection={col}
                  checked={false}
                  onToggle={props.onToggle}
                />
              ))}
            </Fragment>
          ))}

          {isEmpty && !props.onCreate && (
            <Text size="xs" c="dimmed">
              {props.emptyLabel}
            </Text>
          )}
        </Stack>
      </ScrollArea.Autosize>
    </Stack>
  );
}
