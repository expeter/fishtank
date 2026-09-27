import { describe, expect, it } from "vitest";
import {
  advance,
  breed,
  capacity,
  createSave,
  makeFish,
  normalizeSave,
  SAND_BINS,
  slotSize,
  validSave,
} from "../src/game";

describe("fixed slot worlds", () => {
  it("uses small, medium and large in both habitats", () => {
    for (const [id, size] of ["small", "medium", "large"].entries()) {
      expect(slotSize(id)).toBe(size);
      const save = createSave(id, "Home", "creative");
      expect(save.worlds.aquarium.size).toBe(size);
      expect(save.worlds.sea.size).toBe(size);
    }
  });
  it("normalizes legacy sizes while preserving all residents, furniture and coordinates", () => {
    const save = createSave(2, "Old world", "creative", 1000);
    delete save.worlds.sea.size;
    save.worlds.aquarium.size = "small";
    save.worlds.aquarium.fish = Array.from({ length: 100 }, () =>
      makeFish("guppy"),
    );
    const before = structuredClone(save);
    expect(validSave(save)).toBe(true);
    const loaded = normalizeSave(save);
    expect(loaded.worlds.aquarium.size).toBe("large");
    expect(loaded.worlds.sea.size).toBe("large");
    expect(loaded.worlds.aquarium.fish).toEqual(before.worlds.aquarium.fish);
    expect(loaded.worlds.aquarium.decor).toEqual(before.worlds.aquarium.decor);
    expect(advance(save, 1000).worlds.aquarium.size).toBe("large");
    expect(breed(loaded, 1000000, () => 0).worlds.aquarium.fish).toHaveLength(
      100,
    );
    expect(save).toEqual(before);
  });
  it.each(["creative", "progression"] as const)(
    "counts helpers toward the %s birth cap independently per habitat",
    (mode) => {
      const save = createSave(0, "Full house", mode, 1000);
      save.worlds.aquarium.fish = [
        makeFish("guppy", true),
        makeFish("guppy", true),
        ...Array.from({ length: 22 }, () => makeFish("snail")),
      ];
      save.worlds.sea.fish = [
        makeFish("clownfish", true),
        makeFish("clownfish", true),
        ...Array.from({ length: 21 }, () => makeFish("crab")),
      ];
      for (const world of Object.values(save.worlds))
        for (const fish of world.fish) fish.lastFedAt = 1000;
      save.breedAt = { aquariumguppy: 1000, seaclownfish: 1000 };
      expect(capacity(save)).toBe(24);
      const next = breed(save, 301001, () => 0);
      expect(next.worlds.aquarium.fish).toHaveLength(24);
      expect(next.worlds.sea.fish).toHaveLength(24);
      expect(breed(next, 701001, () => 0).worlds.sea.fish).toHaveLength(24);
    },
  );
});

describe("persistent shaping data", () => {
  it("round trips rotation and sand while accepting old saves without either", () => {
    const save = createSave(0, "Sculptor", "creative");
    expect(validSave(save)).toBe(true);
    save.worlds.aquarium.decor[0].rotation = -30;
    save.worlds.aquarium.sand = Array.from({ length: SAND_BINS }, (_, i) =>
      i % 2 ? 0.22 : 0,
    );
    const copy = JSON.parse(JSON.stringify(save));
    expect(validSave(copy)).toBe(true);
    expect(normalizeSave(copy).worlds.aquarium).toEqual(save.worlds.aquarium);
  });
  it("rejects malformed, sparse, excessive or nonfinite sand and rotation", () => {
    const save = createSave(0, "Sculptor", "creative");
    for (const sand of [
      null,
      [],
      Array(48),
      Array(47).fill(0),
      Array(49).fill(0),
      Array(48).fill(-0.01),
      Array(48).fill(0.221),
      Array(48).fill(Infinity),
      Array(48).fill("0"),
    ]) {
      save.worlds.aquarium.sand = sand as any;
      expect(validSave(save)).toBe(false);
    }
    delete save.worlds.aquarium.sand;
    for (const rotation of [null, "30", NaN, Infinity, -361, 361]) {
      save.worlds.aquarium.decor[0].rotation = rotation as any;
      expect(validSave(save)).toBe(false);
    }
  });
});
