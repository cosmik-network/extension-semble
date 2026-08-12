import { NoApiKeyError, SembleApiError } from "./semble";

/**
 * True when the API rejected our credentials, so retrying is pointless and the
 * key has to be replaced.
 */
export function isAuthError(error: unknown): boolean {
  return (
    error instanceof SembleApiError &&
    (error.status === 401 || error.status === 403)
  );
}

/**
 * Turns any thrown value into human, actionable copy for the UI. Keeps raw
 * `SembleApiError (500)`-style messages out of the interface and gives the user
 * a hint at what to do (reconnect, wait, check the connection).
 */
export function describeError(error: unknown): string {
  if (isOffline(error)) {
    return "You appear to be offline. Check your connection and try again.";
  }

  if (error instanceof NoApiKeyError) {
    return "Sign in to Semble to continue.";
  }

  if (isAuthError(error)) {
    return "Your API key was rejected — reconnect in settings.";
  }

  if (error instanceof SembleApiError) {
    if (error.status === 429) {
      return "You're going a bit fast — wait a moment and try again.";
    }
    if (error.status >= 500) {
      return "Semble is having trouble right now. Try again shortly.";
    }
    // Other 4xx (e.g. a validation rejection): the server's own message is
    // usually specific and actionable, so prefer it over the generic copy.
    const serverMessage = apiErrorMessage(error.body);
    if (serverMessage) return serverMessage;
  }

  return "Something went wrong. Please try again.";
}

/** Pulls a `{ message }` string out of an API error body, when present. */
function apiErrorMessage(body: unknown): string | undefined {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return undefined;
}

/** Detects a dropped connection: the browser flag or a fetch network failure. */
function isOffline(error: unknown): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return true;
  }
  // fetch() rejects with a TypeError ("Failed to fetch") when the network is
  // unreachable — distinct from the API returning an error status.
  return (
    error instanceof TypeError && /fetch|network/i.test(error.message)
  );
}
