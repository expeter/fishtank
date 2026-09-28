import { expect, it } from "vitest";
import { animals, createSave, validSave, makeFish } from "../src/game";
it("keeps old worlds valid and persists each supported size with the expanded catalog", () => {
  const save = createSave(0, "Explorer", "creative");
  expect(validSave(save)).toBe(true);
  expect(animals).toHaveLength(33);
  expect(new Set(animals.map((a) => a.id)).size).toBe(animals.length);
  for (const habitat of ["aquarium", "sea"] as const) {
    save.worlds[habitat].fish = animals
      .filter((a) => a.habitat === habitat)
      .map((a) => makeFish(a.id));
    expect(save.worlds[habitat].fish).toHaveLength(habitat === "aquarium" ? 18 : 15);
    for (const size of ["small", "medium", "large"] as const) {
      save.worlds[habitat].size = size;
      expect(validSave(JSON.parse(JSON.stringify(save)))).toBe(true);
    }
  }
  (save.worlds.sea as any).size = "huge";
  expect(validSave(save)).toBe(false);
});
