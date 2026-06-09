import { browser } from "wxt/browser";
import { storage } from "wxt/utils/storage";

/**
 * Live state of a "save all tabs in this window" job, owned by the background
 * service worker and watched by the popup/side panel so progress shows in the
 * extension UI. `null` means no active job.
 */
export interface SaveAllJob {
  status: "running" | "done";
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

/** Clears the job (popup writes storage directly; no background round-trip). */
export function dismissSaveAllJob(): void {
  void saveAllJobStore().setValue(null);
}
