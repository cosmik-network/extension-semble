import { Fragment } from "react";
import { Anchor, Group, Skeleton, Text } from "@mantine/core";
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

/**
 * Semble-wide counts for a URL, shown as a "3 saves · 2 collections" row.
 *
 * The counts load separately from the rest of the card, so pass `"pending"`
 * while they're in flight: the row then draws its real markup under a skeleton
 * overlay, holding the exact height the counts will occupy so nothing below
 * jumps when they land. (A stand-alone `Skeleton.*` placeholder would have to
 * restate this row's typography and spacing to get that height, and drift the
 * first time either changes.)
 */
export function UrlStatsRow(props: {
  stats: UrlStats | "pending";
  /** When set, the saves stat becomes clickable. */
  onSavesClick?: () => void;
  /** When set, the collections stat becomes clickable. */
  onCollectionsClick?: () => void;
}) {
  const pending = props.stats === "pending";
  const stats = props.stats === "pending" ? undefined : props.stats;
  const clickHandlers: Partial<
    Record<keyof UrlStats, (() => void) | undefined>
  > = {
    saves: props.onSavesClick,
    collections: props.onCollectionsClick,
  };

  return (
    <Group gap="sm" mt={8}>
      {STATS.map((stat) => {
        const count = stats?.[stat.key] ?? 0;
        // The overlay blocks clicks but not focus, so drop the handlers with it.
        const onClick = pending ? undefined : clickHandlers[stat.key];
        const label = (
          <>
            <span className={classes.count}>{count}</span>{" "}
            {pluralize(count, stat.noun)}
          </>
        );
        const text = onClick ? (
          <Anchor
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
        ) : (
          <Text fz="xs" fw={600} c="dimmed">
            {label}
          </Text>
        );
        if (!pending) return <Fragment key={stat.key}>{text}</Fragment>;
        return (
          // `width="auto"` so the bar hugs its label instead of Skeleton's
          // default 100%, which would stretch it across the row.
          <Skeleton key={stat.key} visible width="auto" radius="xl">
            {text}
          </Skeleton>
        );
      })}
    </Group>
  );
}
