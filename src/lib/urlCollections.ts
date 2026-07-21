import { getClient, unwrap } from "./semble";

export interface UrlCollection {
  id: string;
  name: string;
  description?: string;
  cardCount: number;
  updatedAt: string;
  /** AT-URI record key, used to build the collection's web app link. */
  rkey?: string;
  /** The owner's handle, the other half of the web app link. */
  authorHandle: string;
}

export interface UrlCollectionsPage {
  collections: UrlCollection[];
  page: number;
  hasMore: boolean;
}

/**
 * Lists the collections (across all users) that contain the given URL, most
 * recently added first. Pages are 1-based.
 */
export async function listCollectionsForUrl(
  url: string,
  page = 1,
  limit = 20,
): Promise<UrlCollectionsPage> {
  const body = await unwrap(
    getClient().collections.collectionsForUrl({
      query: { url, page, limit, sortBy: "addedAt", sortOrder: "desc" },
    }),
  );
  return {
    collections: body.collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      cardCount: collection.cardCount,
      updatedAt: collection.updatedAt,
      rkey: collection.uri?.split("/").pop(),
      authorHandle: collection.author.handle,
    })),
    page: body.pagination.currentPage,
    hasMore: body.pagination.hasMore,
  };
}

export interface CollectionPreviewCard {
  id: string;
  url: string;
  title?: string;
  imageUrl?: string;
}

/** The most recently added cards of a collection, for thumbnail previews. */
export async function listCollectionPreviewCards(
  collectionId: string,
  limit: number,
): Promise<CollectionPreviewCard[]> {
  const body = await unwrap(
    getClient().collections.collectionById({
      query: {
        collectionId,
        page: 1,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
    }),
  );
  return body.urlCards.map((card) => ({
    id: card.id,
    url: card.cardContent.url,
    title: card.cardContent.title,
    imageUrl: card.cardContent.imageUrl,
  }));
}
