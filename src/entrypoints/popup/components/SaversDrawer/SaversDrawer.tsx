import { Drawer } from "@mantine/core";
import { useUrlSavers } from "../../../../lib/queries";
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
    <Drawer
      opened={props.opened}
      onClose={props.onClose}
      title="Saved by"
      position="bottom"
      size="75%"
      radius="lg"
      padding="xs"
      styles={{
        title: { fontWeight: 600 },
        content: { display: "flex", flexDirection: "column" },
        body: {
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <InfiniteList
        query={query}
        getItems={(page) => page.savers}
        getKey={(saver) => saver.id}
        renderItem={(saver) => <SaverItem saver={saver} />}
        emptyMessage="No one has saved this yet."
        renderSkeleton={() => <SaverItemSkeleton />}
      />
    </Drawer>
  );
}
