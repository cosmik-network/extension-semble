import { getClient, unwrap } from "./semble";
import { toMetadata, type UrlMetadata } from "./library";

/** The typed relationships Semble supports between two URLs. */
export const CONNECTION_TYPES = [
  "SUPPORTS",
  "OPPOSES",
  "ADDRESSES",
  "HELPFUL",
  "LEADS_TO",
  "RELATED",
  "SUPPLEMENT",
  "EXPLAINER",
] as const;

export type ConnectionType = (typeof CONNECTION_TYPES)[number];

export interface ConnectionCurator {
  name: string;
  handle: string;
  avatarUrl?: string;
}

export interface Connection {
  id: string;
  /** The relationship type, when set (free-form strings are passed through). */
  type?: string;
  note?: string;
  curator: ConnectionCurator;
  /** The page on the other end of the connection from the queried URL. */
  other: UrlMetadata;
  /** "outgoing" when the queried URL is the connection's source. */
  direction: "outgoing" | "incoming";
}

export interface ConnectionsPage {
  connections: Connection[];
  page: number;
  hasMore: boolean;
}

/**
 * Lists connections where the given URL is either end, mapping each to the
 * page on its *other* end (so the UI shows what this page links to / from).
 * Pages are 1-based.
 */
export async function listConnectionsForUrl(
  url: string,
  page = 1,
  limit = 20,
): Promise<ConnectionsPage> {
  const body = await unwrap(
    getClient().connections.connectionsForUrl({ query: { url, page, limit } }),
  );
  return {
    connections: body.connections.map((item) => {
      const isSource = item.source.url === url;
      const other = isSource ? item.target : item.source;
      return {
        id: item.connection.id,
        type: item.connection.type,
        note: item.connection.note,
        curator: {
          name: item.connection.curator.name,
          handle: item.connection.curator.handle,
          avatarUrl: item.connection.curator.avatarUrl,
        },
        other: toMetadata(other.metadata),
        direction: isSource ? "outgoing" : "incoming",
      };
    }),
    page: body.pagination.currentPage,
    hasMore: body.pagination.hasMore,
  };
}
