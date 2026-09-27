import { fishVariants, getFishVariant } from "./fishVariants";
import { toyDecorations } from "./toys";
import type { FoodKind } from "./feeding";
export const FOOD_PRICES: Readonly<Record<FoodKind, number>> = {
  flakes: 1,
  pellets: 1,
  algae: 1,
  worms: 2,
  insects: 2,
};
export type Lang = "en" | "de";
export type Habitat = "aquarium" | "sea";
export type Mode = "progression" | "creative";
export type WorldSize = "small" | "medium" | "large";
export const slotSize = (id: number): WorldSize =>
  (["small", "medium", "large"] as const)[id] ?? "small";
export const SAND_BINS = 48;
export const MAX_SAND_HEIGHT = 0.22;
export const ANIMAL_CAPACITY = 24;
export const VERSION = "1.0.5";
export const tiers = [0, 150, 600, 1800, 6000, 20000, 60000],
  prices = [20, 60, 180, 500, 2000, 8000, 24000],
  growth = [600, 1800, 7200, 14400, 14400, 21600, 43200];
export const animals = [
  ["guppy", "Guppy", "Guppy", "aquarium", 0, "#ffc328"],
  ["goldfish", "Goldfish", "Goldfisch", "aquarium", 0, "#ff7424"],
  ["tetra", "Neon tetra", "Neonsalmler", "aquarium", 1, "#11c7eb"],
  ["angelfish", "Angelfish", "Skalar", "aquarium", 2, "#9462f5"],
  ["snail", "Window snail", "Schnecke", "aquarium", 0, "#d5a36d"],
  ["frog", "Little frog", "Kleiner Frosch", "aquarium", 3, "#91b86d"],
  ["clownfish", "Clownfish", "Clownfisch", "sea", 0, "#ff8623"],
  ["tang", "Blue tang", "Paletten-Doktorfisch", "sea", 1, "#267dff"],
  ["butterfly", "Butterflyfish", "Falterfisch", "sea", 2, "#f2d277"],
  ["seahorse", "Seahorse", "Seepferdchen", "sea", 3, "#ff5ca3"],
  ["shrimp", "Shrimp", "Garnele", "sea", 1, "#e8a197"],
  ["crab", "Little crab", "Kleine Krabbe", "sea", 0, "#dc856a"],
  ["betta", "Betta", "Kampffisch", "aquarium", 1, "#ff385c"],
  ["discus", "Discus", "Diskusfisch", "aquarium", 3, "#ff9d18"],
  ["zebrafish", "Zebrafish", "Zebrabärbling", "aquarium", 0, "#41c4fa"],
  ["cory", "Cory catfish", "Panzerwels", "aquarium", 1, "#daa24d"],
  ["swordtail", "Swordtail", "Schwertträger", "aquarium", 2, "#ff6026"],
  ["platy", "Platy", "Platy", "aquarium", 0, "#ffc627"],
  ["mandarin", "Mandarinfish", "Mandarinfisch", "sea", 3, "#20d5b3"],
  ["gramma", "Royal gramma", "Königsfeenbarsch", "sea", 1, "#b941f2"],
  ["firefish", "Fire goby", "Feuergrundel", "sea", 1, "#ff604a"],
  ["puffer", "Pufferfish", "Kugelfisch", "sea", 2, "#f2cb2d"],
  ["ray", "Spotted ray", "Fleckenrochen", "sea", 3, "#518add"],
  ["jelly", "Moon jelly", "Ohrenqualle", "sea", 2, "#c36bff"],
  [
    "pearl_gourami",
    "Pearl gourami",
    "Mosaikfadenfisch",
    "aquarium",
    4,
    "#efd6ba",
  ],
  [
    "rainbowfish",
    "Boesemani rainbowfish",
    "Boesemans Regenbogenfisch",
    "aquarium",
    5,
    "#f6a82d",
  ],
  [
    "ghostknife",
    "Black ghost knifefish",
    "Weißstirn-Messerfisch",
    "aquarium",
    6,
    "#343b64",
  ],
  [
    "regal_angelfish",
    "Regal angelfish",
    "Pfauenkaiserfisch",
    "sea",
    4,
    "#f8cc32",
  ],
  [
    "achilles_tang",
    "Achilles tang",
    "Achilles-Doktorfisch",
    "sea",
    5,
    "#313a58",
  ],
  ["zebra_shark", "Zebra shark", "Zebrahai", "sea", 6, "#d6b781"],
].map(([id, en, de, habitat, tier, color]) => ({
  id: String(id),
  en: String(en),
  de: String(de),
  habitat: habitat as Habitat,
  tier: Number(tier),
  color: String(color),
}));
export const decorations = [
  "Leafy fern",
  "Ribbon grass",
  "River stones",
  "Little cave",
  "Driftwood",
  "Lily pad",
  "Bubble tower",
  "Tiny castle",
  "Flower pot",
  "Archway",
  "Pebble trail",
  "Sunken teacup",
  "Pink coral",
  "Sea grass",
  "Pearl shell",
  "Sea arch",
  "Starfish garden",
  "Treasure chest",
  "Fan coral",
  "Sunken boat",
  "Anemone",
  "Shell trail",
  "Coral castle",
  "Message bottle",
].map((en, i) => ({
  id: `d${i}`,
  en,
  de: [
    "Blattfarn",
    "Seegras",
    "Flusssteine",
    "Kleine Höhle",
    "Treibholz",
    "Seerose",
    "Blasenturm",
    "Kleine Burg",
    "Blumentopf",
    "Steinbogen",
    "Kieselpfad",
    "Versunkene Teetasse",
    "Rosa Koralle",
    "Meeresgras",
    "Perlmuschel",
    "Meeresbogen",
    "Seesterngarten",
    "Schatzkiste",
    "Fächerkoralle",
    "Versunkenes Boot",
    "Anemone",
    "Muschelpfad",
    "Korallenburg",
    "Flaschenpost",
  ][i],
  habitat: (i < 12 ? "aquarium" : "sea") as Habitat,
  tier: Math.floor((i % 12) / 3),
  price: [15, 35, 80, 150][Math.floor((i % 12) / 3)],
  kind: i % 6,
}));
decorations.push(...toyDecorations);
export function canLiveIn(species: string, habitat: Habitat) {
  return (
    animals.some((a) => a.id === species && a.habitat === habitat) ||
    (habitat === "aquarium" && ["crab", "shrimp"].includes(species))
  );
}
export interface Fish {
  trick?: {
    points: { x: number; y: number }[];
    learnedAt: number;
    rehearsals: number;
  };
  id: string;
  species: string;
  /** Absent on older fish: keep their original appearance. */
  variant?: string;
  name: string;
  born: number;
  grown: number;
  hunger: number;
  mood: number;
  playful: number;
  x: number;
  y: number;
  seed: number;
  careUntil: number;
  /** Updated only when this animal actually eats. */
  lastFedAt?: number;
  /** Present only for animals born in this world; optional for existing schema-1 saves. */
  parents?: [string, string];
}
export interface Decoration {
  id: string;
  kind: string;
  x: number;
  y: number;
  scale: number;
  flip: boolean;
  /** Degrees; absent in older saves means no rotation. */
  rotation?: number;
  layer: number;
}
export interface World {
  /** Fixed CSS-pixel dimensions, captured once and retained across screen changes. */
  viewSize?: { width: number; height: number };
  cleanup?: { glass: number[]; litter: number[] };
  pumpOn?: boolean;
  fish: Fish[];
  decor: Decoration[];
  size?: WorldSize;
  /** Raised sand as fractions of world height; absent means a flat floor. */
  sand?: number[];
  background: number;
  ground: number;
}
export interface Save {
  /** Incomplete active minute; offline time never contributes. */
  allowanceSeconds?: number;
  schema: 1;
  id: number;
  name: string;
  mode: Mode;
  coins: number;
  earned: number;
  habitat: Habitat;
  worlds: Record<Habitat, World>;
  inventory: string[];
  lastAt: number;
  breedAt: Record<string, number>;
  created: number;
  tutorial: boolean;
  story?: { fed: boolean; planted: boolean; hidden: boolean };
  predators?: boolean;
  playGift?: boolean;
  lastHuntAt?: number;
}
let idSequence = 0;
export function uid(): string {
  const crypto = globalThis.crypto;
  if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
  // getRandomValues also works where randomUUID is unavailable (e.g. HTTP).
  if (typeof crypto?.getRandomValues === "function") {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return [
      hex.slice(0, 4),
      hex.slice(4, 6),
      hex.slice(6, 8),
      hex.slice(8, 10),
      hex.slice(10),
    ]
      .map((part) => part.join(""))
      .join("-");
  }
  // These are local game-object IDs, not security tokens. The counter also
  // distinguishes objects created in the same millisecond.
  return `local-${Date.now().toString(36)}-${(++idSequence).toString(36)}-${Math.random().toString(36).slice(2)}`;
}
export function makeFish(
  species: string,
  adult = false,
  now = Date.now(),
): Fish {
  const s = animals.find((a) => a.id === species)!;
  return {
    id: uid(),
    species,
    variant: fishVariants[species]?.[0]?.id,
    name: "",
    born: now,
    grown: adult ? growth[s.tier] : 0,
    hunger: 20,
    mood: 80,
    playful: Math.random(),
    x: 0.15 + Math.random() * 0.7,
    y: 0.3 + Math.random() * 0.48,
    seed: Math.random() * 100,
    careUntil: 0,
  };
}
export function createSave(
  id: number,
  name: string,
  mode: Mode,
  now = Date.now(),
): Save {
  return {
    schema: 1,
    id,
    name,
    mode,
    coins: 100,
    earned: 0,
    habitat: "aquarium",
    worlds: {
      aquarium: {
        size: slotSize(id),
        fish: [makeFish("guppy", false, now), makeFish("guppy", false, now)],
        decor: [
          {
            id: uid(),
            kind: "d0",
            x: 0.14,
            y: 0.83,
            scale: 1.3,
            flip: false,
            layer: 0,
          },
          {
            id: uid(),
            kind: "d1",
            x: 0.83,
            y: 0.87,
            scale: 1.1,
            flip: false,
            layer: 1,
          },
          {
            id: uid(),
            kind: "d2",
            x: 0.65,
            y: 0.9,
            scale: 1,
            flip: false,
            layer: 2,
          },
        ],
        background: 0,
        ground: 0,
      },
      sea: {
        size: slotSize(id),
        fish: [],
        decor: [
          {
            id: uid(),
            kind: "d12",
            x: 0.2,
            y: 0.85,
            scale: 1,
            flip: false,
            layer: 0,
          },
        ],
        background: 0,
        ground: 0,
      },
    },
    inventory: ["d0", "d1", "d2", "d12"],
    lastAt: now,
    breedAt: {},
    created: now,
    tutorial: true,
  };
}
/** Fish and helpers share one limit in each habitat, including creative worlds. */
export const capacity = (_s: Save) => ANIMAL_CAPACITY;
/** Migrate dimensions without trimming residents or changing saved coordinates. */
export function normalizeSave(save: Save): Save {
  const next = structuredClone(save);
  for (const world of Object.values(next.worlds))
    world.size = slotSize(next.id);
  return next;
}
export const speciesOf = (f: Fish) => animals.find((a) => a.id === f.species)!;
export const progress = (f: Fish) =>
  Math.min(1, f.grown / growth[speciesOf(f).tier]);
