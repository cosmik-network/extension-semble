import { createSembleClient, type SembleClient } from "@semble.so/api";
import { storage } from "wxt/utils/storage";

/**
 * The Semble API key, persisted in extension storage. Users set it at runtime
 * via the popup sign-in form or the options page.
 */
const apiKeyItem = storage.defineItem<string | null>("local:sembleApiKey", {
  fallback: null,
});

/** Thrown when no API key has been configured. */
export class NoApiKeyError extends Error {
  constructor() {
    super("No Semble API key configured.");
    this.name = "NoApiKeyError";
  }
}

/** Thrown when a Semble API call returns a non-200 status. */
export class SembleApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`Semble API error (${status})`);
    this.name = "SembleApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * In-memory copy of the stored key so `getApiKey()` can stay synchronous
 * (it's read in render-time `enabled:` flags). Loaded before React renders
 * via {@link initApiKey} and kept fresh by a storage watcher.
 */
let cachedApiKey: string | undefined;
let client: SembleClient | undefined;
const listeners = new Set<() => void>();

function setCachedKey(next: string | undefined) {
  if (next === cachedApiKey) return;
  cachedApiKey = next;
  client = undefined; // never reuse a client built with the old key
  for (const listener of listeners) listener();
}

let initPromise: Promise<void> | undefined;

/**
 * Loads the stored key into the in-memory cache and starts watching storage
 * for changes (e.g. the key being set/cleared from another extension page).
 * Must be awaited before rendering React. Idempotent.
 */
export function initApiKey(): Promise<void> {
  return (initPromise ??= (async () => {
    setCachedKey((await apiKeyItem.getValue()) ?? undefined);
    apiKeyItem.watch((value) => setCachedKey(value ?? undefined));
  })());
}

/** Subscribes to API key changes. Returns an unsubscribe function. */
export function subscribeApiKey(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getApiKey(): string | undefined {
  return cachedApiKey && cachedApiKey.length > 0 ? cachedApiKey : undefined;
}

/** Persists the API key. The storage watcher updates other open pages. */
export async function setApiKey(key: string): Promise<void> {
  setCachedKey(key); // update this context immediately; watch converges
  await apiKeyItem.setValue(key);
}

/** Clears the stored API key (logout). */
export async function clearApiKey(): Promise<void> {
  setCachedKey(undefined);
  await apiKeyItem.removeValue();
}

/**
 * The shared `@semble.so/api` client. Throws {@link NoApiKeyError} if no key
 * is configured.
 */
export function getClient(): SembleClient {
  const apiKey = getApiKey();
  if (!apiKey) throw new NoApiKeyError();
  return (client ??= createSembleClient({
    apiKey,
    client: "semble-extension-v104",
  }));
}

/**
 * A throwaway client for a candidate key that hasn't been persisted yet
 * (used to validate a key before saving it).
 */
export function createClientFor(apiKey: string): SembleClient {
  return createSembleClient({ apiKey, client: "semble-extension-v104" });
}

/**
 * Awaits a client call and returns the response body. The client types only
 * declare the 200 response, but at runtime any status comes back as a plain
 * `{ status, body }` result — treat the whole 2xx range as success (e.g.
 * createConnection returns 201) and convert the rest to {@link SembleApiError}.
 */
export async function unwrap<T>(
  call: Promise<{ status: number; body: T }>,
): Promise<T> {
  const res = await call;
  if (res.status < 200 || res.status >= 300) {
    throw new SembleApiError(res.status, res.body);
  }
  return res.body;
}
