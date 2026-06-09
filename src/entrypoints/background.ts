import { browser } from "wxt/browser";
import { isSupportedUrl } from "../lib/activeTab";
import { describeError } from "../lib/errors";
import { addToLibrary, isUrlInLibrary } from "../lib/library";
import { getApiKey, initApiKey, subscribeApiKey } from "../lib/semble";
import { BADGE_REFRESH_MESSAGE } from "../lib/badge";
import { openModeItem, type OpenMode } from "../lib/openMode";
import { setOpenPanelOnActionClick } from "../lib/sidepanel";

/** MV3 exposes `action`; MV2 (Firefox) exposes `browserAction`. */
const action = browser.action ?? browser.browserAction;

const BADGE_TEXT = "✓";
const BADGE_COLOR = "#16a34a"; // green — "saved"

/**
 * Saved-state per URL, so rapid tab switches don't re-hit the API. Cleared when
 * the API key changes (login/logout) and per-URL after a save/remove.
 */
const savedCache = new Map<string, boolean>();

const NOTIFICATION_ICON = browser.runtime.getURL("/icons/128.png");

function notify(title: string, message: string): void {
  // Optional permission/area; ignore if unavailable.
  void browser.notifications?.create({
    type: "basic",
    iconUrl: NOTIFICATION_ICON,
    title,
    message,
  });
}

/** Sets (or clears) the saved badge for a specific tab. */
async function setBadge(tabId: number, saved: boolean): Promise<void> {
  await action.setBadgeText({ tabId, text: saved ? BADGE_TEXT : "" });
  if (saved) {
    await action.setBadgeBackgroundColor({ tabId, color: BADGE_COLOR });
    // Not supported everywhere; ignore if missing.
    await action.setBadgeTextColor?.({ tabId, color: "#ffffff" });
  }
}

/**
 * Evaluates whether `url` is in the user's library and updates the tab's badge.
 * Clears the badge for unsupported URLs or when signed out. `force` bypasses the
 * cache (used after a save/remove).
 */
async function evaluateTab(
  tabId: number,
  url: string | undefined,
  force = false,
): Promise<void> {
  if (!getApiKey() || !isSupportedUrl(url)) {
    await setBadge(tabId, false);
    return;
  }

  if (!force && savedCache.has(url)) {
    await setBadge(tabId, savedCache.get(url)!);
    return;
  }

  try {
    const saved = await isUrlInLibrary(url);
    savedCache.set(url, saved);
    await setBadge(tabId, saved);
  } catch {
    // Network/auth error — leave the badge cleared rather than misreport.
    await setBadge(tabId, false);
  }
}

/** Re-evaluates the badge for the currently active tab. */
async function evaluateActiveTab(force = false): Promise<void> {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (tab?.id != null) {
    if (force && tab.url) savedCache.delete(tab.url);
    await evaluateTab(tab.id, tab.url, force);
  }
}

const MENU_ITEMS = [
  { id: "semble-save-page", title: "Save page to Semble", contexts: ["page"] },
  { id: "semble-save-link", title: "Save link to Semble", contexts: ["link"] },
  {
    id: "semble-save-selection",
    title: "Save page with selection as note",
    contexts: ["selection"],
  },
] as const;

/** Returns true and notifies/opens options when no key is configured. */
function requireApiKey(): boolean {
  if (getApiKey()) return true;
  notify("Sign in to Semble", "Add your API key to start saving.");
  void browser.runtime.openOptionsPage();
  return false;
}

/**
 * Routes toolbar-icon clicks to the popup or the side panel per the user's
 * preference. Side-panel mode clears the action popup and asks Chrome to open
 * the panel on click; popup mode restores the default popup.
 */
async function applyOpenMode(mode: OpenMode): Promise<void> {
  const manifest = browser.runtime.getManifest() as {
    action?: { default_popup?: string };
  };
  const defaultPopup = manifest.action?.default_popup ?? "popup.html";

  if (mode === "sidepanel") {
    await action.setPopup({ popup: "" });
    await setOpenPanelOnActionClick(true);
  } else {
    await action.setPopup({ popup: defaultPopup });
    await setOpenPanelOnActionClick(false);
  }
}

function createMenus(): void {
  browser.contextMenus.removeAll(() => {
    for (const item of MENU_ITEMS) {
      browser.contextMenus.create({
        id: item.id,
        title: item.title,
        contexts: [...item.contexts],
      });
    }
  });
}

export default defineBackground(() => {
  // Load the stored key (and keep it fresh) before any API call.
  void initApiKey().then(() => evaluateActiveTab());

  // Apply the popup/side-panel open preference, and react to changes.
  void openModeItem.getValue().then(applyOpenMode);
  openModeItem.watch((mode) => void applyOpenMode(mode ?? "popup"));

  // Re-evaluate on login; clear stale state on logout.
  subscribeApiKey(() => {
    savedCache.clear();
    void evaluateActiveTab(true);
  });

  // --- Toolbar badge --------------------------------------------------------
  browser.tabs.onActivated.addListener(({ tabId }) => {
    void browser.tabs.get(tabId).then((tab) => evaluateTab(tabId, tab?.url));
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // The URL or page load changed — the saved state may differ.
    if (changeInfo.url || changeInfo.status === "complete") {
      if (changeInfo.url) savedCache.delete(changeInfo.url);
      void evaluateTab(tabId, tab.url);
    }
  });

  // Popup saves/removes happen in another context; refresh on its signal.
  browser.runtime.onMessage.addListener((message) => {
    if (message?.type === BADGE_REFRESH_MESSAGE) {
      void evaluateActiveTab(true);
    }
  });

  // --- Context menus --------------------------------------------------------
  browser.runtime.onInstalled.addListener(createMenus);

  browser.contextMenus.onClicked.addListener((info, tab) => {
    const url =
      info.menuItemId === "semble-save-link"
        ? info.linkUrl
        : info.pageUrl;
    if (!isSupportedUrl(url)) return;

    const note =
      info.menuItemId === "semble-save-selection"
        ? info.selectionText
        : undefined;

    if (!requireApiKey()) return;

    void (async () => {
      try {
        await addToLibrary({ url, note });
        savedCache.set(url, true);
        if (tab?.id != null) await setBadge(tab.id, true);
        notify("Saved to Semble", url);
      } catch (err) {
        notify("Couldn't save to Semble", describeError(err));
      }
    })();
  });
});