export const value = (f: Fish) =>
  Math.floor(prices[speciesOf(f).tier] * (0.5 + 1.5 * progress(f)));
export function advance(save: Save, now = Date.now(), offline = false): Save {
  const s = normalizeSave(save);
  const elapsed = Math.max(0, Math.min(604800, (now - s.lastAt) / 1000));
  for (const w of Object.values(s.worlds))
    for (const f of w.fish) {
      const boost = Math.min(
        elapsed,
        Math.max(0, (f.careUntil - s.lastAt) / 1000),
      );
      f.grown = Math.min(growth[speciesOf(f).tier], f.grown + elapsed + boost);
      if (!offline) {
        f.hunger = Math.min(100, f.hunger + elapsed / 60);
        f.mood = Math.max(45, f.mood - elapsed / 180);
      }
    }
  if (!offline && s.mode === "progression") {
    const activeSeconds = (s.allowanceSeconds ?? 0) + elapsed;
    s.coins += Math.floor(activeSeconds / 60) * 5;
    s.allowanceSeconds = activeSeconds % 60;
  }
  s.lastAt = Math.max(s.lastAt, now);
  return s;
}
/** Expensive species cannot print saleable newborns every five minutes. */
export const breedingCooldown = (tier: number) =>
  Math.max(300000, growth[tier] * 500);
