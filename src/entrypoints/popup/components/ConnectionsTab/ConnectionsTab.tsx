import { Stack } from "@mantine/core";
import { useConnections } from "../../../../lib/queries";
import { InfiniteList } from "../InfiniteList";
import { ConnectionItem } from "../ConnectionItem";

/**
 * Infinite list of the current page's connections (Semble's typed links).
 * Fetches lazily the first time its tab becomes active. Read-only for now.
 */
export function ConnectionsTab({
  url,
  active,
}: {
  url: string;
  active: boolean;
}) {
  const query = useConnections(url, { enabled: active });

  return (
    <Stack gap="xs" h="100%">
      <InfiniteList
        query={query}
        getItems={(page) => page.connections}
        getKey={(item) => item.id}
        renderItem={(item) => <ConnectionItem connection={item} />}
        emptyMessage="No connections found"
      />
    </Stack>
  );
}
