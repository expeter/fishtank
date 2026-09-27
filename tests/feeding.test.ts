import { describe, expect, it } from "vitest";
import { makeFish } from "../src/game";
import {
  advanceFood,
  foodForFish,
  scatterFood,
  foodPreference,
} from "../src/feeding";
import { fishMarkings } from "../src/appearance";
describe("individual meals and appearances", () => {
  it("scatters different shapes, sizes and speeds, reproducibly for each drop", () => {
    const a = scatterFood(0.5, 0.4, 0, 1),
      b = scatterFood(0.5, 0.4, 0, 2);
    expect(a).toEqual(scatterFood(0.5, 0.4, 0, 1));
    expect(a).not.toEqual(b);
    expect(new Set(a.map((p) => p.shape)).size).toBe(3);
    expect(new Set(a.map((p) => p.color)).size).toBeGreaterThan(2);
    expect(new Set(a.map((p) => p.sink)).size).toBe(a.length);
    const pellet = { ...a[0] },
      y = pellet.y;
    advanceFood(pellet, 100, 500);
    expect(pellet.y).toBeGreaterThan(y);
  });
  it("some fish ignore a drop, others react at different times to different crumbs", () => {
    const food = scatterFood(0.5, 0.4, 0, 1);
    const fish = Array.from({ length: 40 }, (_, seed) => ({
      ...makeFish("guppy"),
      seed,
      hunger: 25,
      playful: 0.5,
    }));
    expect(fish.every((f) => foodForFish(f, food, 100) === null)).toBe(true);
    const early = fish.filter((f) => foodForFish(f, food, 700));
    const later = fish.filter((f) => foodForFish(f, food, 3000));
    expect(early.length).toBeGreaterThan(0);
    expect(later.length).toBeGreaterThan(early.length);
    expect(later.length).toBeLessThan(35);
    expect(
      new Set(later.map((f) => foodForFish(f, food, 3000)?.id)).size,
    ).toBeGreaterThan(2);
    expect(
      fish.filter((f) => foodForFish({ ...f, hunger: 95 }, food, 3000)).length,
    ).toBeGreaterThan(later.length);
    expect(foodForFish(makeFish("frog"), food, 3000)).toBeNull();
  });
  it("lets crumbs settle for bottom feeders while full fish ignore food", () => {
    const food = scatterFood(0.5, 0.4, 0, 1),
      hungry = { ...makeFish("cory"), seed: 3, hunger: 90 };
    expect(foodForFish(hungry, food, 3000)).toBeNull();
    const crumb = { ...food[0], y: 0.8699 };
    for (let i = 0; i < 20; i++) advanceFood(crumb, 100, 3000 + i * 100);
    expect(crumb.y).toBe(0.87);
    const resting = { ...crumb };
    advanceFood(crumb, 100, 6000);
    expect(crumb).toEqual(resting);
    expect(foodForFish(hungry, [crumb], 7000)?.id).toBe(crumb.id);
    expect(foodForFish({ ...hungry, hunger: 15 }, [crumb], 7000)).toBeNull();
    expect(
      foodForFish({ ...hungry, species: "guppy", hunger: 0 }, food, 7000),
    ).toBeNull();
  });
  it("offers floating insects, fast sinking algae, distinct worms and pellet foods", () => {
    const kinds = ["flakes", "pellets", "worms", "insects", "algae"] as const;
    const drops = kinds.map((kind) => scatterFood(0.5, 0.25, 0, 1, kind));
    expect(new Set(drops.map((drop) => drop[0].color)).size).toBe(5);
    for (const [i, kind] of kinds.entries())
      expect(drops[i].every((p) => p.kind === kind)).toBe(true);
    const insect = drops[3][0],
      startY = insect.y;
    for (let i = 0; i < 100; i++) advanceFood(insect, 100, i * 100);
    expect(insect.y).toBe(startY);
    expect(drops[4][0].sink).toBeGreaterThan(drops[0][0].sink);
    expect(drops[2][0].size).toBeGreaterThan(drops[0][0].size);
    expect(foodPreference("tang", "algae")).toBeGreaterThan(
      foodPreference("tang", "worms"),
    );
    expect(foodPreference("betta", "worms")).toBeGreaterThan(
      foodPreference("betta", "algae"),
    );
  });
  it("allows frogs to eat surface insects while rejecting flakes and unreachable deep food", () => {
    const frog = { ...makeFish("frog"), seed: 3, hunger: 90, playful: 0.9 };
    const bugs = scatterFood(0.5, 0.25, 0, 1, "insects");
    expect(foodForFish(frog, bugs, 4000, { x: 0.5, y: 0.24 })).not.toBeNull();
    expect(
      foodForFish(frog, scatterFood(0.5, 0.25, 0, 1), 4000, {
        x: 0.5,
        y: 0.24,
      }),
    ).toBeNull();
    expect(
      foodForFish(
        frog,
        bugs.map((p) => ({ ...p, y: 0.7 })),
        4000,
        { x: 0.5, y: 0.24 },
      ),
    ).toBeNull();
    for (const kind of [
      "flakes",
      "pellets",
      "worms",
      "insects",
      "algae",
    ] as const)
      expect(
        foodForFish(
          { ...frog, species: "guppy", hunger: 15 },
          scatterFood(0.5, 0.5, 0, 1, kind),
          4000,
        ),
      ).toBeNull();
  });
  it("keeps coats and silhouettes stable across saves while giving individuals visible variety", () => {
    const fish = { ...makeFish("guppy"), seed: 3 };
    expect(fishMarkings(fish)).toEqual(
      fishMarkings(JSON.parse(JSON.stringify(fish))),
    );
    const variants = Array.from({ length: 30 }, (_, seed) =>
      fishMarkings({ ...fish, seed }),
    );
    expect(new Set(variants.map((v) => v.pattern)).size).toBe(5);
    expect(new Set(variants.map((v) => v.tailFan)).size).toBe(30);
    for (const v of variants) expect(v.bodyHeight).toBeGreaterThan(0.85);
  });
});
