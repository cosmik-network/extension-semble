import { browser } from "wxt/browser";
import { storage } from "wxt/utils/storage";

/** A tab offered for saving in the confirmation step. */
export interface SaveAllCandidate {
  url: string;
  title?: string;
}

/**
 * Live state of a "save all tabs in this window" job, owned by the background
 * service worker and watched by the popup/side panel so progress shows in the
 * extension UI. `null` means no active job.
 *
 * A job starts in `"confirm"`: the menu item is easy to click by mistake, so
 * nothing is saved until the user picks which tabs to keep and confirms in the
 * popup/side panel.
 */
export interface SaveAllJob {
  status: "confirm" | "running" | "done";
  /** Supported, deduped tabs in the window (snapshotted when the menu was used). */
  candidates: SaveAllCandidate[];
  /** The URLs the user chose to save; empty until confirmed. */
  urls: string[];
  /** Supported, deduped tabs being processed. */
  total: number;
  /** Newly saved this job. */
  saved: number;
  /** Skipped — already in the library. */
  alreadySaved: number;
  /** Still failing after the auto-retry pass. */
  failedUrls: string[];
  /** Date.now() of the last update — used to age out stale "done" jobs. */
  updatedAt: number;
}

function createStore() {
  return storage.defineItem<SaveAllJob | null>("local:saveAllJob", {
    fallback: null,
  });
}

let store: ReturnType<typeof createStore> | undefined;

/**
 * The job's storage item, created on first use. Lazy because `defineItem`
 * eagerly reads storage, which throws during WXT's build-time entrypoint
 * analysis (no `browser.storage` there). See wxt-dev/wxt#371.
 */
export function saveAllJobStore() {
  return (store ??= createStore());
}

export const RETRY_SAVE_ALL_MESSAGE = "semble:save-all-retry";
export const CONFIRM_SAVE_ALL_MESSAGE = "semble:save-all-confirm";

/**
 * Tells the background the user confirmed the pending job with the chosen
 * `urls`, so it starts saving. The work runs in the background (survives the
 * popup closing); fire-and-forget.
 */
export function confirmSaveAll(urls: string[]): void {
  void browser.runtime
    .sendMessage({ type: CONFIRM_SAVE_ALL_MESSAGE, urls })
    .catch(() => {
      // Background may not be listening; nothing to do.
    });
}

/**
 * Asks the background to retry the job's remaining failed URLs. The work runs
 * in the background (survives the popup closing); fire-and-forget.
 */
export function requestSaveAllRetry(): void {
  void browser.runtime
    .sendMessage({ type: RETRY_SAVE_ALL_MESSAGE })
    .catch(() => {
      // Background may not be listening; nothing to do.
    });
}

/**
 * Clears the job — dismissing a finished summary or cancelling a pending
 * confirmation (popup writes storage directly; no background round-trip).
 */
export function dismissSaveAllJob(): void {
  void saveAllJobStore().setValue(null);
}
