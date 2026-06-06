import { useSyncExternalStore } from "react";
import { getApiKey, subscribeApiKey } from "../semble";

/**
 * The current API key, re-rendering when it's set or cleared (sign-in,
 * logout, or a change made from another extension page).
 */
export function useApiKey(): string | undefined {
  return useSyncExternalStore(subscribeApiKey, getApiKey);
}
