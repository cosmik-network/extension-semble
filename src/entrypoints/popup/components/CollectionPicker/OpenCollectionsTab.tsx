import type { ReactNode } from "react";
import type { CollectionSummary } from "../../../../lib/library";
import {
  useCollectionSearch,
  useMyProfile,
  useOpenCollections,
} from "../../../../lib/queries";
import { CollectionList } from "./CollectionList";
import { useCreateOption } from "./useCreateOption";
import { useDebouncedSearch } from "./useDebouncedSearch";

interface Props {
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
 * The "Open collections" tab: defaults to the open collections the user has
 * contributed to, and switches to a debounced server-wide search across all
 * open collections when the user types. Falls back to browsing all open
 * collections when the user has no contributed ones yet. Creating here makes an
 * OPEN collection.
 */
export function OpenCollectionsTab(props: Props) {
  const profile = useMyProfile();
  const identifier = profile.data?.id;

  const { trimmed, searching } = useDebouncedSearch(props.search);

  const contributedQuery = useOpenCollections(identifier);
  const contributed = contributedQuery.data ?? [];
  const noContributed = contributedQuery.isSuccess && contributed.length === 0;

  // Search all open collections while typing, or browse them all as a fallback
  // when the user hasn't contributed to any open collection yet.
  const searchQuery = useCollectionSearch({
    searchText: trimmed,
    accessType: "OPEN",
    enabled: searching || noContributed,
  });
  const searchResults = searchQuery.data ?? [];

  const items = searching || noContributed ? searchResults : contributed;
  const loading = searching
    ? searchQuery.isPending
    : !identifier ||
      contributedQuery.isPending ||
      (noContributed && searchQuery.isPending);

  const { query, showCreate, handleCreate } = useCreateOption({
    search: props.search,
    items,
    selectedCollections: props.selectedCollections,
    accessType: "OPEN",
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
      searchPlaceholder="Search open collections…"
      onCreate={showCreate ? handleCreate : undefined}
      createLabel={`Create new open collection “${query}”`}
      loading={loading}
      error={
        searching || noContributed ? searchQuery.error : contributedQuery.error
      }
      emptyLabel={
        searching
          ? `No open collections match “${query}”.`
          : "No open collections yet."
      }
    />
  );
}
