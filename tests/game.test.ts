import { describe, it, expect } from "vitest";
import {
  createSave,
  advance,
  breed,
  growth,
  makeFish,
  progress,
  value,
  sell,
  rescue,
  validSave,
  capacity,
} from "../src/game";
describe("gentle aquarium simulation", () => {
  it("reaches a first sale in ten minutes without care", () => {
    const s = createSave(0, "Test", "progression", 1000);
    const n = advance(s, 601000);
    expect(progress(n.worlds.aquarium.fish[0])).toBe(1);
    expect(value(n.worlds.aquarium.fish[0])).toBe(40);
    expect(s.worlds.aquarium.fish[0].grown).toBe(0);
  });
  it("care doubles growth for the boost duration only", () => {
    const s = createSave(0, "Test", "progression", 1000);
    s.worlds.aquarium.fish[0].careUntil = 121000;
    expect(advance(s, 301000).worlds.aquarium.fish[0].grown).toBe(420);
  });
  it("offline growth never penalizes mood or hunger and clamps negative time", () => {
    const s = createSave(0, "Test", "progression", 1000);
    const n = advance(s, 1e12, true);
    expect(n.worlds.aquarium.fish[0].mood).toBe(80);
    expect(n.worlds.aquarium.fish[0].hunger).toBe(20);
    expect(n.worlds.aquarium.fish.length).toBe(2);
    expect(advance(s, 0).lastAt).toBe(1000);
  });
  it("sales add earnings, keep other habitat and rescue a bankrupt empty world", () => {
    let s = createSave(0, "Test", "progression");
    s.coins = 0;
    for (const f of s.worlds.aquarium.fish) s = sell(s, f.id);
    expect(s.earned).toBe(20);
    s.coins = 0;
    expect(rescue(s).worlds.aquarium.fish).toHaveLength(1);
  });
  it("breeds only adult pairs, respects cooldown and capacity", () => {
    const s = createSave(0, "Test", "progression", 1000);
    s.worlds.aquarium.fish.forEach((f) => {
      f.grown = growth[0];
      f.lastFedAt = 1000;
    });
    const a = breed(s, 1000, () => 0);
    expect(a.worlds.aquarium.fish).toHaveLength(2);
    const b = breed(a, 301001, () => 0);
    expect(b.worlds.aquarium.fish).toHaveLength(3);
    expect(breed(b, 301002, () => 0).worlds.aquarium.fish).toHaveLength(3);
    while (b.worlds.aquarium.fish.length < 24)
      b.worlds.aquarium.fish.push(makeFish("guppy", true));
    expect(breed(b, 701001, () => 0).worlds.aquarium.fish).toHaveLength(24);
  });
  it("creative sales cannot earn progression coins", () => {
    const s = createSave(0, "Test", "creative");
    expect(capacity(s)).toBe(24);
    expect(sell(s, s.worlds.aquarium.fish[0].id).earned).toBe(0);
  });
  it("rejects corrupt or unsupported saves", () => {
    expect(validSave(null)).toBe(false);
    expect(validSave({ schema: 99 })).toBe(false);
    expect(validSave(createSave(0, "Test", "creative"))).toBe(true);
  });
});

it("preserves fixed world dimensions and rejects unsafe canvas sizes", () => {
  const save = createSave(0, "Rotation", "creative");
  expect(validSave(save)).toBe(true); // Pre-update saves remain supported.
  save.worlds.aquarium.viewSize = { width: 393, height: 775 };
  expect(validSave(save)).toBe(true);
  expect(advance(save, Date.now()).worlds.aquarium.viewSize).toEqual({
    width: 393,
    height: 775,
  });
  for (const bad of [NaN, Infinity, -1, 0, 100000]) {
    save.worlds.aquarium.viewSize.width = bad;
    expect(validSave(save)).toBe(false);
  }
});
