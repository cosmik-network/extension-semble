import { useState } from "react";
import { Stack } from "@mantine/core";
import type { CollectionSummary } from "../../../../lib/library";
import { YourCollectionsTab } from "./YourCollectionsTab";
import { RecommendedTab } from "./RecommendedTab";
import { OpenCollectionsTab } from "./OpenCollectionsTab";
import { ScopePills, type Scope } from "./ScopePills";

interface Props {
  /** The URL being saved — drives the Recommended scope. */
  url: string;
  /** The user's own collections (the "My collections" scope). */
  collections: CollectionSummary[];
  /** Summaries of every currently-selected collection (across all scopes). */
  selectedCollections: CollectionSummary[];
  selectedIds: string[];
  onToggle: (collection: CollectionSummary, checked: boolean) => void;
  onCreate: (name: string, accessType: "OPEN" | "CLOSED") => Promise<void>;
}

/**
 * Picks the collections a URL belongs to: a search field (filter, or type a
 * new name to create), the scope pills — "My collections" (the user's own),
 * "Recommended" (collections holding URLs similar to this one), or "Open
 * collections" (community collections anyone can add to) — and the list for
 * the active scope. Selection is shared across scopes; the query resets when
 * the scope changes.
 */
export function CollectionPicker(props: Props) {
  const [scope, setScope] = useState<Scope>("your");
  const [search, setSearch] = useState("");

  function changeScope(next: Scope) {
    setScope(next);
    setSearch("");
  }

  // Each scope owns its search wiring (placeholder, Enter-to-create), so the
  // list renders the pills between the field and the rows.
  const pills = <ScopePills value={scope} onChange={changeScope} />;

  return (
    // flex: 1 makes the picker absorb all free space; minHeight: 0 lets it
    // shrink below content height so the list scrolls instead of pushing the
    // note/buttons below the fold.
    <Stack gap="xs" style={{ flex: 1, minHeight: 0 }}>
      {scope === "your" ? (
        <YourCollectionsTab
          collections={props.collections}
          selectedCollections={props.selectedCollections}
          selectedIds={props.selectedIds}
          onToggle={props.onToggle}
          onCreate={props.onCreate}
          scopeSelector={pills}
          search={search}
          onSearchChange={setSearch}
        />
      ) : scope === "recommended" ? (
        <RecommendedTab
          url={props.url}
          selectedCollections={props.selectedCollections}
          selectedIds={props.selectedIds}
          onToggle={props.onToggle}
          scopeSelector={pills}
          search={search}
          onSearchChange={setSearch}
        />
      ) : (
        <OpenCollectionsTab
          selectedCollections={props.selectedCollections}
          selectedIds={props.selectedIds}
          onToggle={props.onToggle}
          onCreate={props.onCreate}
          scopeSelector={pills}
          search={search}
          onSearchChange={setSearch}
        />
      )}
    </Stack>
  );
}
