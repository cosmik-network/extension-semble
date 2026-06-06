import { createClientFor, getClient, setApiKey, unwrap } from "./semble";

export interface UrlMetadata {
  url: string;
  title?: string;
  siteName?: string;
  imageUrl?: string;
  description?: string;
}

export interface CollectionSummary {
  id: string;
  name: string;
  cardCount: number;
}

export interface UrlState {
  /** Present when the URL is already saved in the user's library. */
  cardId?: string;
  /** Id of the attached note card, when the saved card has a note. */
  noteCardId?: string;
  metadata: UrlMetadata;
  note: string;
  /** Ids of the user's collections that currently contain this URL. */
  collectionIds: string[];
}

export interface SimilarUrl {
  metadata: UrlMetadata;
  /** How many users have this URL in their library. */
  libraryCount: number;
  /** Whether the current user already has this URL saved. */
  inLibrary: boolean;
}

export interface MyProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
}

/** Narrows the API's card content to the metadata fields we display. */
function toMetadata(content: {
  url: string;
  title?: string;
  siteName?: string;
  imageUrl?: string;
  description?: string;
}): UrlMetadata {
  return {
    url: content.url,
    title: content.title,
    siteName: content.siteName,
    imageUrl: content.imageUrl,
    description: content.description,
  };
}

function toMyProfile(body: {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
}): MyProfile {
  return {
    id: body.id,
    name: body.name,
    handle: body.handle,
    avatarUrl: body.avatarUrl,
  };
}

/** The signed-in user's profile (subset of fields we use). */
export async function getMyProfile(): Promise<MyProfile> {
  return toMyProfile(await unwrap(getClient().users.myProfile()));
}

/**
 * Validates a candidate API key by fetching the profile with a throwaway
 * client, and persists it only if the call succeeds. Throws (without saving)
 * when the key is rejected or the request fails.
 */
export async function validateAndSaveApiKey(key: string): Promise<MyProfile> {
  const profile = toMyProfile(
    await unwrap(createClientFor(key).users.myProfile()),
  );
  await setApiKey(key);
  return profile;
}

export async function listMyCollections(): Promise<CollectionSummary[]> {
  const body = await unwrap(
    getClient().collections.myCollections({ query: { limit: 100 } }),
  );
  return body.collections.map((col) => ({
    id: col.id,
    name: col.name,
    cardCount: col.cardCount,
  }));
}

/** Loads the saved/unsaved state and metadata for a URL. */
export async function loadUrlState(url: string): Promise<UrlState> {
  const status = await unwrap(
    getClient().cards.urlLibraryStatus({ query: { url } }),
  );
  const collectionIds = (status.collections ?? []).map((col) => col.id);

  if (status.card) {
    return {
      cardId: status.card.id,
      noteCardId: status.card.note?.id,
      note: status.card.note?.text ?? "",
      collectionIds,
      metadata: toMetadata(status.card.cardContent),
    };
  }

  // Not saved yet — fetch metadata for the preview.
  const meta = await unwrap(getClient().cards.urlMetadata({ query: { url } }));
  return {
    cardId: undefined,
    noteCardId: undefined,
    note: "",
    collectionIds: [],
    metadata: toMetadata(meta.metadata),
  };
}

/** First-time save. Returns the new card id. */
export async function addToLibrary(input: {
  url: string;
  note?: string;
  collectionIds?: string[];
}): Promise<string> {
  const body = await unwrap(
    getClient().cards.addUrlToLibrary({
      body: {
        url: input.url,
        note: input.note?.trim() ? input.note.trim() : undefined,
        collectionIds: input.collectionIds?.length
          ? input.collectionIds
          : undefined,
      },
    }),
  );
  return body.urlCardId;
}

/**
 * Updates an already-saved card: its note and/or collection membership.
 *
 * The update endpoint rejects an empty note, so clearing the note (empty
 * `note` with a `noteCardId`) instead deletes the note card itself.
 */
export async function updateCard(input: {
  cardId: string;
  /** New note text; empty/whitespace removes the existing note, if any. */
  note?: string;
  /** Id of the card's current note card (required to remove the note). */
  noteCardId?: string;
  addToCollections?: string[];
  removeFromCollections?: string[];
}): Promise<void> {
  const note = input.note?.trim() ? input.note : undefined;
  if (
    note ||
    input.addToCollections?.length ||
    input.removeFromCollections?.length
  ) {
    await unwrap(
      getClient().cards.urlCardAssociations({
        body: {
          cardId: input.cardId,
          note,
          addToCollections: input.addToCollections,
          removeFromCollections: input.removeFromCollections,
        },
      }),
    );
  }
  // Note cleared: delete the note card (notes are cards in the library).
  if (input.note !== undefined && !note && input.noteCardId) {
    await removeFromLibrary(input.noteCardId);
  }
}

/** Removes a card from the user's library. */
export async function removeFromLibrary(cardId: string): Promise<void> {
  await unwrap(getClient().cards.removeFromLibrary({ body: { cardId } }));
}

/** Creates a collection and returns its id. */
export async function createCollection(name: string): Promise<string> {
  const body = await unwrap(
    getClient().collections.createCollection({
      body: { name: name.trim() },
    }),
  );
  return body.collectionId;
}

export interface SimilarUrlsPage {
  urls: SimilarUrl[];
  page: number;
  hasMore: boolean;
}

/** Content types the similar-URLs search can be narrowed to. */
export const URL_TYPES = [
  "article",
  "link",
  "book",
  "research",
  "audio",
  "video",
  "social",
  "event",
  "software",
] as const;

export type UrlType = (typeof URL_TYPES)[number];

/** Finds URLs similar to the given one. Pages are 1-based. */
export async function findSimilarUrls(
  url: string,
  page = 1,
  limit = 20,
  urlType?: UrlType,
): Promise<SimilarUrlsPage> {
  const body = await unwrap(
    getClient().search.similarUrls({ query: { url, page, limit, urlType } }),
  );
  return {
    urls: body.urls.map((u) => ({
      metadata: toMetadata(u.metadata),
      libraryCount: u.urlLibraryCount,
      inLibrary: u.urlInLibrary ?? false,
    })),
    page: body.pagination.currentPage,
    hasMore: body.pagination.hasMore,
  };
}
