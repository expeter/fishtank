/** Sand thickness is a fraction of world height, measured upward from the floor. */
export const TERRAIN_BINS = 48;
export const MAX_SAND_HEIGHT = 0.22;
export const DEFAULT_SAND_HEIGHT = 0.14;
const clamp = (value: number, minimum: number, maximum: number) =>
  Math.max(minimum, Math.min(maximum, value));
const boundedHeight = (value: number | undefined) =>
  typeof value === "number" && Number.isFinite(value)
    ? clamp(value, 0, MAX_SAND_HEIGHT)
    : DEFAULT_SAND_HEIGHT;

export function createTerrain(height = DEFAULT_SAND_HEIGHT): number[] {
  return Array.from({ length: TERRAIN_BINS }, () => boundedHeight(height));
}

/** Linear sampling remains cheap enough for shoreline drawing and animal floor targets. */
export function sampleTerrainHeight(
  terrain: readonly number[] | undefined,
  x: number,
): number {
  if (!terrain?.length) return DEFAULT_SAND_HEIGHT;
  if (terrain.length === 1) return boundedHeight(terrain[0]);
  const position =
    clamp(Number.isFinite(x) ? x : 0.5, 0, 1) * (terrain.length - 1);
  const left = Math.floor(position),
    fraction = position - left;
  const first = boundedHeight(terrain[left]),
    next = boundedHeight(terrain[Math.min(left + 1, terrain.length - 1)]);
  return first + (next - first) * fraction;
}

/** Normalized canvas Y at the top of the sand (a taller pile has a smaller Y). */
export function terrainSurface(
  terrain: readonly number[] | undefined,
  x: number,
): number {
  return 1 - sampleTerrainHeight(terrain, x);
}

/** Optional saved terrain always becomes a fresh, bounded 48-bin profile on editing. */
export function normalizeTerrain(terrain?: readonly number[]): number[] {
  return Array.from({ length: TERRAIN_BINS }, (_, i) =>
    sampleTerrainHeight(terrain, i / (TERRAIN_BINS - 1)),
  );
}

/**
 * A soft round brush adds/removes only nearby sand. Call once per sampled pointer
 * movement, not every render frame; amount is signed thickness (typically .015).
 * The per-stroke cap avoids cliffs after a delayed or unexpectedly large input.
 */
export function brushTerrain(
  terrain: readonly number[] | undefined,
  x: number,
  amount: number,
  radius = 0.045,
): number[] {
  const result = normalizeTerrain(terrain);
  if (!Number.isFinite(x) || !Number.isFinite(amount) || amount === 0)
    return result;
  const center = clamp(x, 0, 1);
  const reach = clamp(
    Number.isFinite(radius) && radius > 0 ? radius : 0.045,
    1 / (TERRAIN_BINS - 1),
    1,
  );
  const strength = clamp(amount, -0.04, 0.04);
  for (let i = 0; i < TERRAIN_BINS; i++) {
    const distance = Math.abs(i / (TERRAIN_BINS - 1) - center) / reach;
    if (distance >= 1) continue;
    const softness = (1 + Math.cos(distance * Math.PI)) / 2;
    result[i] =
      Math.round(
        clamp(result[i] + strength * softness, 0, MAX_SAND_HEIGHT) * 1e6,
      ) / 1e6;
  }
  return result;
}
