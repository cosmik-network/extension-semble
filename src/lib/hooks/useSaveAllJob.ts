import { useEffect, useState } from "react";
import { type SaveAllJob, saveAllJobStore } from "../saveAllTabs";

/** A "done" job older than this is treated as dismissed. */
const STALE_DONE_MS = 120_000;

/**
 * Reads and watches the "save all tabs" job from extension storage so the popup
 * reflects progress driven by the background. A finished job is aged out after
 * {@link STALE_DONE_MS} so a normal popup open later doesn't land on a stale
 * summary.
 */
export function useSaveAllJob(): SaveAllJob | null {
  const [job, setJob] = useState<SaveAllJob | null>(null);

  useEffect(() => {
    const job = saveAllJobStore();
    let active = true;
    void job.getValue().then((value) => {
      if (active) setJob(value);
    });
    const unwatch = job.watch((value) => setJob(value ?? null));
    return () => {
      active = false;
      unwatch();
    };
  }, []);

  if (job?.status === "done" && Date.now() - job.updatedAt > STALE_DONE_MS) {
    return null;
  }
  return job;
}
