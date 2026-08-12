import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { TbSettings } from "react-icons/tb";
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
  /** Whether an API key is configured — the actions are hidden while signed
   *  out, since the sign-in form is the content. */
  hasKey: boolean;
}

/**
 * Top bar over the banner: the Semble logo (or a back arrow in a sub-view) on
 * the left; the search/settings actions and profile menu on the right.
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

      {props.hasKey && (
        <Group gap="md" wrap="nowrap">
          <Group gap="xxs" wrap="nowrap">
            {/* Searching needs a working connection. */}
            {isMain && props.profile && (
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
            {/* Deliberately not gated on the profile: settings is where a
                rejected key gets replaced, so it has to stay reachable when
                every request is failing. */}
            {props.view !== "settings" && (
              <Tooltip label="Settings">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  aria-label="Settings"
                  onClick={props.onOpenSettings}
                >
                  <TbSettings size={18} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
          {props.profile ? (
            <ProfileMenu profile={props.profile} />
          ) : (
            <ProfileMenuSkeleton />
          )}
        </Group>
      )}
    </Group>
  );
}
