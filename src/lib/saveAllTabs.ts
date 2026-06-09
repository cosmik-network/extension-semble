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

export const saveAllJobItem = storage.defineItem<SaveAllJob | null>(
  "local:saveAllJob",
  { fallback: null },
);

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
  void saveAllJobItem.setValue(null);
}
