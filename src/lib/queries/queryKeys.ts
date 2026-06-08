import type { UrlType } from "../library";

/**
 * Centralized query keys so queries and mutations agree on what to cache and
 * invalidate. Keys are hierarchical: invalidating `urlState.all` invalidates
 * every per-URL state query, etc.
 */
export const queryKeys = {
  profile: ["profile"] as const,
  collections: ["collections"] as const,
  urlState: {
    all: ["urlState"] as const,
    byUrl: (url: string) => ["urlState", url] as const,
  },
  similarUrls: {
    all: ["similarUrls"] as const,
    byUrl: (url: string, urlType?: UrlType) =>
      ["similarUrls", url, urlType ?? null] as const,
  },
  search: {
    all: ["search"] as const,
    byQuery: (query: string, urlType?: UrlType) =>
      ["search", query, urlType ?? null] as const,
  },
  connections: {
    all: ["connections"] as const,
    byUrl: (url: string) => ["connections", url] as const,
  },
};
