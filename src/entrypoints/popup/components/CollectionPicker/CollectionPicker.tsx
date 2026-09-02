import { useState } from "react";
import {
  ActionIcon,
  Group,
  ScrollArea,
  SegmentedControl,
  Stack,
  ThemeIcon,
} from "@mantine/core";
import { FiSearch } from "react-icons/fi";
import { FaSeedling } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import type { CollectionSummary } from "../../../../lib/library";
import { YourCollectionsTab } from "./YourCollectionsTab";
import { RecommendedTab } from "./RecommendedTab";
import { OpenCollectionsTab } from "./OpenCollectionsTab";

interface Props {
  /** The URL being saved — drives the Recommended scope. */
  url: string;
  /** The user's own collections (the "My collections" scope). */
  collections: CollectionSummary[];
  /** Summaries of every currently-selected collection (across both scopes). */
  selectedCollections: CollectionSummary[];
  selectedIds: string[];
  onToggle: (collection: CollectionSummary, checked: boolean) => void;
  onCreate: (name: string, accessType: "OPEN" | "CLOSED") => Promise<void>;
}

type Scope = "your" | "recommended" | "open";

function Seedling() {
  return (
    <ThemeIcon variant="light" radius="xl" size="xs" color="green">
      <FaSeedling size={8} />
    </ThemeIcon>
  );
}

function Sparkles() {
  return (
    <ThemeIcon variant="light" radius="xl" size="xs" color="blue">
      <HiSparkles size={8} />
    </ThemeIcon>
  );
}

/**
 * Picks the collections a URL belongs to. A segmented control switches the
 * visible scope — "My collections" (the user's own), "Recommended"
 * (collections holding URLs similar to this one), or "Open collections"
 * (community collections anyone can add to) — defaulting to the user's own,
 * with a search toggle beside it. The segments overflow the popup width, so
 * the control scrolls horizontally. Selection and the search field are shared
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
    // flex: 1 makes the picker absorb all free space (so toggling the search
    // field eats into that slack instead of moving the note/buttons below);
    // minHeight: 0 lets it shrink below content height so the list scrolls.
    <Stack gap="xs" style={{ flex: 1, minHeight: 0 }}>
      <Group gap="xs" wrap="nowrap">
        {/* The three segments overflow the popup width, so the control lives
            in a horizontal scroller (scrollbar hidden) with the search button
            pinned outside it. */}
        <ScrollArea
          type="never"
          scrollbars="x"
          style={{ flex: 1, minWidth: 0 }}
        >
          <SegmentedControl
            size="sm"
            radius="md"
            value={scope}
            onChange={changeScope}
            data={[
              { value: "your", label: "My collections" },
              {
                value: "recommended",
                label: (
                  <Group gap={6} wrap="nowrap" justify="center">
                    <Sparkles />
                    Recommended
                  </Group>
                ),
              },
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
        </ScrollArea>
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
      ) : scope === "recommended" ? (
        <RecommendedTab
          url={props.url}
          selectedCollections={props.selectedCollections}
          selectedIds={props.selectedIds}
          onToggle={props.onToggle}
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
