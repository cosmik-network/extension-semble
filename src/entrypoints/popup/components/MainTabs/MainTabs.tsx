import { Card, Scroller, Stack, Tabs } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import type { CollectionSummary, UrlState } from "../../../../lib/library";
import { useUrlStats } from "../../../../lib/queries";
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
// Each tab grows to share the width equally, but never shrinks below its label
// (min-width: auto) — so when they don't all fit, the Scroller scrolls instead.
const TAB_STYLE = { flex: 1 } as const;

/**
 * The signed-in view for a supported page: the URL preview card plus the
 * Add-or-Update / Related / Connections tabs. Persists the last-used tab
 * across popup opens.
 */
export function MainTabs(props: MainTabsProps) {
  const [activeTab, setActiveTab] = useLocalStorage({
    key: "semble:last-tab",
    defaultValue: "save",
    getInitialValueInEffect: false,
  });
  // Loads independently of the URL state so the tabs never wait on it.
  const statsQuery = useUrlStats(props.url);

  return (
    <Stack gap="sm" style={PANEL_STYLE}>
      {/* Fixed header — sits over the banner background. */}
      <Card p={0} bg="transparent">
        <UrlCard
          metadata={props.urlState.metadata}
          inLibrary={!!props.urlState.cardId}
          // Only this level can tell "still loading" from "the API returned
          // none" — the row reserves space for the first, and is skipped for
          // the second (and for an outright failure).
          stats={statsQuery.isPending ? "pending" : (statsQuery.data ?? undefined)}
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
        {/* Scroller inside the list (mirrors the semble web app): the tab strip
            scrolls horizontally instead of wrapping when labels don't fit. The
            content stretches to full width so the tabs can grow to fill it. */}
        <Tabs.List style={{ flexWrap: "nowrap" }}>
          <Scroller
            style={{ flex: 1, minWidth: 0 }}
            styles={{ content: { display: "flex", minWidth: "100%" } }}
          >
            <Tabs.Tab value="save" style={TAB_STYLE}>
              {props.urlState.cardId ? "Update" : "Add"}
            </Tabs.Tab>
            <Tabs.Tab value="related" style={TAB_STYLE}>
              Related
            </Tabs.Tab>
            <Tabs.Tab value="connections" style={TAB_STYLE}>
              Connections
            </Tabs.Tab>
          </Scroller>
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
