import type { CollectionSummary } from "../../../../lib/library";
import { CollectionList } from "./CollectionList";

interface Props {
  /** The user's own collections. */
  collections: CollectionSummary[];
  selectedCollections: CollectionSummary[];
  selectedIds: string[];
  onToggle: (collection: CollectionSummary, checked: boolean) => void;
  onCreate: (name: string, accessType: "OPEN" | "CLOSED") => Promise<void>;
  searchOpen: boolean;
  search: string;
  onSearchChange: (value: string) => void;
}

/** The "My collections" view: the user's own collections, filtered client-side. */
export function YourCollectionsTab(props: Props) {
  const query = props.search.trim();
  const filtered = props.collections.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );
  const exactMatch = props.collections.some(
    (c) => c.name.toLowerCase() === query.toLowerCase(),
  );
  const showCreate = query !== "" && !exactMatch;

  async function handleCreate() {
    await props.onCreate(query, "CLOSED");
    props.onSearchChange("");
  }

  return (
    <CollectionList
      items={filtered}
      selectedCollections={props.selectedCollections}
      selectedIds={props.selectedIds}
      onToggle={props.onToggle}
      searchOpen={props.searchOpen}
      searchValue={props.search}
      onSearchChange={props.onSearchChange}
      searchPlaceholder="Search or create a collection…"
      onCreate={showCreate ? handleCreate : undefined}
      createLabel={`Create new collection “${query}”`}
      emptyLabel={
        props.collections.length === 0
          ? "No collections yet."
          : "No collections match."
      }
    />
  );
}
