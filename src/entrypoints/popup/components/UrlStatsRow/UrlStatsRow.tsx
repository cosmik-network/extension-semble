import { Group, Text } from "@mantine/core";
import type { UrlStats } from "../../../../lib/library";
import classes from "./UrlStatsRow.module.css";

/** Which stats to show, in order. Add or remove entries to change the row. */
const STATS: { key: keyof UrlStats; noun: string }[] = [
  { key: "saves", noun: "save" },
  { key: "collections", noun: "collection" },
  { key: "connections", noun: "connection" },
];

function pluralize(count: number, noun: string): string {
  return `${noun}${count === 1 ? "" : "s"}`;
}

/** Semble-wide counts for a URL, shown as a "3 saves · 2 collections" row. */
export function UrlStatsRow(props: { stats: UrlStats }) {
  return (
    <Group gap="sm" mt={8}>
      {STATS.map((stat) => {
        const count = props.stats[stat.key];
        return (
          <Text key={stat.key} fz="xs" fw={600} c="dimmed">
            <span className={classes.count}>{count}</span>{" "}
            {pluralize(count, stat.noun)}
          </Text>
        );
      })}
    </Group>
  );
}
