import { Anchor, Group, Text } from "@mantine/core";
import type { UrlStats } from "../../../../lib/library";
import { pluralize } from "../../../../lib/text";
import classes from "./UrlStatsRow.module.css";

/** Which stats to show, in order. Add or remove entries to change the row. */
const STATS: { key: keyof UrlStats; noun: string; ariaLabel: string }[] = [
  { key: "saves", noun: "save", ariaLabel: "Show who saved this page" },
  {
    key: "collections",
    noun: "collection",
    ariaLabel: "Show collections containing this page",
  },
  { key: "connections", noun: "connection", ariaLabel: "" },
];

/** Semble-wide counts for a URL, shown as a "3 saves · 2 collections" row. */
export function UrlStatsRow(props: {
  stats: UrlStats;
  /** When set, the saves stat becomes clickable. */
  onSavesClick?: () => void;
  /** When set, the collections stat becomes clickable. */
  onCollectionsClick?: () => void;
}) {
  const clickHandlers: Partial<
    Record<keyof UrlStats, (() => void) | undefined>
  > = {
    saves: props.onSavesClick,
    collections: props.onCollectionsClick,
  };

  return (
    <Group gap="sm" mt={8}>
      {STATS.map((stat) => {
        const count = props.stats[stat.key];
        const onClick = clickHandlers[stat.key];
        const label = (
          <>
            <span className={classes.count}>{count}</span>{" "}
            {pluralize(count, stat.noun)}
          </>
        );
        if (onClick) {
          return (
            <Anchor
              key={stat.key}
              component="button"
              type="button"
              onClick={onClick}
              underline="hover"
              fz="xs"
              fw={600}
              c="dimmed"
              aria-label={stat.ariaLabel}
            >
              {label}
            </Anchor>
          );
        }
        return (
          <Text key={stat.key} fz="xs" fw={600} c="dimmed">
            {label}
          </Text>
        );
      })}
    </Group>
  );
}
