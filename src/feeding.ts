import type { Fish } from "./game";

/** Stable noise lets saved personalities differ without rerolling every animation frame. */
export function lifeNoise(seed: number): number {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return n - Math.floor(n);
}
export type FoodKind = "flakes" | "pellets" | "worms" | "insects" | "algae";
export interface FoodParticle {
  kind?: FoodKind;
  id: number;
  x: number;
  y: number;
  t: number;
  batch: number;
  size: number;
  shape: "flake" | "crumb" | "pellet";
  color: string;
  rotation: number;
  drift: number;
  sink: number;
}
const colors = ["#ffe289", "#dd803e", "#efba56", "#aaca62", "#f7ce8b"];
/** All positions and velocities are fractions of the world; time is performance milliseconds. */
export function scatterFood(
  x: number,
  y: number,
  now: number,
  batch: number,
  kind: FoodKind = "flakes",
): FoodParticle[] {
  const count = 8 + Math.floor(lifeNoise(batch + 18) * 7);
  return Array.from({ length: count }, (_, i) => {
    const seed = batch * 19 + i * 7;
    return {
      id: batch * 32 + i,
      kind,
      batch,
      t: now,
      x: Math.max(0.025, Math.min(0.975, x + (lifeNoise(seed) - 0.5) * 0.1)),
      y: kind === "insects" ? y : y + (lifeNoise(seed + 1) - 0.5) * 0.035,
      size:
        (kind === "worms" || kind === "algae" ? 3 : 1.7) +
        lifeNoise(seed + 2) * 2.6,
      shape: (["flake", "crumb", "pellet"] as const)[
        Math.floor(lifeNoise(seed + 3) * 3)
      ],
      color:
        kind === "worms"
          ? ["#e85c65", "#d94e58", "#f48b7a"][i % 3]
          : kind === "pellets"
            ? ["#ac7445", "#c58c51", "#95633b"][i % 3]
            : kind === "algae"
              ? ["#88b650", "#b0c95f", "#659548"][i % 3]
              : kind === "insects"
                ? "#403938"
                : colors[Math.floor(lifeNoise(seed + 4) * colors.length)],
      rotation: lifeNoise(seed + 5) * Math.PI,
      drift: (lifeNoise(seed + 6) - 0.5) * 0.004,
      sink:
        kind === "insects"
          ? 0
          : kind === "algae"
            ? 0.028 + lifeNoise(seed + 8) * 0.015
            : kind === "pellets"
              ? 0.014 + lifeNoise(seed + 8) * 0.012
              : 0.004 + lifeNoise(seed + 8) * 0.012,
    };
  });
}
export function advanceFood(
  food: FoodParticle,
  elapsedMs: number,
  now: number,
): void {
  if (food.y >= 0.87) {
    food.y = 0.87;
    return;
  }
  const dt = Math.max(0, Math.min(100, elapsedMs)) / 1000;
  food.x = Math.max(
    0.015,
    Math.min(
      0.985,
      food.x + (food.drift + Math.sin(now / 650 + food.id) * 0.0015) * dt,
    ),
  );
  food.y = Math.min(0.87, food.y + food.sink * dt);
  food.rotation += food.drift * 55 * dt;
}
/** Simplified game preferences, not feeding instructions for real aquariums. */
export function foodPreference(species: string, kind: FoodKind): number {
  if (species === "frog")
    return kind === "insects" ? 1 : kind === "worms" ? 0.8 : 0;
  if (["snail", "tang", "achilles_tang"].includes(species))
    return kind === "algae"
      ? 1
      : kind === "flakes"
        ? 0.7
        : kind === "pellets"
          ? 0.65
          : 0.15;
  if (
    [
      "betta",
      "angelfish",
      "puffer",
      "seahorse",
      "mandarin",
      "firefish",
      "gramma",
      "ray",
      "ghostknife",
      "zebra_shark",
    ].includes(species)
  )
    return kind === "worms"
      ? 1
      : kind === "insects"
        ? 0.8
        : kind === "pellets"
          ? 0.75
          : kind === "flakes"
            ? 0.65
            : 0.15;
  if (["shrimp", "crab", "cory"].includes(species))
    return kind === "algae" || kind === "pellets"
      ? 0.95
      : kind === "worms"
        ? 0.8
        : kind === "flakes"
          ? 0.7
          : 0.3;
  return kind === "flakes"
    ? 0.7
    : kind === "pellets"
      ? 0.8
      : kind === "worms"
        ? 0.85
        : kind === "algae"
          ? 0.6
          : 0.55;
}
/** A fish chooses one pellet, with an individual reaction delay and appetite for this drop.
 * Return null for full or uninterested fish; care is applied only after reaching and eating a pellet. */
export function foodForFish(
  fish: Fish,
  food: readonly FoodParticle[],
  now: number,
  position?: { x: number; y: number },
): FoodParticle | null {
  if (fish.hunger <= 15 || !food.length) return null;
  const bottomFeeder = ["crab", "shrimp", "cory", "ray", "snail"].includes(
    fish.species,
  );
  const appetite =
    0.28 +
    Math.min(100, Math.max(0, fish.hunger)) * 0.0045 +
    fish.playful * 0.12;
  const origin = position ?? fish;
  let target: FoodParticle | null = null,
    best = Infinity;
  for (const pellet of food) {
    if (bottomFeeder && pellet.y < 0.8) continue;
    const preference = foodPreference(fish.species, pellet.kind ?? "flakes");
    if (
      fish.species === "frog" &&
      (preference === 0 || Math.abs(origin.y - pellet.y) > 0.065)
    )
      continue;
    if (
      lifeNoise(fish.seed * 3.1 + pellet.batch * 1.73) >
      appetite + (preference - 0.7) * 0.28
    )
      continue;
    const delay = 180 + lifeNoise(fish.seed * 2.7 + pellet.batch * 0.37) * 2200;
    if (now - pellet.t < delay) continue;
    const distance = Math.hypot(origin.x - pellet.x, origin.y - pellet.y);
    // Nearby food, a stable favorite crumb, and curiosity each affect the choice.
    const score =
      distance +
      lifeNoise(fish.seed + pellet.id * 0.61) * 0.22 +
      (1 - preference) * 0.12;
    if (score < best) {
      best = score;
      target = pellet;
    }
  }
  return target;
}
