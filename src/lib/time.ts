/** Compact age intervals, largest first — mirrors the web app's formatting. */
const INTERVALS = [
  { label: "y", seconds: 31536000 },
  { label: "mo", seconds: 2592000 },
  { label: "d", seconds: 86400 },
  { label: "h", seconds: 3600 },
  { label: "m", seconds: 60 },
  { label: "s", seconds: 1 },
];

/** Short relative age for a date string: "3d", "2mo", or "now". */
export function getRelativeTime(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000,
  );
  const interval = INTERVALS.find((i) => i.seconds < seconds);
  if (!interval) return "now";
  const count = Math.floor(seconds / interval.seconds);
  if (count < 1) return "now";
  return `${count}${interval.label}`;
}
