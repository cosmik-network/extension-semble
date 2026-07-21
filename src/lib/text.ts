/** Naive English plural: "save" → "saves" when count isn't 1. */
export function pluralize(count: number, noun: string): string {
  return `${noun}${count === 1 ? "" : "s"}`;
}
