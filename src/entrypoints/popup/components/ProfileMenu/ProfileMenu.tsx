import {
  Avatar,
  Group,
  Menu,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import type { MyProfile } from "../../../../lib/library";
import { queryClient } from "../../../../lib/queryClient";
import { clearApiKey } from "../../../../lib/semble";
import { sembleProfileUrl } from "../../../../lib/sembleWeb";

/**
 * Header avatar that opens a profile menu: profile link, submit an issue, log
 * out. Mirrors the web app's ProfileMenu styling.
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
          href={sembleProfileUrl(profile.handle)}
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
