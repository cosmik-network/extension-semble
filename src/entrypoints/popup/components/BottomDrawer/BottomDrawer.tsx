import type { ReactNode } from "react";
import { Drawer } from "@mantine/core";

/**
 * Shared bottom-sheet shell for the URL-stat drawers (savers, collections):
 * 75% height, rounded top corners, and a flex-column body so an InfiniteList
 * inside can fill and scroll it.
 */
export function BottomDrawer(props: {
  title: string;
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Drawer
      opened={props.opened}
      onClose={props.onClose}
      title={props.title}
      position="bottom"
      size="75%"
      padding="xs"
      styles={{
        title: { fontWeight: 600 },
        content: {
          display: "flex",
          flexDirection: "column",
          // Only the top corners: the bottom edge sits flush with the popup.
          borderRadius: "var(--mantine-radius-lg) var(--mantine-radius-lg) 0 0",
        },
        body: {
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {props.children}
    </Drawer>
  );
}
