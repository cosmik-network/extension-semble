import { getClient, unwrap } from "./semble";

export interface UrlSaver {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
}

export interface SaversPage {
  savers: UrlSaver[];
  page: number;
  hasMore: boolean;
}

/**
 * Lists the users who have saved the given URL to their library, newest
 * first. Pages are 1-based.
 */
export async function listSaversForUrl(
  url: string,
  page = 1,
  limit = 20,
): Promise<SaversPage> {
  const body = await unwrap(
    getClient().cards.librariesForUrl({
      query: { url, page, limit, sortBy: "createdAt", sortOrder: "desc" },
    }),
  );
  return {
    savers: body.libraries.map((item) => ({
      id: item.user.id,
      name: item.user.name,
      handle: item.user.handle,
      avatarUrl: item.user.avatarUrl,
    })),
    page: body.pagination.currentPage,
    hasMore: body.pagination.hasMore,
  };
}
