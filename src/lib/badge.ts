import { browser } from "wxt/browser";

/** Runtime message asking the background script to refresh the toolbar badge. */
export const BADGE_REFRESH_MESSAGE = "semble:badge-refresh";

/**
 * Asks the background script to re-evaluate the active tab's saved-state badge.
 * Used after a save/remove/update in the popup, which happens in a separate
 * context from the background's badge logic. Fire-and-forget.
 */
export function requestBadgeRefresh(): void {
  void browser.runtime
    .sendMessage({ type: BADGE_REFRESH_MESSAGE })
    .catch(() => {
      // Background may not be listening yet; the badge converges on next
      // tab activation regardless.
    });
}
