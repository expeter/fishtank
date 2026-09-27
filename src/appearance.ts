import { animals, type Fish } from "./game";
import { lifeNoise } from "./feeding";

/** A saved seed gives each animal a stable shade without changing its species identity. */
export function fishColor(fish: Pick<Fish, "species" | "seed">): string {
  const hex = animals.find((a) => a.id === fish.species)!.color;
  const [r, g, b] = [1, 3, 5].map(
    (i) => parseInt(hex.slice(i, i + 2), 16) / 255,
  );
  const high = Math.max(r, g, b),
    low = Math.min(r, g, b),
    delta = high - low,
    light = (high + low) / 2;
  let hue = 0;
  if (delta)
    hue =
      high === r
        ? ((g - b) / delta) % 6
        : high === g
          ? (b - r) / delta + 2
          : (r - g) / delta + 4;
  hue = (hue * 60 + 360) % 360;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * light - 1));
  const seed = ((fish.seed % 100) + 100) % 100;
  const ornamental = [
    "guppy",
    "goldfish",
    "betta",
    "platy",
    "discus",
    "swordtail",
  ].includes(fish.species);
  const shift = (seed / 100 - 0.5) * (ornamental ? 150 : 38);
  const brightness = Math.sin(seed * 1.71) * 0.045;
  return `hsl(${((hue + shift + 360) % 360).toFixed(1)} ${(saturation * 100).toFixed(1)}% ${(Math.max(0.32, Math.min(0.82, light + brightness)) * 100).toFixed(1)}%)`;
}

export function fishSize(fish: Pick<Fish, "seed">): number {
  return 0.94 + (Math.sin(fish.seed * 0.91) + 1) * 0.06;
}

export interface FishMarkings {
  pattern: "plain" | "freckles" | "bands" | "patches" | "shimmer";
  accent: string;
  pale: string;
  bodyWidth: number;
  bodyHeight: number;
  tailLength: number;
  tailFan: number;
  marks: { x: number; y: number; size: number }[];
}
/** Coordinates fit the common body ellipse (-24..24, -15..15). Clip to the
 * species silhouette in the renderer so markings never obscure its identifying fins. */
export function fishMarkings(
  fish: Pick<Fish, "seed" | "species">,
): FishMarkings {
  const n = (salt: number) => lifeNoise(fish.seed + salt * 17.3);
  const hue = Math.floor(n(8) * 360);
  return {
    pattern: (["plain", "freckles", "bands", "patches", "shimmer"] as const)[
      Math.floor(n(1) * 5)
    ],
    accent: `hsla(${hue}, 72%, 27%, 0.68)`,
    pale: `hsla(${(hue + 35) % 360}, 95%, 88%, 0.75)`,
    bodyWidth: 0.91 + n(2) * 0.18,
    bodyHeight: 0.87 + n(3) * 0.26,
    tailLength: 0.78 + n(4) * 0.48,
    tailFan: 0.78 + n(5) * 0.5,
    marks: Array.from({ length: 7 }, (_, i) => ({
      x: -16 + n(20 + i * 3) * 34,
      y: -10 + n(21 + i * 3) * 20,
      size: 1.4 + n(22 + i * 3) * 3.5,
    })),
  };
}
