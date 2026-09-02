import type { ReactNode } from "react";
import { Button, Group, Scroller } from "@mantine/core";
import { FaSeedling } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

export type Scope = "your" | "recommended" | "open";

const SCOPES: { value: Scope; label: string; icon?: ReactNode }[] = [
  { value: "your", label: "My collections" },
  {
    value: "recommended",
    label: "Recommended",
    icon: <HiSparkles size={12} />,
  },
  { value: "open", label: "Open collections", icon: <FaSeedling size={12} /> },
];

interface Props {
  value: Scope;
  onChange: (scope: Scope) => void;
}

/**
 * Single-select row of pills that switches the picker's scope. The pills
 * overflow the popup width, so the row scrolls horizontally (mirroring the
 * Related tab's type filter).
 */
export function ScopePills(props: Props) {
  return (
    // Must not flex-shrink, or the list's scroll region collapses it.
    <Scroller style={{ flexShrink: 0 }}>
      <Group gap="xxs" wrap="nowrap">
        {SCOPES.map((scope) => {
          const active = scope.value === props.value;
          return (
            <Button
              key={scope.value}
              size="xs"
              radius="md"
              variant="light"
              color={active ? "blue" : "gray"}
              leftSection={scope.icon}
              aria-pressed={active}
              onClick={() => props.onChange(scope.value)}
            >
              {scope.label}
            </Button>
          );
        })}
      </Group>
    </Scroller>
  );
}
