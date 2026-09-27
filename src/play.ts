import type { Fish } from "./game";
import type { Point } from "./behaviors";
import { lifeNoise } from "./feeding";
export interface LearnedTrick {
  points: Point[];
  learnedAt: number;
  rehearsals: number;
}
export interface PlayCommand {
  kind: "replay" | "circle" | "gather" | "bubbles";
  nonce: number;
}
export interface ActivePlayCommand extends PlayCommand {
  startedAt: number;
  center: Point;
  bubble?: Point & { placedAt: number; reachedAt?: number; surfaceY: number };
}
export const canPlaySpecies = (fish: Pick<Fish, "species"> | string) =>
  !["frog", "snail", "crab", "shrimp", "cory", "ray"].includes(
    typeof fish === "string" ? fish : fish.species,
  );
export const willingToPlay = (fish: Fish) =>
  fish.playful > 0.25 && fish.mood > 55 && canPlaySpecies(fish);
/** One invitation at a time, followed by a quiet interval; candidates rotate. */
export function invitedPlayer(
  fish: readonly Fish[],
  now: number,
  startedAt: number,
): string | null {
  const elapsed = Math.max(0, now - startedAt),
    candidates = fish.filter(willingToPlay);
  if (!candidates.length || elapsed % 18000 >= 10000) return null;
  const cycle = Math.floor(elapsed / 18000);
  const offset = Math.floor(lifeNoise(startedAt / 1000) * candidates.length);
  return candidates[(offset + cycle) % candidates.length].id;
}
export function addTrailPoint(points: Point[], point: Point): Point[] {
  const bounded = {
    x: Math.max(0.04, Math.min(0.96, point.x)),
    y: Math.max(0.24, Math.min(0.84, point.y)),
  };
  const previous = points[points.length - 1];
  if (
    previous &&
    Math.hypot(previous.x - bounded.x, previous.y - bounded.y) < 0.012
  )
    return points;
  const next = [...points, bounded];
  // Keep the whole gesture, not merely its final segment, on long drags.
  return next.length > 96
    ? next.filter((_, i) => i % 2 === 0 || i === next.length - 1)
    : next;
}
export function learnableTrail(points: readonly Point[]): boolean {
  return (
    points.length >= 4 &&
    points
      .slice(1)
      .reduce(
        (length, p, i) =>
          length + Math.hypot(p.x - points[i].x, p.y - points[i].y),
        0,
      ) >= 0.16
  );
}
/** Constant-distance travel prevents dense sampling near a corner from causing a pause. */
export function pointOnTrail(
  points: readonly Point[],
  phase: number,
): Point | null {
  if (points.length < 2) return null;
  if (phase <= 0) return { ...points[0] };
  if (phase >= 1) return { ...points[points.length - 1] };
  const lengths = points
    .slice(1)
    .map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  const total = lengths.reduce((sum, d) => sum + d, 0);
  let distance = Math.max(0, Math.min(1, phase)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i] || i === lengths.length - 1) {
      const portion = lengths[i] ? distance / lengths[i] : 0;
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * portion,
        y: points[i].y + (points[i + 1].y - points[i].y) * portion,
      };
    }
    distance -= lengths[i];
  }
  return null;
}
/** A bubble waits where tapped until its playmate arrives, then rises and pops. */
export function bubbleTarget(
  command: ActivePlayCommand | null,
  now: number,
): Point | null {
  if (command?.kind !== "bubbles" || !command.bubble) return null;
  const bubble = command.bubble;
  if (bubble.reachedAt === undefined) return { x: bubble.x, y: bubble.y };
  const elapsed = Math.max(0, now - bubble.reachedAt) / 1000;
  const y = bubble.y - elapsed * 0.045;
  if (y <= bubble.surfaceY) return null;
  return { x: bubble.x + Math.sin(elapsed * 1.4) * 0.012, y };
}
export function placeBubble(
  command: ActivePlayCommand,
  point: Point,
  now: number,
  surfaceY: number,
): ActivePlayCommand {
  return {
    ...command,
    bubble: {
      x: Math.max(0.04, Math.min(0.96, point.x)),
      y: Math.max(surfaceY + 0.04, Math.min(0.84, point.y)),
      placedAt: now,
      surfaceY,
    },
  };
}
export function playTarget(
  fish: Fish & { trick?: LearnedTrick },
  now: number,
  command: ActivePlayCommand | null,
  selected = false,
): Point | null {
  if (!canPlaySpecies(fish) || (!selected && !willingToPlay(fish))) return null;
  const offset = lifeNoise(fish.seed) * 0.16;
  if (command && now - command.startedAt >= 0) {
    const seconds = (now - command.startedAt) / 1000;
    if (command.kind === "replay")
      return fish.trick
        ? pointOnTrail(
            fish.trick.points,
            (seconds / 5 + offset) % 2 <= 1
              ? (seconds / 5 + offset) % 2
              : 2 - ((seconds / 5 + offset) % 2),
          )
        : null;
    if (command.kind === "gather")
      return {
        x: command.center.x + Math.sin(fish.seed) * 0.065,
        y: command.center.y + Math.cos(fish.seed) * 0.055,
      };
    if (command.kind === "circle")
      return {
        x: command.center.x + Math.cos(seconds * 1.1 + fish.seed) * 0.12,
        y: command.center.y + Math.sin(seconds * 1.1 + fish.seed) * 0.12,
      };
    return bubbleTarget(command, now);
  }
  if (!fish.trick) return null;
  const age = now - fish.trick.learnedAt;
  if (age < 0) return null;
  if (selected) {
    const phase = (age / 5000 + offset) % 2;
    return pointOnTrail(fish.trick.points, phase <= 1 ? phase : 2 - phase);
  }
  if (age > 180000) return null;
  const cycle = (age / 1000 + offset * 3) % 16;
  return cycle < 8 ? pointOnTrail(fish.trick.points, cycle / 8) : null;
}