/** Food is paid for per drop, never per animal. A rejected purchase is unchanged. */
export function buyFood(s: Save, kind: FoodKind): Save {
  const price = FOOD_PRICES[kind];
  if (price === undefined || s.mode === "creative" || s.coins < price) return s;
  const next = structuredClone(s);
  next.coins -= price;
  return next;
}
/** Purchases always start young in progression, even if a stale adult toggle is set. */
export function buyFish(
  s: Save,
  species: string,
  adult = false,
  now = Date.now(),
  variant = fishVariants[species]?.[0]?.id,
): Save {
  const animal = animals.find((a) => a.id === species);
  if (
    !animal ||
    !getFishVariant(species, variant) ||
    !canLiveIn(species, s.habitat) ||
    s.worlds[s.habitat].fish.length >= capacity(s) ||
    (s.mode === "progression" &&
      (s.coins < prices[animal.tier] || s.earned < tiers[animal.tier]))
  )
    return s;
  const next = structuredClone(s);
  if (next.mode === "progression") next.coins -= prices[animal.tier];
  next.worlds[next.habitat].fish.push({
    ...makeFish(species, next.mode === "creative" && adult, now),
    variant,
  });
  return next;
}
export function breed(s: Save, now = Date.now(), random = Math.random): Save {
  const next = structuredClone(s);
  for (const [hab, w] of Object.entries(next.worlds)) {
    if (w.fish.length >= capacity(s)) continue;
    for (const a of animals.filter(
      (a) =>
        a.habitat === hab &&
        !["snail", "frog", "shrimp", "crab"].includes(a.id),
    )) {
      const key = hab + a.id;
      if (now - (next.breedAt[key] ?? now) < breedingCooldown(a.tier)) {
        next.breedAt[key] ??= now;
        continue;
      }
      next.breedAt[key] = now;
      const parents = w.fish.filter(
        (f) =>
          f.species === a.id &&
          progress(f) === 1 &&
          f.lastFedAt !== undefined &&
          now >= f.lastFedAt &&
          now - f.lastFedAt <= 1800000 &&
          f.hunger <= 60,
      );
      if (
        parents.length >= 2 &&
        w.fish.length < capacity(s) &&
        random() < 0.35
      ) {
        const baby = makeFish(a.id, false, now);
        baby.parents = [parents[0].id, parents[1].id];
        baby.x = (parents[0].x + parents[1].x) / 2;
        baby.y = (parents[0].y + parents[1].y) / 2;
        w.fish.push(baby);
      }
    }
  }
  return next;
}
export function sell(s: Save, id: string): Save {
  const next = structuredClone(s),
    w = next.worlds[next.habitat],
    f = w.fish.find((f) => f.id === id);
  if (!f) return s;
  const earned = value(f);
  w.fish = w.fish.filter((f) => f.id !== id);
  if (s.mode === "progression") {
    next.coins += earned;
    next.earned += earned;
  }
  return next;
}
export function rescue(s: Save): Save {
  if (
    s.mode === "progression" &&
    s.coins < 20 &&
    Object.values(s.worlds).every((w) => !w.fish.length)
  ) {
    const n = structuredClone(s);
    n.worlds.aquarium.fish.push(makeFish("guppy"));
    n.habitat = "aquarium";
    return n;
  }
  return s;
}
export function validSave(s: unknown): s is Save {
  if (!s || typeof s !== "object") return false;
  const v = s as Save;
  const finite = (x: unknown) => typeof x === "number" && Number.isFinite(x);
  return (
    v.schema === 1 &&
    (v.allowanceSeconds === undefined ||
      (finite(v.allowanceSeconds) &&
        v.allowanceSeconds >= 0 &&
        v.allowanceSeconds < 60)) &&
    [0, 1, 2].includes(v.id) &&
    typeof v.name === "string" &&
    finite(v.coins) &&
    v.coins >= 0 &&
    finite(v.earned) &&
    finite(v.lastAt) &&
    finite(v.created) &&
    ["creative", "progression"].includes(v.mode) &&
    ["aquarium", "sea"].includes(v.habitat) &&
    typeof v.tutorial === "boolean" &&
    (v.predators === undefined || typeof v.predators === "boolean") &&
    (v.playGift === undefined || typeof v.playGift === "boolean") &&
    (v.lastHuntAt === undefined || finite(v.lastHuntAt)) &&
    (v.story === undefined ||
      (!!v.story &&
        [v.story.fed, v.story.planted, v.story.hidden].every(
          (x) => typeof x === "boolean",
        ))) &&
    !!v.breedAt &&
    typeof v.breedAt === "object" &&
    Object.values(v.breedAt).every(finite) &&
    Array.isArray(v.inventory) &&
    v.inventory.every((id) => decorations.some((d) => d.id === id)) &&
    !!v.worlds &&
    ["aquarium", "sea"].every((h) => {
      const w = v.worlds[h as Habitat];
      return (
        !!w &&
        (w.viewSize === undefined ||
          (!!w.viewSize &&
            [w.viewSize.width, w.viewSize.height].every(
              (n) => finite(n) && n >= 240 && n <= 2560,
            ))) &&
        (w.cleanup === undefined ||
          (!!w.cleanup &&
            [w.cleanup.glass, w.cleanup.litter].every(
              (marks) =>
                Array.isArray(marks) &&
                marks.length === 16 &&
                Array.from(marks).every((at) => finite(at) && at >= 0),
            ))) &&
        (w.pumpOn === undefined || typeof w.pumpOn === "boolean") &&
        (w.size === undefined ||
          ["small", "medium", "large"].includes(w.size)) &&
        (w.sand === undefined ||
          (Array.isArray(w.sand) &&
            w.sand.length === SAND_BINS &&
            Array.from(w.sand).every(
              (height) =>
                finite(height) && height >= 0 && height <= MAX_SAND_HEIGHT,
            ))) &&
        [0, 1, 2].includes(w.background) &&
        [0, 1, 2].includes(w.ground) &&
        Array.isArray(w.fish) &&
        Array.isArray(w.decor) &&
        w.fish.every(
          (f) =>
            f &&
            typeof f.id === "string" &&
            typeof f.name === "string" &&
            (f.variant === undefined ||
              (typeof f.variant === "string" &&
                !!getFishVariant(f.species, f.variant))) &&
            (f.lastFedAt === undefined ||
              (finite(f.lastFedAt) && f.lastFedAt >= 0)) &&
            (f.parents === undefined ||
              (Array.isArray(f.parents) &&
                f.parents.length === 2 &&
                f.parents.every((id) => typeof id === "string") &&
                f.parents[0] !== f.parents[1])) &&
            canLiveIn(f.species, h as Habitat) &&
            (f.trick === undefined ||
              (f.trick &&
                finite(f.trick.learnedAt) &&
                finite(f.trick.rehearsals) &&
                f.trick.rehearsals >= 0 &&
                Array.isArray(f.trick.points) &&
                f.trick.points.length >= 4 &&
                f.trick.points.length <= 96 &&
                f.trick.points.every(
                  (p) =>
                    p &&
                    finite(p.x) &&
                    finite(p.y) &&
                    p.x >= 0 &&
                    p.x <= 1 &&
                    p.y >= 0 &&
                    p.y <= 1,
                ))) &&
            [
              f.born,
              f.grown,
              f.hunger,
              f.mood,
              f.playful,
              f.x,
              f.y,
              f.seed,
              f.careUntil,
            ].every(finite),
        ) &&
        w.decor.every(
          (d) =>
            d &&
            typeof d.id === "string" &&
            decorations.some((a) => a.id === d.kind && a.habitat === h) &&
            [d.x, d.y, d.scale, d.layer].every(finite) &&
            typeof d.flip === "boolean" &&
            (d.rotation === undefined ||
              (finite(d.rotation) && d.rotation >= -360 && d.rotation <= 360)),
        )
      );
    })
  );
}
