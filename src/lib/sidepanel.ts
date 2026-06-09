import { browser } from "wxt/browser";

/**
 * Chrome's side-panel API (`chrome.sidePanel`) isn't part of the
 * webextension-polyfill surface and doesn't exist on Firefox, so reach for it
 * through a narrow global cast and feature-detect before use.
 */
function sidePanelApi():
  | { open(options: { windowId?: number; tabId?: number }): Promise<void> }
  | undefined {
  const globalChrome = (globalThis as { chrome?: { sidePanel?: unknown } })
    .chrome;
  return globalChrome?.sidePanel as
    | { open(options: { windowId?: number; tabId?: number }): Promise<void> }
    | undefined;
}

/** Whether the browser supports opening the extension's side panel. */
export function canUseSidePanel(): boolean {
  return !!sidePanelApi();
}

/**
 * Opens the extension's side panel for the current window. Must be called from a
 * user gesture (e.g. a click handler). No-ops where unsupported.
 */
export async function openSidePanel(): Promise<void> {
  const api = sidePanelApi();
  if (!api) return;
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  await api.open(
    tab?.windowId != null ? { windowId: tab.windowId } : { tabId: tab?.id },
  );
}
