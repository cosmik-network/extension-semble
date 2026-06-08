import { Button, Group, Scroller } from "@mantine/core";
import { URL_TYPES, type UrlType } from "../../../../lib/library";

interface UrlTypeFilterProps {
  value: UrlType | null;
  onChange: (value: UrlType | null) => void;
}

/**
 * Single-select content-type filter; `null` ("All") clears it. Shared by the
 * Related and Search tabs.
 */
export function UrlTypeFilter(props: UrlTypeFilterProps) {
  // Must not flex-shrink, or overflowing content (e.g. skeletons) collapses it.
  return (
    <Scroller style={{ flexShrink: 0 }}>
      <Group gap="xxs" wrap="nowrap">
        {[null, ...URL_TYPES].map((type) => (
          <Button
            key={type ?? "all"}
            size="xs"
            color={props.value === type ? "lime" : "gray"}
            variant={props.value === type ? "filled" : "light"}
            onClick={() => props.onChange(type)}
            tt="capitalize"
          >
            {type ?? "All"}
          </Button>
        ))}
      </Group>
    </Scroller>
  );
}
