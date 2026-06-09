import { storage } from "wxt/utils/storage";

/** Where clicking the toolbar icon opens Semble. */
export type OpenMode = "popup" | "sidepanel";

function createStore() {
  return storage.defineItem<OpenMode>("local:openMode", { fallback: "popup" });
}

let store: ReturnType<typeof createStore> | undefined;

/**
 * The open-mode storage item, created on first use. Persisted in extension
 * storage (not localStorage) so the background script — which has no `window` —
 * can read and watch it to switch the action behaviour. Lazy because
 * `defineItem` eagerly reads storage, which throws during WXT's build-time
 * entrypoint analysis (no `browser.storage` there). See wxt-dev/wxt#371.
 */
export function openModeStore() {
  return (store ??= createStore());
}
