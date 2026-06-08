import { useState } from "react";
import {
  Center,
  Input,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { FiSearch } from "react-icons/fi";
import type { UrlType } from "../../../../lib/library";
import { useSembleSearch } from "../../../../lib/queries";
import { UrlTypeFilter } from "../UrlTypeFilter";
import { UrlResultList } from "../UrlResultList";

/**
 * Full-text search across Semble. Results span the whole network (not just the
 * user's library); each carries a "Saved" badge for URLs already saved. Results
 * can be narrowed to a single content type. Fetches lazily once its tab is
 * active and a query has been entered.
 */
export function SearchTab({ active }: { active: boolean }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const [urlType, setUrlType] = useState<UrlType | null>(null);

  const search = useSembleSearch(debouncedQuery, {
    enabled: active,
    urlType: urlType ?? undefined,
  });

  return (
    <Stack gap="xs" h="100%">
      <TextInput
        size="sm"
        variant="filled"
        placeholder="Search Semble"
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        leftSection={<FiSearch size={14} />}
        rightSectionPointerEvents="auto"
        rightSection={
          query ? <Input.ClearButton onClick={() => setQuery("")} /> : undefined
        }
        style={{ flexShrink: 0 }}
      />

      <UrlTypeFilter value={urlType} onChange={setUrlType} />

      {debouncedQuery.trim() ? (
        <UrlResultList query={search} emptyMessage="No results found" />
      ) : (
        <SearchPrompt />
      )}
    </Stack>
  );
}

/** Empty-state prompt shown before a query is entered. */
function SearchPrompt() {
  return (
    <Center style={{ flex: 1 }} px="md">
      <Stack align="center" gap="xs">
        <ThemeIcon size={36} radius="xl" variant="filled" color="tangerine">
          <FiSearch size={16} />
        </ThemeIcon>
        <Text c="dimmed" fz="sm" ta="center" maw={220}>
          Find anything saved across the community — articles, videos, papers,
          and more.
        </Text>
      </Stack>
    </Center>
  );
}
