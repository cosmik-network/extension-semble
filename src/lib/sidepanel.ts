import { browser } from "wxt/browser";

/** Neither API is in WXT's chrome-types-based `browser` surface, so reach for
 * both through narrow casts and feature-detect before use. */
interface ChromeSidePanelApi {
  open(options: { windowId?: number; tabId?: number }): Promise<void>;
  setPanelBehavior?(behavior: {
    openPanelOnActionClick: boolean;
  }): Promise<void>;
}

function chromeSidePanelApi(): ChromeSidePanelApi | undefined {
  const globalChrome = (globalThis as { chrome?: { sidePanel?: unknown } })
    .chrome;
  return globalChrome?.sidePanel as ChromeSidePanelApi | undefined;
}

interface FirefoxSidebarApi {
  open(): Promise<void>;
}

function firefoxSidebarApi(): FirefoxSidebarApi | undefined {
  return (browser as unknown as { sidebarAction?: FirefoxSidebarApi })
    .sidebarAction;
}

export function canUseSidePanel(): boolean {
  return !!chromeSidePanelApi() || !!firefoxSidebarApi();
}

/** Firefox has no auto-open flag; its sidebar is opened via an explicit
 * `action.onClicked` handler in background.ts instead. */
export function hasAutoOpenOnClick(): boolean {
  return !!chromeSidePanelApi()?.setPanelBehavior;
}

/** `windowId` is required on Chrome; Firefox's sidebar always opens for the
 * current window, and must be called from a user-gesture handler or it throws. */
export async function openSidePanel(windowId?: number): Promise<void> {
  const chromeApi = chromeSidePanelApi();
  if (chromeApi) {
    if (windowId != null) await chromeApi.open({ windowId });
    return;
  }
  await firefoxSidebarApi()?.open();
}

/** Pair with clearing the action popup. Chrome-only; no-ops elsewhere. */
export async function setOpenPanelOnActionClick(
  enabled: boolean,
): Promise<void> {
  const api = chromeSidePanelApi();
  if (!api?.setPanelBehavior) return;
  await api.setPanelBehavior({ openPanelOnActionClick: enabled });
}
