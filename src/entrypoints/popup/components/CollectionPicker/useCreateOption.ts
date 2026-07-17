import type {
  CollectionAccessType,
  CollectionSummary,
} from "../../../../lib/library";

/**
 * The inline "Create new collection" row: offered when the (undebounced, so it
 * stays responsive while typing) query names no visible or selected
 * collection. Creating clears the search so the new collection is shown.
 */
export function useCreateOption(input: {
  search: string;
  items: CollectionSummary[];
  selectedCollections: CollectionSummary[];
  accessType: CollectionAccessType;
  onCreate: (name: string, accessType: CollectionAccessType) => Promise<void>;
  onSearchChange: (value: string) => void;
}) {
  const query = input.search.trim();
  const exactMatch = [...input.selectedCollections, ...input.items].some(
    (c) => c.name.toLowerCase() === query.toLowerCase(),
  );
  const showCreate = query !== "" && !exactMatch;

  async function handleCreate() {
    await input.onCreate(query, input.accessType);
    input.onSearchChange("");
  }

  return { query, showCreate, handleCreate };
}
