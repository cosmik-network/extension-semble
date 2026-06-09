import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Center,
  Loader,
  Space,
  Stack,
  Text,
  useComputedColorScheme,
} from "@mantine/core";
import { isSupportedUrl } from "../../lib/activeTab";
import { describeError } from "../../lib/errors";
import { useApiKey } from "../../lib/hooks";
import { useMyCollections, useMyProfile, useUrlState } from "../../lib/queries";
import { useActiveTabUrl } from "./hooks/useActiveTabUrl";
import { AccountSettings } from "./components/AccountSettings";
import { AppPreferences } from "./components/AppPreferences";
import { ApiKeyForm } from "./components/ApiKeyForm";
import { AppHeader } from "./components/AppHeader";
import { MainTabs } from "./components/MainTabs";
import { SearchTab } from "./components/SearchTab";
import headerBg from "../../assets/semble-header-bg.webp";
import headerBgDark from "../../assets/semble-header-bg-dark.webp";

type Phase = "loading" | "no-key" | "unsupported" | "error" | "ready";

function App(props: { surface?: "popup" | "sidepanel" }) {
  const surface = props.surface ?? "popup";
  const [view, setView] = useState<"main" | "search" | "settings">("main");

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
  // scroll. The side panel always fills its window; in the popup, loading/ready
  // and the search view share one height so it doesn't jump, while shorter
  // states (sign-in, unsupported, error) size to content.
  const sidepanel = surface === "sidepanel";
  // Search shares the tall, scrollable height; settings sizes to its content.
  const fixedHeight =
    view === "search" ||
    (view === "main" && (phase === "loading" || phase === "ready"));

  return (
    <Card
      w={sidepanel ? "100%" : 360}
      p="xs"
      radius={sidepanel ? 0 : "xs"}
      style={{
        position: "relative",
        // Own stacking context so the banner's negative z-index stays scoped
        // (above the card background, below the content).
        zIndex: 0,
        display: "flex",
        flexDirection: "column",
        height: sidepanel ? "100vh" : fixedHeight ? 590 : undefined,
        // Short, signed-in states (unsupported/error/settings) size to content,
        // which can be too short for the profile-menu dropdown — reserve room so
        // it opens downward instead of being clipped by the popup window.
        minHeight: !sidepanel && !fixedHeight && profile.data ? 300 : undefined,
      }}
    >
      <Banner />

      <AppHeader
        view={view}
        onOpenSearch={() => setView("search")}
        onOpenSettings={() => setView("settings")}
        onBack={() => setView("main")}
        profile={profile.data}
        hasKey={hasKey}
      />

      <Space h={"md"} />

      {view === "search" ? (
        <Stack gap="sm" style={{ flex: 1, minHeight: 0 }}>
          <SearchTab active />
        </Stack>
      ) : view === "settings" && hasKey ? (
        <Stack gap="md">
          <Text fw={600} fz="lg">
            Settings
          </Text>
          <AccountSettings onCleared={() => setView("main")} />
          <AppPreferences />
        </Stack>
      ) : (
        <MainContent
          phase={phase}
          url={url}
          urlState={urlState}
          collections={collections}
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
          {describeError(urlState.error ?? collections.error)}
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
    />
  );
}

/** Decorative banner pinned to the top, sitting under all the content. */
function Banner() {
  // getInitialValueInEffect: false so the first paint already matches the OS
  // scheme (no light-image flash before hydration).
  const scheme = useComputedColorScheme("light", {
    getInitialValueInEffect: false,
  });
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
        backgroundImage: `url(${scheme === "dark" ? headerBgDark : headerBg})`,
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
