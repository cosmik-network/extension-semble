import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { FiArrowLeft, FiSearch, FiSidebar } from "react-icons/fi";
import type { MyProfile } from "../../../../lib/library";
import { canUseSidePanel, openSidePanel } from "../../../../lib/sidepanel";
import { ProfileMenu, ProfileMenuSkeleton } from "../ProfileMenu";
import sembleLogo from "../../../../assets/semble.svg";

interface AppHeaderProps {
  /** Which surface the app is rendered in; the side panel hides "expand". */
  surface: "popup" | "sidepanel";
  /** Which top-level view is open. */
  view: "main" | "search" | "settings";
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onBack: () => void;
  profile?: MyProfile;
  /** Whether an API key is configured (controls the signed-out skeleton). */
  hasKey: boolean;
}

/**
 * Top bar over the banner: the Semble logo (or a back arrow in a sub-view) on
 * the left; the search/side-panel actions and profile menu on the right.
 */
export function AppHeader(props: AppHeaderProps) {
  const isMain = props.view === "main";

  return (
    <Group
      justify="space-between"
      wrap="nowrap"
      gap="xs"
      mb="lg"
      style={{ flexShrink: 0 }}
    >
      {!isMain ? (
        <ActionIcon
          variant="subtle"
          color="gray"
          radius="xl"
          aria-label="Back"
          onClick={props.onBack}
        >
          <FiArrowLeft size={18} />
        </ActionIcon>
      ) : (
        <a
          href="https://semble.so"
          target="_blank"
          rel="noreferrer"
          aria-label="Open Semble"
          style={{ display: "inline-flex" }}
        >
          <img src={sembleLogo} alt="Semble" height={20} />
        </a>
      )}

      <Group gap="md" wrap="nowrap">
        {props.profile ? (
          <>
            {/* Search + side panel grouped tightly, apart from the avatar. */}
            <Group gap="xxs" wrap="nowrap">
              {isMain && (
                <Tooltip label="Search Semble">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    radius="xl"
                    aria-label="Search"
                    onClick={props.onOpenSearch}
                  >
                    <FiSearch size={18} />
                  </ActionIcon>
                </Tooltip>
              )}
              {props.surface === "popup" &&
                isMain &&
                canUseSidePanel() && (
                  <Tooltip label="Open in side panel">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      radius="xl"
                      aria-label="Open in side panel"
                      onClick={() =>
                        void openSidePanel().then(() => window.close())
                      }
                    >
                      <FiSidebar size={18} />
                    </ActionIcon>
                  </Tooltip>
                )}
            </Group>
            <ProfileMenu
              profile={props.profile}
              onOpenSettings={props.onOpenSettings}
            />
          </>
        ) : (
          // No avatar while signed out — the sign-in form is the content.
          props.hasKey && <ProfileMenuSkeleton />
        )}
      </Group>
    </Group>
  );
}
