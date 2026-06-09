import { useCallback, useEffect, useState } from "react";
import { openModeItem, type OpenMode } from "../openMode";

/**
 * Reads and writes the popup-vs-side-panel open preference from extension
 * storage, staying in sync across surfaces via the storage watcher.
 */
export function useOpenMode(): [OpenMode, (mode: OpenMode) => void] {
  const [mode, setMode] = useState<OpenMode>("popup");

  useEffect(() => {
    let active = true;
    void openModeItem.getValue().then((value) => {
      if (active) setMode(value);
    });
    const unwatch = openModeItem.watch((value) => setMode(value ?? "popup"));
    return () => {
      active = false;
      unwatch();
    };
  }, []);

  const update = useCallback((next: OpenMode) => {
    setMode(next); // optimistic; the watcher confirms
    void openModeItem.setValue(next);
  }, []);

  return [mode, update];
}
