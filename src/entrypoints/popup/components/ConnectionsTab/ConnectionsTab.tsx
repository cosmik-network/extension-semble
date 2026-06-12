import { useState } from "react";
import { Alert, Box, Button, Stack } from "@mantine/core";
import { useTimeout } from "@mantine/hooks";
import { FiCheck, FiPlus } from "react-icons/fi";
import { useConnections } from "../../../../lib/queries";
import { InfiniteList } from "../InfiniteList";
import { ConnectionItem } from "../ConnectionItem";
import { ConnectionComposer } from "../ConnectionComposer";

/** How long the "Connection created" confirmation stays up before fading. */
const CONFIRMATION_MS = 2500;

/**
 * Infinite list of the current page's connections (Semble's typed links).
 * Opening the composer replaces the list (and its trigger) with the form,
 * which gets the full tab height and scrolls if it outgrows it. Fetches
 * lazily the first time its tab becomes active.
 */
export function ConnectionsTab(props: { url: string; active: boolean }) {
  const query = useConnections(props.url, { enabled: props.active });
  const [composerOpen, setComposerOpen] = useState(false);
  const [created, setCreated] = useState(false);

  // Auto-dismiss the confirmation; restarted on each successful create.
  const hideConfirmation = useTimeout(() => setCreated(false), CONFIRMATION_MS);

  function handleCreated() {
    setComposerOpen(false);
    setCreated(true);
    hideConfirmation.clear();
    hideConfirmation.start();
  }

  if (composerOpen) {
    // The composer fills the tab and manages its own scroll (fields scroll,
    // buttons pinned). Keyed by URL so a sidepanel navigation can't submit a
    // stale target; unmounting on close resets the form for the next open.
    return (
      <ConnectionComposer
        key={props.url}
        url={props.url}
        onClose={() => setComposerOpen(false)}
        onCreated={handleCreated}
      />
    );
  }

  return (
    <Stack gap="xs" h="100%">
      {created && (
        <Alert
          color="green"
          variant="light"
          icon={<FiCheck size={16} />}
          py="xs"
          withCloseButton
          onClose={() => setCreated(false)}
          style={{ flexShrink: 0 }}
        >
          Connection created
        </Alert>
      )}

      {/* Flex wrapper so the trigger stays pinned to the bottom even when the
          list is empty/pending (those states don't grow on their own). */}
      <Box
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <InfiniteList
          query={query}
          getItems={(page) => page.connections}
          getKey={(item) => item.id}
          renderItem={(item) => <ConnectionItem connection={item} />}
          emptyMessage="No connections found"
        />
      </Box>

      <Button
        radius="md"
        color="green"
        leftSection={<FiPlus size={14} />}
        onClick={() => setComposerOpen(true)}
        style={{ flexShrink: 0 }}
      >
        Add connection
      </Button>
    </Stack>
  );
}
