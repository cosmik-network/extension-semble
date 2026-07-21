import { LuLibrary } from "react-icons/lu";
import { useUrlSavers } from "../../../../lib/queries";
import { BottomDrawer } from "../BottomDrawer";
import { InfiniteList } from "../InfiniteList";
import { SaverItem } from "./SaverItem";
import { SaverItemSkeleton } from "./Skeleton.SaverItem";

/**
 * Bottom sheet listing everyone who saved the URL. Savers are only fetched
 * once the drawer opens.
 */
export function SaversDrawer(props: {
  url: string;
  opened: boolean;
  onClose: () => void;
}) {
  const query = useUrlSavers(props.url, { enabled: props.opened });

  return (
    <BottomDrawer
      title="Saved by"
      opened={props.opened}
      onClose={props.onClose}
    >
      <InfiniteList
        query={query}
        getItems={(page) => page.savers}
        getKey={(saver) => saver.id}
        renderItem={(saver) => <SaverItem saver={saver} />}
        emptyMessage="No one has added this to their library yet"
        emptyIcon={LuLibrary}
        renderSkeleton={() => <SaverItemSkeleton />}
      />
    </BottomDrawer>
  );
}
