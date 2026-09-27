import { expect, it } from "vitest";
import {
  advance,
  breed,
  buyFood,
  createSave,
  FOOD_PRICES,
  makeFish,
  validSave,
} from "../src/game";

it("charges once per drop, refuses unaffordable food and keeps creative food free", () => {
  const s = createSave(0, "Food", "progression", 0);
  s.coins = 1;
  expect(FOOD_PRICES).toEqual({
    flakes: 1,
    pellets: 1,
    algae: 1,
    worms: 2,
    insects: 2,
  });
  expect(buyFood(s, "worms")).toBe(s);
  const paid = buyFood(s, "flakes");
  expect(paid.coins).toBe(0);
  expect(paid.earned).toBe(s.earned);
  expect(paid.worlds).toEqual(s.worlds);
  expect(s.coins).toBe(1);
  expect(buyFood(paid, "flakes")).toBe(paid);
  const free = createSave(0, "Free", "creative");
  free.coins = 0;
  expect(buyFood(free, "insects").coins).toBe(0);
});
it("pays exactly five per active minute across reloads, never sales credit or offline time", () => {
  let s = createSave(0, "Pocket money", "progression", 0);
  s = advance(s, 59500);
  expect(s.coins).toBe(100);
  expect(s.allowanceSeconds).toBe(59.5);
  s = advance(JSON.parse(JSON.stringify(s)), 60500);
  expect(s.coins).toBe(105);
  expect(s.allowanceSeconds).toBe(0.5);
  expect(s.earned).toBe(0);
  s = advance(s, 3600500, true);
  expect(s.coins).toBe(105);
  expect(s.allowanceSeconds).toBe(0.5);
  s = advance(s, 3660000);
  expect(s.coins).toBe(110);
  expect(s.allowanceSeconds).toBe(0);
  expect(advance(s, 0).coins).toBe(110);
  expect(advance(createSave(0, "Free", "creative", 0), 600000).coins).toBe(100);
});
it("requires two recently fed, not-too-hungry adults for a baby", () => {
  const s = createSave(0, "Parents", "progression", 0);
  s.worlds.aquarium.fish = [
    makeFish("guppy", true, 0),
    makeFish("guppy", true, 0),
  ];
  s.breedAt.aquariumguppy = 0;
  const now = 2000000;
  expect(breed(s, now, () => 0).worlds.aquarium.fish).toHaveLength(2);
  const [a, b] = s.worlds.aquarium.fish;
  a.lastFedAt = now;
  expect(breed(s, now, () => 0).worlds.aquarium.fish).toHaveLength(2);
  for (const timestamp of [0, now - 1800001, now + 1]) {
    b.lastFedAt = timestamp;
    expect(breed(s, now, () => 0).worlds.aquarium.fish).toHaveLength(2);
  }
  b.lastFedAt = now;
  b.hunger = 61;
  expect(breed(s, now, () => 0).worlds.aquarium.fish).toHaveLength(2);
  b.hunger = 60;
  expect(breed(s, now, () => 0).worlds.aquarium.fish).toHaveLength(3);
});
it("accepts old saves and validates allowance, meal times and both bounded cleanup arrays", () => {
  const s = createSave(0, "Old", "progression", 0);
  expect(validSave(s)).toBe(true);
  s.allowanceSeconds = 59.9;
  s.worlds.aquarium.fish[0].lastFedAt = 123;
  s.worlds.aquarium.cleanup = {
    glass: Array(16).fill(0),
    litter: Array(16).fill(123),
  };
  expect(validSave(JSON.parse(JSON.stringify(s)))).toBe(true);
  for (const bad of [-1, 60, Infinity, NaN, null, "1"]) {
    expect(validSave({ ...s, allowanceSeconds: bad })).toBe(false);
  }
  for (const bad of [-1, Infinity, NaN, null, "1"]) {
    s.worlds.aquarium.fish[0].lastFedAt = bad as any;
    expect(validSave(s)).toBe(false);
  }
  delete s.worlds.aquarium.fish[0].lastFedAt;
  for (const marks of [
    Array(15).fill(0),
    Array(17).fill(0),
    Array(16),
    Array(16).fill(-1),
    Array(16).fill(Infinity),
    null,
  ]) {
    s.worlds.aquarium.cleanup = {
      glass: marks as any,
      litter: Array(16).fill(0),
    };
    expect(validSave(s)).toBe(false);
    s.worlds.aquarium.cleanup = {
      glass: Array(16).fill(0),
      litter: marks as any,
    };
    expect(validSave(s)).toBe(false);
  }
});
