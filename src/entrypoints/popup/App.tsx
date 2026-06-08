import { useState } from "react";
import { Alert, Button, Card, Center, Loader, Stack, Text } from "@mantine/core";
import { isSupportedUrl } from "../../lib/activeTab";
import { useApiKey } from "../../lib/hooks";
import { useMyCollections, useMyProfile, useUrlState } from "../../lib/queries";
import { useActiveTabUrl } from "./hooks/useActiveTabUrl";
import { ApiKeyForm } from "./components/ApiKeyForm";
import { AppHeader } from "./components/AppHeader";
import { MainTabs } from "./components/MainTabs";
import { SearchTab } from "./components/SearchTab";
import headerBg from "../../assets/semble-header-bg.webp";

type Phase = "loading" | "no-key" | "unsupported" | "error" | "ready";

function App() {
  const [activeTab, setActiveTab] = useState("save");
  const [searching, setSearching] = useState(false);

  const tabUrl = useActiveTabUrl();
  const profile = useMyProfile();
  const hasKey = !!useApiKey();

  const supported = isSupportedUrl(tabUrl.data ?? undefined);
  const url = supported ? tabUrl.data! : "";

  // Disabled (and left pending) until the URL is known and a key exists.
  const urlState = useUrlState(url);
  const collections = useMyCollections();

  const phase: Phase = !hasKey
    ? "no-key"
    : tabUrl.isPending
      ? "loading"
      : !supported
        ? "unsupported"
        : urlState.isError || collections.isError
          ? "error"
          : urlState.isPending || collections.isPending
            ? "loading"
            : "ready";

  // A definite height is required for the inner scroll regions to bound and
  // scroll. Loading/ready and the search view share one height so the popup
  // doesn't jump; shorter states (sign-in, unsupported, error) size to content.
  const fixedHeight = searching || phase === "loading" || phase === "ready";

  return (
    <Card
      w={360}
      p="xs"
      radius="xs"
      style={{
        position: "relative",
        // Own stacking context so the banner's negative z-index stays scoped
        // (above the card background, below the content).
        zIndex: 0,
        display: "flex",
        flexDirection: "column",
        height: fixedHeight ? 590 : undefined,
      }}
    >
      <Banner />

      <AppHeader
        searching={searching}
        onOpenSearch={() => setSearching(true)}
        onBack={() => setSearching(false)}
        profile={profile.data}
        hasKey={hasKey}
      />

      {searching ? (
        <Stack gap="sm" style={{ flex: 1, minHeight: 0 }}>
          <SearchTab active />
        </Stack>
      ) : (
        <MainContent
          phase={phase}
          url={url}
          urlState={urlState}
          collections={collections}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </Card>
  );
}

interface MainContentProps {
  phase: Phase;
  url: string;
  urlState: ReturnType<typeof useUrlState>;
  collections: ReturnType<typeof useMyCollections>;
  activeTab: string;
  onTabChange: (value: string) => void;
}

/** The non-search ("main") body: one block per {@link Phase}. */
function MainContent(props: MainContentProps) {
  const { phase, urlState, collections } = props;

  if (phase === "loading") return <LoadingState />;

  if (phase === "no-key") return <ApiKeyForm />;

  if (phase === "unsupported") {
    return (
      <Text size="sm" c="dimmed">
        This page can't be saved to Semble. Open a regular web page and try
        again.
      </Text>
    );
  }

  if (phase === "error") {
    return (
      <Stack gap="xs">
        <Alert color="red" variant="light">
          {(urlState.error ?? collections.error)?.message ??
            "Something went wrong."}
        </Alert>
        <Button
          variant="light"
          onClick={() => {
            void urlState.refetch();
            void collections.refetch();
          }}
        >
          Retry
        </Button>
      </Stack>
    );
  }

  // "ready" — both queries have resolved.
  if (!urlState.data || !collections.data) return null;
  return (
    <MainTabs
      url={props.url}
      urlState={urlState.data}
      collections={collections.data}
      activeTab={props.activeTab}
      onTabChange={props.onTabChange}
    />
  );
}

/** Decorative banner pinned to the top, sitting under all the content. */
function Banner() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 76,
        zIndex: -1,
        backgroundImage: `url(${headerBg})`,
        opacity: 0.7,
        // `cover` keeps the image's aspect ratio and crops the overflow.
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        borderTopLeftRadius: "var(--mantine-radius-xs)",
        borderTopRightRadius: "var(--mantine-radius-xs)",
        // Fade the bottom edge into the card background.
        maskImage: "linear-gradient(to bottom, #000 45%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 45%, transparent)",
      }}
    />
  );
}

/** Loading state: centered loader. */
function LoadingState() {
  return (
    <Center style={{ flex: 1 }}>
      <Stack align="center" gap="sm">
        <Loader size="sm" color="gray" />
        <Text fw={600} fz="sm" c="gray">
          Connecting...
        </Text>
      </Stack>
    </Center>
  );
}

export default App;
