import { describe, it, expect } from "vitest";
import { fishColor, fishSize } from "../src/appearance";
import {
  animals,
  createSave,
  makeFish,
  breed,
  growth,
  validSave,
} from "../src/game";
import { newBirths } from "../src/births";
describe("individual appearances and family discoveries", () => {
  it("gives each species distinct stable shades and bounded size differences", () => {
    for (const a of animals) {
      const fish = { ...makeFish(a.id), seed: 12, variant: undefined };
      expect(fishColor(fish)).toBe(fishColor(JSON.parse(JSON.stringify(fish))));
      expect(fishColor({ ...fish, seed: 88 })).not.toBe(fishColor(fish));
      for (let seed = 0; seed < 100; seed++) {
        const size = fishSize({ ...fish, seed });
        expect(size).toBeGreaterThanOrEqual(0.94);
        expect(size).toBeLessThanOrEqual(1.06);
      }
    }
  });
  it("records a baby’s family and spawns it between its parents", () => {
    const s = createSave(0, "Family", "progression", 1000);
    const [a, b] = s.worlds.aquarium.fish;
    a.grown = b.grown = growth[0];
    a.lastFedAt = b.lastFedAt = 1000;
    a.x = 0.2;
    b.x = 0.8;
    a.y = 0.3;
    b.y = 0.5;
    s.breedAt.aquariumguppy = 1000;
    const next = breed(s, 301001, () => 0),
      baby = next.worlds.aquarium.fish[2];
    expect(baby.parents).toEqual([a.id, b.id]);
    expect(baby.x).toBeCloseTo(0.5);
    expect(baby.y).toBeCloseTo(0.4);
    expect(baby.grown).toBe(0);
    expect(validSave(next)).toBe(true);
    expect(validSave(s)).toBe(true);
    expect(newBirths(s, next)).toEqual([
      { id: baby.id, habitat: "aquarium", species: "guppy" },
    ]);
    expect(newBirths(null, next)).toEqual([]);
    expect(newBirths(next, structuredClone(next))).toEqual([]);
    const bought = structuredClone(next);
    bought.worlds.aquarium.fish.push(makeFish("guppy"));
    expect(newBirths(next, bought)).toEqual([]);
  });
  it("finds arrivals in the other habitat without treating save switches as births", () => {
    const s = createSave(0, "Family", "creative", 1000);
    const other = structuredClone(s);
    const baby = makeFish("clownfish");
    baby.parents = ["parent-a", "parent-b"];
    other.worlds.sea.fish.push(baby);
    expect(newBirths(s, other)).toEqual([
      { id: baby.id, habitat: "sea", species: "clownfish" },
    ]);
    other.id = 1;
    expect(newBirths(s, other)).toEqual([]);
  });
  it("rejects malformed new metadata while accepting existing saves", () => {
    const s = createSave(0, "Existing", "progression");
    expect(validSave(s)).toBe(true);
    s.worlds.aquarium.fish[0].parents = ["same", "same"];
    expect(validSave(s)).toBe(false);
  });
});
