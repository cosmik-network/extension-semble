/** Links into the Semble web app (as opposed to the API, see semble.ts). */

const SEMBLE_WEB_URL = "https://semble.so";

/** The web app's profile page for a user handle. */
export function sembleProfileUrl(handle: string): string {
  return `${SEMBLE_WEB_URL}/profile/${handle}`;
}

/**
 * The web app's page for a collection, addressed by its author's handle and
 * the collection's AT-URI record key.
 */
export function sembleCollectionUrl(handle: string, rkey: string): string {
  return `${sembleProfileUrl(handle)}/collections/${rkey}`;
}
