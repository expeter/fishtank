import { expect, it } from "vitest";
import { animals, createSave, validSave } from "../src/game";
import { fishDiscovery, fishKnowledge } from "../src/fishKnowledge";
it("offers a complete offline bilingual care portrait for every offered animal", () => {
  expect(Object.keys(fishKnowledge).sort()).toEqual(
    animals.map((a) => a.id).sort(),
  );
  for (const a of animals) {
    const k = fishKnowledge[a.id];
    expect(k.scientific.length).toBeGreaterThan(3);
    for (const key of [
      "overview",
      "lifespan",
      "social",
      "water",
      "home",
      "food",
      "care",
    ] as const) {
      for (const lang of ["en", "de"] as const) {
        expect(k[key][lang].length).toBeGreaterThan(12);
        expect(k[key][lang]).not.toMatch(/https?:\/\//);
      }
    }
    expect(k.facts.length).toBeGreaterThan(0);
  }
});
it("preserves optional pump settings while rejecting malformed saves", () => {
  const s = createSave(0, "Room", "creative");
  expect(validSave(s)).toBe(true);
  s.worlds.aquarium.pumpOn = false;
  expect(validSave(JSON.parse(JSON.stringify(s)))).toBe(true);
  expect(
    validSave({
      ...s,
      worlds: {
        ...s.worlds,
        aquarium: { ...s.worlds.aquarium, pumpOn: "yes" },
      },
    }),
  ).toBe(false);
});

it("provides seven distinct bilingual discovery chapters for all thirty animals", () => {
  expect(Object.keys(fishDiscovery).sort()).toEqual(
    animals.map((a) => a.id).sort(),
  );
  const keys = [
    "native",
    "adultSize",
    "anatomy",
    "lifecycle",
    "wildDiet",
    "behavior",
    "mistakes",
  ] as const;
  for (const key of keys) {
    for (const lang of ["en", "de"] as const) {
      const paragraphs = animals.map((a) => fishDiscovery[a.id][key][lang]);
      expect(new Set(paragraphs).size).toBe(animals.length);
      for (const paragraph of paragraphs) {
        expect(paragraph.length).toBeGreaterThan(60);
        expect(paragraph).not.toMatch(/https?:\/\/|TODO|TBD/);
      }
    }
  }
});
