import { describe, it, expect } from "vitest";
import { createSave, uid, validSave } from "../src/game";
import { captureLayout, restoreLayout } from "../src/decorating";
describe("decoration history ownership", () => {
  it("undoes purchases into inventory without refunding coins", () => {
    const s = createSave(0, "Test", "progression"),
      before = captureLayout(s);
    const paid = structuredClone(s);
    paid.coins -= 15;
    paid.worlds.aquarium.decor.push({
      id: uid(),
      kind: "d0",
      x: 0.5,
      y: 0.8,
      scale: 1,
      flip: false,
      layer: 10,
    });
    const undone = restoreLayout(paid, before);
    expect(undone.coins).toBe(85);
    expect(undone.worlds.aquarium.decor).toEqual(s.worlds.aquarium.decor);
    expect(undone.inventory.filter((id) => id === "d0")).toHaveLength(2);
    expect(validSave(undone)).toBe(true);
  });
  it("restores a put-away item without duplicating owned copies", () => {
    const s = createSave(0, "Test", "progression"),
      before = captureLayout(s),
      removed = structuredClone(s);
    const d = removed.worlds.aquarium.decor.shift()!;
    removed.inventory.push(d.kind);
    const restored = restoreLayout(removed, before);
    expect(restored.worlds.aquarium.decor).toEqual(s.worlds.aquarium.decor);
    expect([...restored.inventory].sort()).toEqual([...s.inventory].sort());
  });
  it("restores transforms and scenery while preserving animals and earnings", () => {
    const s = createSave(0, "Test", "progression"),
      before = captureLayout(s),
      changed = structuredClone(s);
    changed.worlds.aquarium.decor[0].scale = 2;
    changed.worlds.aquarium.decor[0].flip = true;
    changed.worlds.aquarium.background = 2;
    changed.worlds.aquarium.ground = 1;
    changed.coins = 500;
    changed.earned = 400;
    changed.worlds.aquarium.fish[0].name = "Sunny";
    const result = restoreLayout(changed, before);
    expect(result.worlds.aquarium.decor).toEqual(s.worlds.aquarium.decor);
    expect(result.worlds.aquarium.background).toBe(0);
    expect(result.worlds.aquarium.ground).toBe(0);
    expect(result.coins).toBe(500);
    expect(result.earned).toBe(400);
    expect(result.worlds.aquarium.fish[0].name).toBe("Sunny");
    changed.habitat = "sea";
    expect(restoreLayout(changed, before)).toBe(changed);
  });
});

it("undo restores sand and rotation without rolling back fish or coins", () => {
  const s = createSave(0, "Sand", "creative");
  s.worlds.aquarium.sand = Array(48).fill(0.14);
  const snapshot = captureLayout(s);
  const changed = structuredClone(s);
  changed.worlds.aquarium.sand![12] = 0.2;
  changed.worlds.aquarium.decor[0].rotation = 90;
  changed.coins = 77;
  const restored = restoreLayout(changed, snapshot);
  expect(restored.worlds.aquarium.sand).toEqual(snapshot.sand);
  expect(restored.worlds.aquarium.decor[0].rotation).toBeUndefined();
  expect(restored.coins).toBe(77);
});
