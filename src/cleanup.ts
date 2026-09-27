/** Decorative care only: no health penalties, lost animals, or rewards. */
export interface CleanupState {
  glass: number[];
  litter: number[];
}
export type CleanupKind = "glass" | "litter";
const noise = (n: number) => {
  const q = Math.sin(n) * 43758.5453;
  return q - Math.floor(q);
};
export function glassPatch(index: number, seed: number) {
  return {
    x: 0.06 + noise(index * 17 + seed / 1000) * 0.88,
    y: 0.35 + noise(index * 13 + seed / 999) * 0.45,
  };
}
export function glassDirt(
  index: number,
  created: number,
  now: number,
  cleanedAt = 0,
): number {
  const age = Math.max(0, now - Math.max(created, cleanedAt));
  const delay = 15000 + noise(index * 71 + 3) * 25000;
  return Math.max(0, Math.min(1, (age - delay) / 90000));
}
export function litterPresent(
  index: number,
  created: number,
  now: number,
  cleanedAt = 0,
): boolean {
  const wait = cleanedAt > 0 ? 180000 + index * 13000 : 60000 + index * 35000;
  return now - Math.max(created, cleanedAt) >= wait;
}
export function litterPosition(index: number, seed: number) {
  return {
    x: 0.09 + noise(index * 43 + seed / 1100) * 0.82,
    offset: 4 + noise(index * 19 + 7) * 14,
    kind: index % 3,
  };
}
export type Visitor = "fox" | "bird" | "beaver";
/** One visitor species at a time, with a quiet first minute and pauses between visits. */
export function visitorPhase(visitor: Visitor, seconds: number): number | null {
  const [first, duration] = {
    fox: [65, 42],
    bird: [150, 32],
    beaver: [235, 62],
  }[visitor];
  if (seconds < first) return null;
  const phase = (seconds - first) % 360;
  return phase < duration ? phase / duration : null;
}
