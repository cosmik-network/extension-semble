import { Fragment, useState, type ReactNode } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { FaSeedling } from "react-icons/fa";
import {
  Button,
  Center,
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
import { describeError } from "../../../../lib/errors";
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
  /** Scope pills, rendered between the search field and the rows. */
  scopeSelector: ReactNode;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  /** Provided only when the query can be created — renders the create button. */
  onCreate?: () => Promise<void>;
  createLabel?: ReactNode;
  /** Server-side fetch/search in flight (open tab). */
  loading?: boolean;
  /** A failed fetch/search — shown in place of the empty message. */
  error?: unknown;
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
 * Presentational collection list shared by the picker's scopes: the search
 * box, the scope pills beneath it, an optional inline "create" button, a
 * pinned section of selected collections
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
  const hasRows = !!props.onCreate || hasSelected || sections.length > 0;
  // With a create option the query names a collection to make, so "no
  // matches" would only restate the obvious.
  const showMessage = !props.loading && !hasRows;

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
    // when the tab runs out of room, instead of pushing the note below the
    // fold.
    <Stack gap="xs" style={{ flex: 1, minHeight: 0 }}>
      <TextInput
        variant="filled"
        size="sm"
        placeholder={props.searchPlaceholder}
        value={props.searchValue}
        leftSection={<FiSearch size={16} />}
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

      {props.scopeSelector}

      {hasRows && (
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
          </Stack>
        </ScrollArea.Autosize>
      )}

      {/* The loader and the empty/error message sit centered in whatever room is
          left below the rows (the whole list region when there are none). */}
      {(props.loading || showMessage) && (
        <Center style={{ flex: 1 }} py="xs">
          {props.loading ? (
            <Loader size="sm" color="gray" />
          ) : props.error ? (
            <Text size="sm" c="red" ta="center">
              {describeError(props.error)}
            </Text>
          ) : (
            <Text size="sm" c="dimmed" ta="center">
              {props.emptyLabel}
            </Text>
          )}
        </Center>
      )}
    </Stack>
  );
}
