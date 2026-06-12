import { getClient, unwrap } from "./semble";
import { toMetadata, type UrlMetadata } from "./library";

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

/** The typed-link kinds accepted by the create endpoint. */
export const CONNECTION_TYPES = [
  "RELATED",
  "SUPPORTS",
  "OPPOSES",
  "ADDRESSES",
  "HELPFUL",
  "LEADS_TO",
  "EXPLAINER",
  "SUPPLEMENT",
] as const;

export type ConnectionType = (typeof CONNECTION_TYPES)[number];

export interface CreateConnectionInput {
  sourceUrl: string;
  targetUrl: string;
  connectionType?: ConnectionType;
  note?: string;
}

/**
 * Creates a typed URL-to-URL connection. Both ends are raw URLs — the server
 * resolves or creates the underlying records, so neither page needs to be in
 * the library first. Returns the new connection's id.
 */
export async function createConnection(
  input: CreateConnectionInput,
): Promise<string> {
  const note = input.note?.trim();
  const body = await unwrap(
    getClient().connections.createConnection({
      body: {
        sourceType: "URL",
        sourceValue: input.sourceUrl,
        targetType: "URL",
        targetValue: input.targetUrl,
        connectionType: input.connectionType,
        note: note ? note : undefined,
      },
    }),
  );
  return body.connectionId;
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
