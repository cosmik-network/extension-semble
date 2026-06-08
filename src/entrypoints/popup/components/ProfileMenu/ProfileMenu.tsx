import {
  Avatar,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { browser } from "wxt/browser";
import type { MyProfile } from "../../../../lib/library";
import { queryClient } from "../../../../lib/queryClient";
import { clearApiKey } from "../../../../lib/semble";

/**
 * Header avatar that opens a profile menu: profile link, settings, log out.
 * Mirrors the web app's ProfileMenu styling.
 */
export function ProfileMenu(props: { profile: MyProfile }) {
  const { profile } = props;

  async function handleLogout() {
    // Clearing the key flips `useApiKey()` and the popup falls back to the
    // sign-in form; drop cached data so the next sign-in starts clean.
    await clearApiKey();
    queryClient.clear();
  }

  return (
    <Menu shadow="sm" width={220} position="bottom-end">
      <Menu.Target>
        <UnstyledButton aria-label="Profile menu">
          <Avatar
            src={profile.avatarUrl}
            name={profile.name}
            size={24}
            radius="sm"
          />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          component="a"
          href={`https://semble.so/profile/${profile.handle}`}
          target="_blank"
          rel="noreferrer"
        >
          <Stack gap={0}>
            <Text fw={600} fz={"sm"} c="bright" lineClamp={1}>
              {profile.name || profile.handle}
            </Text>
            <Text fw={500} fz={"sm"} c="gray" lineClamp={1}>
              @{profile.handle}
            </Text>
          </Stack>
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="gray"
          onClick={() => void browser.runtime.openOptionsPage()}
        >
          Settings
        </Menu.Item>

        <Menu.Item
          component="a"
          href="https://tangled.org/@cosmik.network/semble/issues"
          target="_blank"
          color="gray"
        >
          Submit an issue
        </Menu.Item>

        <Menu.Item color="red" onClick={() => void handleLogout()}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

/** Gear icon (Tabler "settings", inlined — no icon package installed). */
function GearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
      <circle cx={12} cy={12} r={3} />
    </svg>
  );
}

/** Logout icon (Tabler "logout", inlined). */
function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
      <path d="M9 12h12l-3 -3" />
      <path d="M21 12l-3 3" />
    </svg>
  );
}
