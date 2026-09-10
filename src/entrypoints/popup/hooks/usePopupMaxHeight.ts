import { useEffect, useState } from "react";
import { browser } from "wxt/browser";

/** The popup card's full (and maximum) height. */
export const POPUP_HEIGHT = 590;
/** Anything less is a bogus measurement (panel not positioned yet). */
const MIN_POPUP_HEIGHT = 240;
/** Arrow + panel border/shadow around the popup document. */
const PANEL_CHROME = 16;
/** Firefox preloads the popup on hover and only positions the panel on click,
 * so the first measurement can run too early — retry shortly after mount. */
const RETRY_DELAYS_MS = [50, 250, 750];

/** Screen Y of the popup itself (its panel, not the browser window). */
function popupScreenTop(): number {
  const win = window as Window & { mozInnerScreenY?: number };
  return win.mozInnerScreenY ?? window.screenY;
}

async function measureAvailableHeight(): Promise<number> {
  const top = popupScreenTop();
  const screen = window.screen as Screen & { availTop?: number };
  let bottom = (screen.availTop ?? 0) + screen.availHeight;

  // Firefox attaches the popup to its browser window and clips it there, so
  // the window's bottom edge is a bound too. Chrome's popup may overhang a
  // short window, so the same bound there would shrink it needlessly.
  if (import.meta.env.FIREFOX) {
    const current = await browser.windows.getCurrent();
    if (current.top != null && current.height != null) {
      bottom = Math.min(bottom, current.top + current.height);
    }
  }

  return bottom - top - PANEL_CHROME;
}

/**
 * The height the popup card can use: {@link POPUP_HEIGHT}, or the room left
 * below the popup's top edge if that is less. Firefox sizes the popup to our
 * content and then clips the panel to the room it has without telling the
 * document, so the card has to measure and size itself to fit. Pass
 * `enabled: false` where the card fills a real container (the side panel).
 */
export function usePopupMaxHeight(enabled: boolean): number {
  const [height, setHeight] = useState(POPUP_HEIGHT);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function update() {
      const avail = await measureAvailableHeight();
      if (cancelled || !Number.isFinite(avail) || avail < MIN_POPUP_HEIGHT) {
        return;
      }
      setHeight(Math.min(Math.floor(avail), POPUP_HEIGHT));
    }

    void update();
    const timers = RETRY_DELAYS_MS.map((ms) =>
      window.setTimeout(() => void update(), ms),
    );
    const onChange = () => void update();
    window.addEventListener("focus", onChange);
    window.addEventListener("resize", onChange);
    document.addEventListener("visibilitychange", onChange);

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("focus", onChange);
      window.removeEventListener("resize", onChange);
      document.removeEventListener("visibilitychange", onChange);
    };
  }, [enabled]);

  return height;
}
