import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { isSupportedUrl } from "../../lib/activeTab";
import { useApiKey } from "../../lib/hooks";
import { useMyCollections, useMyProfile, useUrlState } from "../../lib/queries";
import { useActiveTabUrl } from "./hooks/useActiveTabUrl";
import { ApiKeyForm } from "./components/ApiKeyForm";
import { UrlCard } from "./components/UrlCard";
import { ProfileMenu, ProfileMenuSkeleton } from "./components/ProfileMenu";
import { ManageTab } from "./components/ManageTab";
import { RelatedTab } from "./components/RelatedTab";
import headerBg from "../../assets/semble-header-bg.webp";
import sembleLogo from "../../assets/semble.svg";

type Phase = "loading" | "no-key" | "unsupported" | "error" | "ready";

function App() {
  const [activeTab, setActiveTab] = useState<string>("save");

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
        // A definite height is required for the inner scroll regions to bound
        // and scroll; max-height alone doesn't resolve the flex/percentage
        // height chain. Loading uses the same height as ready so the popup
        // doesn't jump when the content arrives.
        height: phase === "loading" || phase === "ready" ? 590 : undefined,
      }}
    >
      {/* Decorative banner pinned to the top, sitting under all the content.
          `cover` keeps the image's aspect ratio and crops the overflow, so
          changing the height below won't distort it. */}
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
      {/* Top bar: logo, current user's avatar, settings — over the banner. */}
      <Group
        justify="space-between"
        wrap="nowrap"
        gap="xs"
        mb="lg"
        style={{ flexShrink: 0 }}
      >
        <a
          href="https://semble.so/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex" }}
        >
          <img src={sembleLogo} alt="Semble" height={20} />
        </a>

        <Group gap={"xxs"} wrap="nowrap">
          {profile.data ? (
            <ProfileMenu profile={profile.data} />
          ) : (
            // No avatar while signed out — the sign-in form is the content.
            hasKey && <ProfileMenuSkeleton />
          )}
        </Group>
      </Group>

      {phase === "loading" && <LoadingState />}

      {phase === "unsupported" && (
        <Text size="sm" c="dimmed">
          This page can't be saved to Semble. Open a regular web page and try
          again.
        </Text>
      )}

      {phase === "no-key" && <ApiKeyForm />}

      {phase === "error" && (
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
      )}

      {phase === "ready" && urlState.data && collections.data && (
        <Stack gap="sm" style={{ flex: 1, minHeight: 0 }}>
          {/* Fixed header — sits over the banner background */}
          <Card p={0} bg="transparent">
            <UrlCard
              metadata={urlState.data.metadata}
              inLibrary={!!urlState.data.cardId}
            />
          </Card>

          <Tabs
            value={activeTab}
            onChange={(v) => setActiveTab(v ?? "save")}
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Fixed tab bar */}
            <Tabs.List grow>
              <Tabs.Tab value="save">Manage</Tabs.Tab>
              <Tabs.Tab value="related">Related</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="save" pt="sm" style={{ flex: 1, minHeight: 0 }}>
              {/* Keyed by card id so local edits reset when the card is
                  added/removed (the fresh server state becomes the baseline). */}
              <ManageTab
                key={urlState.data.cardId ?? "unsaved"}
                url={url}
                urlState={urlState.data}
                collections={collections.data}
              />
            </Tabs.Panel>

            <Tabs.Panel
              value="related"
              pt="sm"
              keepMounted
              style={{ flex: 1, minHeight: 0 }}
            >
              <RelatedTab url={url} active={activeTab === "related"} />
            </Tabs.Panel>
          </Tabs>
        </Stack>
      )}
    </Card>
  );
}

/** Loading state: centered loader. */
function LoadingState() {
  return (
    <Center style={{ flex: 1 }}>
      <Stack align="center" gap={"sm"}>
        <Loader size="sm" color="gray" />
        <Text fw={600} fz={"sm"} c={"gray"}>
          Connecting...
        </Text>
      </Stack>
    </Center>
  );
}

export default App;
