import { expect, it } from "vitest";
import { canLiveIn, createSave, makeFish, validSave } from "../src/game";

const route = [
  { x: 0.2, y: 0.3 },
  { x: 0.7, y: 0.4 },
  { x: 0.8, y: 0.7 },
  { x: 0.3, y: 0.8 },
];

it("a learned route survives save JSON with its rehearsal history", () => {
  const save = createSave(0, "Bubbles learns a loop", "creative");
  save.worlds.aquarium.fish[0].trick = {
    points: route,
    learnedAt: 1720000000000,
    rehearsals: 3,
  };
  const restored = JSON.parse(JSON.stringify(save));
  expect(validSave(restored)).toBe(true);
  expect(restored.worlds.aquarium.fish[0].trick).toEqual(
    save.worlds.aquarium.fish[0].trick,
  );
  delete restored.worlds.aquarium.fish[0].trick;
  expect(validSave(restored)).toBe(true);
});

it("rejects corrupt, non-finite, out-of-world, and oversized learned routes", () => {
  const save = createSave(0, "Protected memory", "creative");
  const invalid = [
    null,
    { points: route.slice(0, 3), learnedAt: 1, rehearsals: 0 },
    {
      points: Array.from({ length: 97 }, () => route[0]),
      learnedAt: 1,
      rehearsals: 0,
    },
    {
      points: [...route.slice(0, 3), { x: 1.01, y: 0.5 }],
      learnedAt: 1,
      rehearsals: 0,
    },
    {
      points: [...route.slice(0, 3), { x: 0.5, y: -0.01 }],
      learnedAt: 1,
      rehearsals: 0,
    },
    {
      points: [...route.slice(0, 3), { x: NaN, y: 0.5 }],
      learnedAt: 1,
      rehearsals: 0,
    },
    { points: [...route.slice(0, 3), null], learnedAt: 1, rehearsals: 0 },
    { points: route, learnedAt: Infinity, rehearsals: 0 },
    { points: route, learnedAt: 1, rehearsals: -1 },
  ];
  for (const trick of invalid) {
    const candidate: any = structuredClone(save);
    candidate.worlds.aquarium.fish[0].trick = trick;
    expect(validSave(candidate)).toBe(false);
  }
});

it("crabs and shrimp can be saved in an aquarium without admitting unrelated sea animals", () => {
  const save = createSave(0, "Tiny neighbours", "creative");
  save.worlds.aquarium.fish.push(makeFish("crab"), makeFish("shrimp"));
  expect(canLiveIn("crab", "aquarium")).toBe(true);
  expect(validSave(JSON.parse(JSON.stringify(save)))).toBe(true);
  save.worlds.aquarium.fish.push(makeFish("clownfish"));
  expect(validSave(save)).toBe(false);
});

it("persists the first lesson gift marker and rejects malformed markers", () => {
  const save = createSave(0, "A first lesson", "creative");
  expect(validSave(save)).toBe(true);
  save.playGift = true;
  expect(validSave(JSON.parse(JSON.stringify(save)))).toBe(true);
  expect(validSave({ ...save, playGift: "already claimed" })).toBe(false);
});
