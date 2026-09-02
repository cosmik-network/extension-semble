import type { CollectionSummary } from "../../../../lib/library";
import { useRecommendedCollections } from "../../../../lib/queries";
import { CollectionList } from "./CollectionList";

interface Props {
  /** The URL being saved — recommendations are computed against it. */
  url: string;
  selectedCollections: CollectionSummary[];
  selectedIds: string[];
  onToggle: (collection: CollectionSummary, checked: boolean) => void;
  searchOpen: boolean;
  search: string;
  onSearchChange: (value: string) => void;
}

/**
 * The "Recommended" tab: collections that contain URLs similar to the one
 * being saved, split into the user's own and open ones from the network. The
 * whole result set arrives in one response, so search just filters it
 * client-side. No create option here — recommendations are existing
 * collections by definition.
 */
export function RecommendedTab(props: Props) {
  const query = useRecommendedCollections(props.url);

  const needle = props.search.trim().toLowerCase();
  const matches = (cols: CollectionSummary[]) =>
    needle
      ? cols.filter((c) => c.name.toLowerCase().includes(needle))
      : cols;

  const myCollections = matches(query.data?.myCollections ?? []);
  const openCollections = matches(query.data?.openCollections ?? []);

  return (
    <CollectionList
      items={[...myCollections, ...openCollections]}
      sections={[
        { label: "Your collections", items: myCollections },
        { label: "Open collections", items: openCollections },
      ]}
      selectedCollections={props.selectedCollections}
      selectedIds={props.selectedIds}
      onToggle={props.onToggle}
      searchOpen={props.searchOpen}
      searchValue={props.search}
      onSearchChange={props.onSearchChange}
      searchPlaceholder="Filter recommended collections…"
      loading={query.isPending}
      emptyLabel={
        needle
          ? `No recommended collections match “${props.search.trim()}”.`
          : "No recommendations for this page yet."
      }
    />
  );
}
