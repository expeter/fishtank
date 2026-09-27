import { expect, it } from "vitest";
import { animals, buyFish, createSave, makeFish, validSave } from "../src/game";
import { fishVariants } from "../src/fishVariants";
import { fishColor, fishMarkings } from "../src/appearance";
it("covers every shop animal with bounded named natural palettes", () => {
  expect(Object.keys(fishVariants).sort()).toEqual(
    animals.map((a) => a.id).sort(),
  );
  for (const animal of animals) {
    const choices = fishVariants[animal.id];
    expect(choices.length).toBeGreaterThan(0);
    expect(new Set(choices.map((v) => v.id)).size).toBe(choices.length);
    for (const choice of choices) {
      expect(choice.en).toBeTruthy();
      expect(choice.de).toBeTruthy();
      expect(choice.color).toMatch(/^#[0-9a-f]{6}$/i);
      const fish = { ...makeFish(animal.id), variant: choice.id };
      expect(fishColor({ ...fish, seed: 1 })).toBe(choice.color);
      expect(fishColor({ ...fish, seed: 99 })).toBe(choice.color);
      expect(fishMarkings({ ...fish, seed: 1 })).toEqual(
        fishMarkings({ ...fish, seed: 99 }),
      );
    }
  }
});
it("purchases the exact chosen palette without changing its cost", () => {
  const s = createSave(0, "Colours", "progression");
  const next = buyFish(s, "guppy", false, 1234, "blue");
  expect(next.worlds.aquarium.fish.at(-1)?.variant).toBe("blue");
  expect(next.coins).toBe(s.coins - 20);
  expect(next.worlds.aquarium.fish.at(-1)?.grown).toBe(0);
  expect(validSave(JSON.parse(JSON.stringify(next)))).toBe(true);
  expect(buyFish(s, "guppy", false, 1234, "purple-fantasy")).toBe(s);
});
it("supports every palette in creative mode while keeping habitat and capacity rules", () => {
  for (const animal of animals)
    for (const choice of fishVariants[animal.id]) {
      const s = createSave(0, "Colours", "creative");
      s.habitat = animal.habitat;
      const next = buyFish(s, animal.id, true, 1234, choice.id);
      expect(next.worlds[s.habitat].fish.at(-1)?.variant).toBe(choice.id);
      expect(next.coins).toBe(s.coins);
      expect(validSave(next)).toBe(true);
    }
});
it("accepts legacy fish but rejects unknown or cross-species variants", () => {
  const s = createSave(0, "Old", "creative");
  delete s.worlds.aquarium.fish[0].variant;
  expect(validSave(s)).toBe(true);
  s.worlds.aquarium.fish[0].variant = "blue-gold";
  expect(validSave(s)).toBe(false);
});
