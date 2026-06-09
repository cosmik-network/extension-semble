import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import type { MyProfile } from "../../../../lib/library";
import { ProfileMenu, ProfileMenuSkeleton } from "../ProfileMenu";
import sembleLogo from "../../../../assets/semble.svg";

interface AppHeaderProps {
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
 * the left; the search action and profile menu on the right.
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
