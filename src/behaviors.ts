import { progress, type Fish } from "./game";
export interface Point {
  x: number;
  y: number;
}
export interface BehaviorInput {
  width: number;
  height: number;
  time: number;
  now: number;
  reduced: boolean;
  daylight?: number;
  tool: string;
  pointer: Point | null;
  food: Point | null;
  forcePlay?: boolean;
  habitat?: "aquarium" | "sea";
  neighbors?: { fish: Fish; x: number; y: number }[];
}
export interface AnimalBehavior extends Point {
  activity:
    | "swimming"
    | "resting"
    | "following"
    | "chasing"
    | "eating"
    | "sliding"
    | "crawling"
    | "surface"
    | "jumping";
  sleeping: boolean;
  jumpPhase: number | null;
}
const floorAnimals = new Set(["crab", "shrimp", "cory", "ray"]);
const nonJumpers = new Set([
  "snail",
  "frog",
  "crab",
  "shrimp",
  "seahorse",
  "cory",
  "ray",
  "jelly",
]);
export const waterSurface = (height: number) =>
  Math.max(52, Math.min(180, height * 0.25));
const clamp = (x: number, min: number, max: number) =>
  Math.max(min, Math.min(max, x));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

export function animalBehavior(f: Fish, e: BehaviorInput): AnimalBehavior {
  const surface = waterSurface(e.height),
    motion = e.reduced ? 0 : e.time;
  let x =
    (0.12 +
      (Math.sin(motion * (0.07 + f.playful * 0.05) + f.seed) + 1) * 0.38) *
    e.width;
  let y = (f.y + Math.sin(motion * 0.3 + f.seed) * 0.07) * e.height;
  let activity: AnimalBehavior["activity"] = "swimming";
  const swimmer =
    !floorAnimals.has(f.species) &&
    f.species !== "snail" &&
    f.species !== "frog";
  const following =
    e.tool === "play" &&
    e.pointer !== null &&
    (e.forcePlay || (f.playful > 0.25 && f.mood > 55)) &&
    swimmer;
  let eating =
    e.food !== null && f.species !== "frog" && !(e.forcePlay && following);
  const sleeping =
    swimmer &&
    !following &&
    !eating &&
    f.careUntil < e.now &&
    Math.sin(e.time * 0.06 + f.seed) >
      (e.now - f.born > 604800000
        ? 0.65
        : e.now - f.born > 86400000
          ? 0.83
          : 0.93) -
        (1 - (e.daylight ?? 1)) * 1.1;
  if (floorAnimals.has(f.species)) {
    x = (0.1 + (Math.sin(motion * 0.02 + f.seed) + 1) * 0.4) * e.width;
    y = e.height * 0.85;
    activity = "crawling";
  }
  if (f.species === "snail") {
    const cycle = (((motion + f.seed * 3) % 150) + 150) % 150;
    const edge = Math.sin(f.seed) > 0 ? 0.94 : 0.06;
    if (e.habitat === "sea" || cycle < 100) {
      x =
        (e.habitat === "sea"
          ? 0.1 + (Math.sin(motion * 0.012 + f.seed) + 1) * 0.4
          : mix(1 - edge, edge, cycle / 100)) * e.width;
      y = e.height * 0.85;
      activity = "crawling";
    } else {
      x = edge * e.width;
      const climb = Math.sin(((cycle - 100) / 50) * Math.PI);
      y = mix(e.height * 0.85, surface + (e.height - surface) * 0.2, climb);
      activity = "sliding";
      eating = false;
    }
  }
  if (f.species === "frog") {
    x = (0.16 + (Math.sin(motion * 0.025 + f.seed) + 1) * 0.34) * e.width;
    y = surface - 7;
    activity = "surface";
  }
  if (sleeping) {
    x = f.x * e.width;
    y = e.height * 0.75;
    activity = "resting";
  }
  if (
    !sleeping &&
    !following &&
    !eating &&
    !e.reduced &&
    swimmer &&
    progress(f) < 0.65 &&
    f.playful > 0.45 &&
    f.mood > 50 &&
    (e.time + f.seed) % 14 < 4
  ) {
    const self = e.neighbors?.find((n) => n.fish.id === f.id) ?? f;
    const friend = e.neighbors?.find(
      (n) =>
        n.fish.id !== f.id &&
        progress(n.fish) < 0.8 &&
        !nonJumpers.has(n.fish.species) &&
        Math.hypot(n.x - self.x, n.y - self.y) < 0.35,
    );
    if (friend) {
      x = (friend.x + Math.sin(f.seed) * 0.06) * e.width;
      y = (friend.y + 0.035) * e.height;
      activity = "chasing";
    }
  }
  if (following) {
    x = e.pointer!.x * e.width + Math.sin(f.seed) * 18;
    y = e.pointer!.y * e.height + Math.cos(f.seed) * 16;
    activity = "following";
  }
  if (eating) {
    x = e.food!.x * e.width;
    y = e.food!.y * e.height;
    activity = "eating";
  }
  x = clamp(x, 35, Math.max(35, e.width - 35));
  if (f.species !== "frog")
    y = clamp(y, surface + 22, Math.max(surface + 22, e.height * 0.87));
  let jumpPhase: number | null = null;
  if (
    !e.reduced &&
    !sleeping &&
    !following &&
    !eating &&
    activity !== "chasing" &&
    !nonJumpers.has(f.species) &&
    f.playful > 0.35 &&
    f.seed % 4 < 1
  ) {
    const period = 60 + (f.seed % 40),
      cycle = (((e.time + f.seed * 3) % period) + period) % period;
    if (cycle > period - 3.6) {
      jumpPhase = (cycle - (period - 3.6)) / 3.6;
      activity = "jumping";
    }
  }
  return { x, y, activity, sleeping, jumpPhase };
}

/** Approach the surface, leap through the air, then return to the original swimming point. */
export function jumpPosition(
  start: Point,
  phase: number,
  width: number,
  height: number,
  size: number,
): Point & { splash: boolean } {
  const p = clamp(phase, 0, 1),
    surface = waterSurface(height),
    edge = surface + 12,
    peak = Math.max(34 * size + 4, surface - 32 * size);
  let y: number;
  if (p < 0.25) y = mix(start.y, edge, smooth(p / 0.25));
  else if (p <= 0.75)
    y = edge - (edge - peak) * Math.sin((Math.PI * (p - 0.25)) / 0.5);
  else y = mix(edge, start.y, smooth((p - 0.75) / 0.25));
  return {
    x: clamp(
      start.x + Math.sin(Math.PI * p) * 32,
      35,
      Math.max(35, width - 35),
    ),
    y,
    splash: Math.abs(p - 0.25) < 0.065 || Math.abs(p - 0.75) < 0.065,
  };
}

export function frogSnack(
  seed: number,
  time: number,
  position: Point,
  height: number,
  reduced = false,
) {
  const cycle = (((time + seed) % 12) + 12) % 12;
  const x = position.x + Math.sin((reduced ? 0 : time) * 1.4 + seed) * 38;
  const y = Math.max(
    11,
    waterSurface(height) - 30 + Math.cos((reduced ? 0 : time) * 2 + seed) * 5,
  );
  const reach =
    cycle < 9 || cycle > 9.6
      ? 0
      : cycle < 9.25
        ? (cycle - 9) / 0.25
        : 1 - (cycle - 9.25) / 0.35;
  return {
    x,
    y,
    visible: cycle < 9.25,
    tongue: reduced ? 0 : clamp(reach, 0, 1),
  };
}
