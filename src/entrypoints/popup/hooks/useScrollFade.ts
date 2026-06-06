import { useCallback, useRef, useState } from "react";

/**
 * Fades whichever edge of a ScrollArea has more content to scroll to. Wire the
 * returned `viewportRef` to `ScrollArea`'s `viewportRef`, `updateFade` to its
 * `onScrollPositionChange` (and call it in an effect when content changes), and
 * apply `maskImage` to the viewport.
 */
export function useScrollFade() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [fadeTop, setFadeTop] = useState(false);
  const [fadeBottom, setFadeBottom] = useState(false);

  const updateFade = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const overflowing = el.scrollHeight > el.clientHeight + 1;
    const atTop = el.scrollTop <= 1;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    setFadeTop(overflowing && !atTop);
    setFadeBottom(overflowing && !atBottom);
  }, []);

  const maskImage = fadeMask(fadeTop, fadeBottom);

  return { viewportRef, maskImage, updateFade };
}

/** Builds a vertical mask that fades the top and/or bottom edges. */
function fadeMask(top: boolean, bottom: boolean): string | undefined {
  if (top && bottom) {
    return "linear-gradient(to bottom, transparent, #000 38px, #000 calc(100% - 38px), transparent)";
  }
  if (top) return "linear-gradient(to bottom, transparent, #000 38px)";
  if (bottom)
    return "linear-gradient(to bottom, #000 calc(100% - 38px), transparent)";
  return undefined;
}
