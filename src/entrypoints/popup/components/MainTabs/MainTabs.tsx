import { Card, Stack, Tabs } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import type { CollectionSummary, UrlState } from "../../../../lib/library";
import { UrlCard } from "../UrlCard";
import { ManageTab } from "../ManageTab";
import { RelatedTab } from "../RelatedTab";
import { ConnectionsTab } from "../ConnectionsTab";

interface MainTabsProps {
  url: string;
  urlState: UrlState;
  collections: CollectionSummary[];
}

const PANEL_STYLE = { flex: 1, minHeight: 0 } as const;

/**
 * The signed-in view for a supported page: the URL preview card plus the
 * Manage / Related / Connections tabs. Persists the last-used tab across popup
 * opens.
 */
export function MainTabs(props: MainTabsProps) {
  const [activeTab, setActiveTab] = useLocalStorage({
    key: "semble:last-tab",
    defaultValue: "save",
    getInitialValueInEffect: false,
  });

  return (
    <Stack gap="sm" style={PANEL_STYLE}>
      {/* Fixed header — sits over the banner background. */}
      <Card p={0} bg="transparent">
        <UrlCard
          metadata={props.urlState.metadata}
          inLibrary={!!props.urlState.cardId}
        />
      </Card>

      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value ?? "save")}
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tabs.List grow>
          <Tabs.Tab value="save">Manage</Tabs.Tab>
          <Tabs.Tab value="related">Related</Tabs.Tab>
          <Tabs.Tab value="connections">Connections</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="save" pt="sm" style={PANEL_STYLE}>
          {/* Keyed by card id so local edits reset when the card is
              added/removed (the fresh server state becomes the baseline). */}
          <ManageTab
            key={props.urlState.cardId ?? "unsaved"}
            url={props.url}
            urlState={props.urlState}
            collections={props.collections}
          />
        </Tabs.Panel>

        <Tabs.Panel value="related" pt="sm" keepMounted style={PANEL_STYLE}>
          <RelatedTab url={props.url} active={activeTab === "related"} />
        </Tabs.Panel>

        <Tabs.Panel value="connections" pt="sm" keepMounted style={PANEL_STYLE}>
          <ConnectionsTab url={props.url} active={activeTab === "connections"} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
