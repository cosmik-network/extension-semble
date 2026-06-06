import { browser } from "wxt/browser";

/** URL schemes we can't save (browser-internal / blank pages). */
const UNSUPPORTED_SCHEMES = [
  "chrome:",
  "chrome-extension:",
  "edge:",
  "about:",
  "moz-extension:",
  "view-source:",
];

export function isSupportedUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const { protocol } = new URL(url);
    if (UNSUPPORTED_SCHEMES.includes(protocol)) return false;
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/** Returns the URL of the active tab in the current window, if any. */
export async function getActiveTabUrl(): Promise<string | undefined> {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab?.url;
}

/** Best-effort domain for display (falls back to the raw URL). */
export function domainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Favicon URL for a page, via Google's favicon service. */
export function faviconUrl(url: string, size = 64): string | undefined {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`;
  } catch {
    return undefined;
  }
}
