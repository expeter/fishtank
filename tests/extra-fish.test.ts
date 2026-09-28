import { expect, it } from "vitest";
import {
  extraFishDefinitions,
  extraFishVariants,
  extraFishKnowledge,
  extraFishDiscovery,
} from "../src/extraFish";

it("provides matched offline bilingual care, biology and bounded natural palettes for every addition", () => {
  const ids = extraFishDefinitions.map((f) => f.id).sort();
  expect(ids).toEqual(["cherry_barb", "harlequin", "molly"]);
  for (const registry of [
    extraFishVariants,
    extraFishKnowledge,
    extraFishDiscovery,
  ])
    expect(Object.keys(registry).sort()).toEqual(ids);
  for (const f of extraFishDefinitions) {
    expect(f.habitat).toBe("aquarium");
    const k = extraFishKnowledge[f.id];
    for (const field of [
      k.overview,
      k.lifespan,
      k.social,
      k.water,
      k.home,
      k.food,
      k.care,
      ...k.facts,
      ...Object.values(extraFishDiscovery[f.id]),
    ]) {
      for (const lang of ["en", "de"] as const) {
        expect(field[lang].length).toBeGreaterThan(12);
        expect(field[lang]).not.toMatch(/https?:/);
      }
    }
    const variants = extraFishVariants[f.id];
    expect(new Set(variants.map((v) => v.id)).size).toBe(variants.length);
    for (const variant of variants) {
      expect(variant.color).toMatch(/^#[0-9a-f]{6}$/);
      expect(variant.accent).toMatch(/^#[0-9a-f]{6}$/);
    }
  }
});
