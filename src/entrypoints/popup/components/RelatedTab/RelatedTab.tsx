import { useState } from "react";
import { Stack } from "@mantine/core";
import type { UrlType } from "../../../../lib/library";
import { useSimilarUrls } from "../../../../lib/queries";
import { UrlTypeFilter } from "../UrlTypeFilter";
import { UrlResultList } from "../UrlResultList";

/**
 * Infinite list of URLs similar to the current page. Fetches lazily the first
 * time its tab becomes active (the query cache keeps the result), then loads
 * further pages as the list is scrolled. Results can be narrowed to a single
 * content type.
 */
export function RelatedTab({ url, active }: { url: string; active: boolean }) {
  const [urlType, setUrlType] = useState<UrlType | null>(null);

  const query = useSimilarUrls(url, {
    enabled: active,
    urlType: urlType ?? undefined,
  });

  return (
    <Stack gap="xs" h="100%">
      <UrlTypeFilter value={urlType} onChange={setUrlType} />
      <UrlResultList query={query} emptyMessage="No similar URLs found" />
    </Stack>
  );
}
