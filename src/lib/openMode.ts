import { storage } from "wxt/utils/storage";

/** Where clicking the toolbar icon opens Semble. */
export type OpenMode = "popup" | "sidepanel";

/**
 * Persisted in extension storage (not localStorage) so the background script —
 * which has no `window` — can read and watch it to switch the action behaviour.
 */
export const openModeItem = storage.defineItem<OpenMode>("local:openMode", {
  fallback: "popup",
});
