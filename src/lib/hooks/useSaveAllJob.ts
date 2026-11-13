import { useEffect, useState } from "react";
import { type SaveAllJob, saveAllJobStore } from "../saveAllTabs";

/** A "done" job or unanswered confirmation older than this is treated as dismissed. */
const STALE_MS = 120_000;

/**
 * Reads and watches the "save all tabs" job from extension storage so the popup
 * reflects progress driven by the background. A finished job or unanswered
 * confirmation is aged out after {@link STALE_MS} so a normal popup open later
 * doesn't land on a stale summary or prompt.
 */
export function useSaveAllJob(): SaveAllJob | null {
  const [job, setJob] = useState<SaveAllJob | null>(null);

  useEffect(() => {
    const store = saveAllJobStore();
    let active = true;
    void store.getValue().then((value) => {
      if (active) setJob(value);
    });
    const unwatch = store.watch((value) => setJob(value ?? null));
    return () => {
      active = false;
      unwatch();
    };
  }, []);

  if (job && job.status !== "running" && Date.now() - job.updatedAt > STALE_MS) {
    return null;
  }
  return job;
}
