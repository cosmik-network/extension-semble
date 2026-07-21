import { Anchor, Avatar, Group, Stack, Text } from "@mantine/core";
import type { UrlSaver } from "../../../../lib/savers";
import { sembleProfileUrl } from "../../../../lib/sembleWeb";
import classes from "./SaversDrawer.module.css";

export function SaverItem(props: { saver: UrlSaver }) {
  const { saver } = props;
  return (
    <Anchor
      href={sembleProfileUrl(saver.handle)}
      target="_blank"
      rel="noreferrer"
      underline="never"
      c="inherit"
      display="block"
      px={4}
      py={2}
      bdrs="md"
      className={classes.item}
    >
      <Group gap="xxs" wrap="nowrap" miw={0}>
        <Avatar src={saver.avatarUrl} name={saver.name} size="md" radius="md" />
        <Stack gap={0} miw={0}>
          <Text fz="xs" fw={600} c="bright" lineClamp={1}>
            {saver.name || saver.handle}
          </Text>
          <Text fz="xs" fw={500} c="dimmed" lineClamp={1}>
            @{saver.handle}
          </Text>
        </Stack>
      </Group>
    </Anchor>
  );
}
