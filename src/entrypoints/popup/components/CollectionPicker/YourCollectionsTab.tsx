import type { ReactNode } from "react";
import type { CollectionSummary } from "../../../../lib/library";
import { useMyCollectionSearch } from "../../../../lib/queries";
import { CollectionList } from "./CollectionList";
import { useCreateOption } from "./useCreateOption";
import { useDebouncedSearch } from "./useDebouncedSearch";

interface Props {
  /** The user's own collections. */
  collections: CollectionSummary[];
  selectedCollections: CollectionSummary[];
  selectedIds: string[];
  onToggle: (collection: CollectionSummary, checked: boolean) => void;
  onCreate: (name: string, accessType: "OPEN" | "CLOSED") => Promise<void>;
  /** Scope pills, rendered between the search field and the rows. */
  scopeSelector: ReactNode;
  search: string;
  onSearchChange: (value: string) => void;
}

/**
 * The "My collections" view: shows the user's own collections, and switches to
 * a debounced server-side search across all of them (name and description)
 * when the user types — the local list is only the first page, so filtering it
 * client-side would miss collections.
 */
export function YourCollectionsTab(props: Props) {
  const { trimmed, searching } = useDebouncedSearch(props.search);

  const searchQuery = useMyCollectionSearch({
    searchText: trimmed,
    enabled: searching,
  });

  const items = searching ? (searchQuery.data ?? []) : props.collections;
  const loading = searching && searchQuery.isPending;

  const { query, showCreate, handleCreate } = useCreateOption({
    search: props.search,
    items,
    selectedCollections: props.selectedCollections,
    accessType: "CLOSED",
    onCreate: props.onCreate,
    onSearchChange: props.onSearchChange,
  });

  return (
    <CollectionList
      items={items}
      selectedCollections={props.selectedCollections}
      selectedIds={props.selectedIds}
      onToggle={props.onToggle}
      scopeSelector={props.scopeSelector}
      searchValue={props.search}
      onSearchChange={props.onSearchChange}
      searchPlaceholder="Search or create a collection…"
      onCreate={showCreate ? handleCreate : undefined}
      createLabel={`Create new collection “${query}”`}
      loading={loading}
      error={searching ? searchQuery.error : undefined}
      emptyLabel={
        searching ? `No collections match “${query}”.` : "No collections yet."
      }
    />
  );
}
