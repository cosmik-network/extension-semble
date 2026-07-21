/** Links into the Semble web app (as opposed to the API, see semble.ts). */

const SEMBLE_WEB_URL = "https://semble.so";

/** The web app's profile page for a user handle. */
export function sembleProfileUrl(handle: string): string {
  return `${SEMBLE_WEB_URL}/profile/${handle}`;
}
