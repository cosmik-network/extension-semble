import { Button, Center, Progress, Stack, Text } from "@mantine/core";
import type { SaveAllJob } from "../../../../lib/saveAllTabs";

interface SaveAllProgressProps {
  job: SaveAllJob;
  /** Retry the saves that are still failing. */
  onRetry: () => void;
  /** Dismiss the (finished) job and return to the normal view. */
  onDismiss: () => void;
}

/**
 * Live view of a "save all tabs in this window" job: a progress bar while it
 * runs, then a summary with a retry option for anything that couldn't be saved.
 */
export function SaveAllProgress(props: SaveAllProgressProps) {
  const job = props.job;
  const done = job.status === "done";
  const failed = job.failedUrls.length;
  const processed = job.saved + job.alreadySaved + failed;
  const value = job.total > 0 ? (processed / job.total) * 100 : 100;
  // The tab being saved right now — clamped so it reads "Saving 1 of 8" at the
  // start rather than "0 of 8", and never overshoots the total.
  const current = Math.min(processed + 1, job.total);

  return (
    <Center style={{ flex: 1 }}>
      <Stack gap="md" w="100%" maw={280}>
        <Stack gap={6}>
          <Text fw={600} fz="sm">
            {done ? "Saved tabs to Semble" : "Saving tabs to Semble"}
          </Text>
          <Progress value={value} animated={!done} />
          <Text fz="sm" c="dimmed">
            {done ? summary(job) : `Saving ${current} of ${job.total}…`}
          </Text>
          {done && failed > 0 && (
            <Text fz="xs" c="red">
              {failed} {failed === 1 ? "tab" : "tabs"} couldn't be saved.
            </Text>
          )}
        </Stack>

        {done && (
          <Stack gap="xs">
            {failed > 0 && (
              <Button variant="light" onClick={props.onRetry}>
                Try again
              </Button>
            )}
            <Button variant="subtle" color="gray" onClick={props.onDismiss}>
              Done
            </Button>
          </Stack>
        )}
      </Stack>
    </Center>
  );
}

/** "Saved 5 · 2 already saved" — only the non-zero parts. */
function summary(job: SaveAllJob): string {
  const parts = [`Saved ${job.saved}`];
  if (job.alreadySaved > 0) parts.push(`${job.alreadySaved} already saved`);
  return parts.join(" · ");
}
