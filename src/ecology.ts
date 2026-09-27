import { progress, type Fish } from "./game";
import { lifeNoise } from "./feeding";
export const predatorSpecies = new Set(["angelfish", "betta", "puffer", "ray"]);
export interface EcologyEvent {
  predatorId: string;
  babyId: string;
}
/** Optional simplified food-chain play. Call once per active minute, never from offline catch-up.
 * Named animals, purchased animals, and the last two residents are always protected.
 * Only different-species, home-born fry less than ten minutes old are eligible. */
export function ecologyEvent(
  fish: readonly Fish[],
  enabled: boolean,
  active: boolean,
  now: number,
  previousCheck: number,
): EcologyEvent | null {
  if (
    !enabled ||
    !active ||
    fish.length < 3 ||
    now - previousCheck < 60000 ||
    now - previousCheck > 90000
  )
    return null;
  const bucket = Math.floor(now / 60000);
  const predators = fish.filter(
    (f) => predatorSpecies.has(f.species) && progress(f) >= 0.85,
  );
  // At most one event per check; about one opportunity in twelve minutes per world.
  if (
    !predators.length ||
    lifeNoise(bucket * 0.83 + predators[0].seed) > 1 / 12
  )
    return null;
  const candidates = fish.filter(
    (f) =>
      f.parents &&
      !f.name.trim() &&
      progress(f) < 0.2 &&
      now - f.born >= 30000 &&
      now - f.born < 600000,
  );
  for (const predator of predators) {
    const babies = candidates.filter(
      (f) => f.species !== predator.species && f.id !== predator.id,
    );
    if (babies.length)
      return {
        predatorId: predator.id,
        babyId:
          babies[Math.floor(lifeNoise(bucket + predator.seed) * babies.length)]
            .id,
      };
  }
  return null;
}
