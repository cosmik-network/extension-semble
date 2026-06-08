import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import {
  Button,
  CheckboxCard,
  CheckboxIndicator,
  CloseButton,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import type { CollectionSummary } from "../../../../lib/library";
import { useScrollFade } from "../../hooks/useScrollFade";
import classes from "./CollectionPicker.module.css";

interface Props {
  collections: CollectionSummary[];
  selectedIds: string[];
  onToggle: (id: string, checked: boolean) => void;
  onCreate: (name: string) => Promise<void>;
}

export function CollectionPicker(props: Props) {
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  const { setViewport, maskImage, updateFade } = useScrollFade();

  const query = search.trim();
  const filtered = props.collections.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );
  const exactMatch = props.collections.some(
    (c) => c.name.toLowerCase() === query.toLowerCase(),
  );
  const showCreate = query !== "" && !exactMatch;

  async function handleCreate() {
    if (!query || creating) return;
    setCreating(true);
    try {
      await props.onCreate(query);
      setSearch("");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Stack gap="xs">
      {/*<Text size="sm" fw={500}>
        Collections
      </Text>*/}

      <TextInput
        variant="filled"
        size="sm"
        placeholder="Search or create a collection…"
        value={search}
        rightSection={
          <CloseButton
            aria-label="Clear input"
            onClick={() => setSearch("")}
            style={{ display: search ? undefined : "none" }}
          />
        }
        onChange={(e) => setSearch(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && showCreate) handleCreate();
        }}
      />

      <ScrollArea.Autosize
        mah={180}
        viewportRef={setViewport}
        onScrollPositionChange={updateFade}
        styles={{
          viewport: maskImage
            ? { maskImage, WebkitMaskImage: maskImage }
            : undefined,
        }}
      >
        <Stack gap={"xxs"}>
          {showCreate && (
            <Button
              variant="light"
              color="grape"
              size="sm"
              fullWidth
              justify="flex-start"
              leftSection={<FiPlus />}
              radius={"md"}
              loading={creating}
              onClick={handleCreate}
            >
              Create new collection “{query}”
            </Button>
          )}

          {filtered.length === 0 && !showCreate && (
            <Text size="xs" c="dimmed">
              {props.collections.length === 0
                ? "No collections yet."
                : "No collections match."}
            </Text>
          )}

          {filtered.map((col) => {
            const checked = props.selectedIds.includes(col.id);
            return (
              <CheckboxCard
                key={col.id}
                className={classes.root}
                p={"xs"}
                radius={"lg"}
                value={col.id}
                checked={checked}
                onChange={(value) => props.onToggle(col.id, value)}
              >
                <Group justify="space-between" wrap="nowrap" gap="xs">
                  <Text size="sm" fw={500} lineClamp={1} flex={1}>
                    {col.name}
                  </Text>
                  <CheckboxIndicator checked={checked} size="sm" />
                </Group>
              </CheckboxCard>
            );
          })}
        </Stack>
      </ScrollArea.Autosize>
    </Stack>
  );
}
