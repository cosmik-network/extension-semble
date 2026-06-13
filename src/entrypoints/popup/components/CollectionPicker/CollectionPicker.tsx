import { useState } from "react";
import {
  ActionIcon,
  Group,
  SegmentedControl,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import { FiSearch } from "react-icons/fi";
import { FaSeedling } from "react-icons/fa";
import type { CollectionSummary } from "../../../../lib/library";
import { YourCollectionsTab } from "./YourCollectionsTab";
import { OpenCollectionsTab } from "./OpenCollectionsTab";

interface Props {
  /** The user's own collections (the "My collections" scope). */
  collections: CollectionSummary[];
  /** Summaries of every currently-selected collection (across both scopes). */
  selectedCollections: CollectionSummary[];
  selectedIds: string[];
  onToggle: (collection: CollectionSummary, checked: boolean) => void;
  onCreate: (name: string, accessType: "OPEN" | "CLOSED") => Promise<void>;
}

type Scope = "your" | "open";

function Seedling() {
  return (
    <ThemeIcon variant="light" radius="xl" size="xs" color="green">
      <FaSeedling size={8} />
    </ThemeIcon>
  );
}

/**
 * Picks the collections a URL belongs to. A segmented control switches the
 * visible scope — "My collections" (the user's own) or "Open collections"
 * (community collections anyone can add to) — defaulting to My collections,
 * with a search toggle beside it. Selection and the search field are shared
 * across scopes.
 */
export function CollectionPicker(props: Props) {
  const [scope, setScope] = useState<Scope>("your");
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  function changeScope(value: string) {
    setScope(value as Scope);
    setSearch("");
  }

  function toggleSearch() {
    setSearchOpen((open) => {
      if (open) setSearch(""); // clear the query when hiding the field
      return !open;
    });
  }

  return (
    <Stack gap="xs">
      <Group gap="xs" wrap="nowrap">
        <SegmentedControl
          size="sm"
          radius="md"
          value={scope}
          onChange={changeScope}
          style={{ flex: 1 }}
          data={[
            { value: "your", label: "My collections" },
            {
              value: "open",
              label: (
                <Group gap={6} wrap="nowrap" justify="center">
                  <Seedling />
                  Open collections
                </Group>
              ),
            },
          ]}
        />
        <ActionIcon
          variant={searchOpen ? "filled" : "light"}
          color="gray"
          size={36}
          radius="md"
          aria-label={searchOpen ? "Hide search" : "Search collections"}
          onClick={toggleSearch}
        >
          <FiSearch size={16} />
        </ActionIcon>
      </Group>

      {scope === "your" ? (
        <YourCollectionsTab
          collections={props.collections}
          selectedCollections={props.selectedCollections}
          selectedIds={props.selectedIds}
          onToggle={props.onToggle}
          onCreate={props.onCreate}
          searchOpen={searchOpen}
          search={search}
          onSearchChange={setSearch}
        />
      ) : (
        <OpenCollectionsTab
          selectedCollections={props.selectedCollections}
          selectedIds={props.selectedIds}
          onToggle={props.onToggle}
          onCreate={props.onCreate}
          searchOpen={searchOpen}
          search={search}
          onSearchChange={setSearch}
        />
      )}
    </Stack>
  );
}
