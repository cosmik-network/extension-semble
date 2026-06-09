/**
 * Chrome's side-panel API (`chrome.sidePanel`) isn't part of the
 * webextension-polyfill surface and doesn't exist on Firefox, so reach for it
 * through a narrow global cast and feature-detect before use.
 */
interface SidePanelApi {
  open(options: { windowId?: number; tabId?: number }): Promise<void>;
  setPanelBehavior?(behavior: {
    openPanelOnActionClick: boolean;
  }): Promise<void>;
}

function sidePanelApi(): SidePanelApi | undefined {
  const globalChrome = (globalThis as { chrome?: { sidePanel?: unknown } })
    .chrome;
  return globalChrome?.sidePanel as SidePanelApi | undefined;
}

/** Whether the browser supports opening the extension's side panel. */
export function canUseSidePanel(): boolean {
  return !!sidePanelApi();
}

/** Opens the extension's side panel for a window. No-ops where unsupported. */
export async function openSidePanel(windowId: number): Promise<void> {
  const api = sidePanelApi();
  if (api) await api.open({ windowId });
}

/**
 * Makes a toolbar-icon click open the side panel (when enabled) instead of the
 * popup. Pair with clearing the action popup. No-ops where unsupported.
 */
export async function setOpenPanelOnActionClick(
  enabled: boolean,
): Promise<void> {
  const api = sidePanelApi();
  if (!api?.setPanelBehavior) return;
  await api.setPanelBehavior({ openPanelOnActionClick: enabled });
}
