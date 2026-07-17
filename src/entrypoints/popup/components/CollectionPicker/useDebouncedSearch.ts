import { useDebouncedValue } from "@mantine/hooks";

/**
 * Debounces the picker's search input for server-side querying. `searching` is
 * true once the debounced query is non-empty, i.e. results should come from
 * the server rather than the default list.
 */
export function useDebouncedSearch(search: string) {
  const [debounced] = useDebouncedValue(search, 300);
  const trimmed = debounced.trim();
  return { trimmed, searching: trimmed !== "" };
}
