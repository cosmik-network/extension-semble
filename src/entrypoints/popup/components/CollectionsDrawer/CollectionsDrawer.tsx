import { useUrlCollections } from "../../../../lib/queries";
import { BottomDrawer } from "../BottomDrawer";
import { InfiniteList } from "../InfiniteList";
import { CollectionItem } from "./CollectionItem";
import { CollectionItemSkeleton } from "./Skeleton.CollectionItem";

/**
 * Bottom sheet listing the collections that contain the URL. Collections are
 * only fetched once the drawer opens.
 */
export function CollectionsDrawer(props: {
  url: string;
  opened: boolean;
  onClose: () => void;
}) {
  const query = useUrlCollections(props.url, { enabled: props.opened });

  return (
    <BottomDrawer
      title="In collections"
      opened={props.opened}
      onClose={props.onClose}
    >
      <InfiniteList
        query={query}
        getItems={(page) => page.collections}
        getKey={(collection) => collection.id}
        renderItem={(collection) => <CollectionItem collection={collection} />}
        emptyMessage="This isn't in any collections yet."
        renderSkeleton={() => <CollectionItemSkeleton />}
        skeletonCount={3}
      />
    </BottomDrawer>
  );
}
