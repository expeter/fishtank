import { describe, it, expect } from "vitest";
import {
  glassDirt,
  glassPatch,
  litterPresent,
  litterPosition,
  visitorPhase,
} from "../src/cleanup";
describe("optional persistent environmental care", () => {
  it("starts clean then grows visible bounded glass patches within one to three minutes", () => {
    for (let index = 0; index < 16; index++) {
      expect(glassDirt(index, 0, 0)).toBe(0);
      expect(glassDirt(index, 0, 60000)).toBeGreaterThan(0.2);
      expect(glassDirt(index, 0, 180000)).toBe(1);
      expect(glassDirt(index, 0, 90000000)).toBe(1);
    }
  });
  it("keeps cleaned glass clear after reload and grows back from saved cleaning time", () => {
    const state = JSON.parse(
      JSON.stringify({
        glass: Array(16).fill(180000),
        litter: Array(16).fill(0),
      }),
    );
    expect(glassDirt(3, 1000, 185000, state.glass[3])).toBe(0);
    expect(glassDirt(3, 1000, 240000, state.glass[3])).toBeGreaterThan(0);
    expect(glassDirt(3, 1000, 120000, state.glass[3])).toBe(0);
    expect(glassPatch(3, 1000)).toEqual(glassPatch(3, 1000));
  });
  it("accumulates shore litter slowly and preserves individual cleanup across reloads", () => {
    expect(litterPresent(0, 0, 59999)).toBe(false);
    expect(litterPresent(0, 0, 60000)).toBe(true);
    expect(litterPresent(1, 0, 60000)).toBe(false);
    const cleaned = JSON.parse(
      JSON.stringify({ litter: [65000, ...Array(15).fill(0)] }),
    );
    expect(litterPresent(0, 0, 100000, cleaned.litter[0])).toBe(false);
    expect(litterPresent(1, 0, 100000, cleaned.litter[1])).toBe(true);
    expect(litterPresent(0, 0, 245000, cleaned.litter[0])).toBe(true);
    expect(litterPosition(0, 123)).toEqual(litterPosition(0, 123));
    expect(litterPosition(0, 123)).not.toEqual(litterPosition(1, 123));
  });
  it("staggers visitors across minutes, never shows all species together, and returns later", () => {
    const visitors = ["fox", "bird", "beaver"] as const;
    for (let seconds = 0; seconds < 60; seconds++)
      expect(visitors.every((v) => visitorPhase(v, seconds) === null)).toBe(
        true,
      );
    for (let seconds = 0; seconds < 1200; seconds++)
      expect(
        visitors.filter((v) => visitorPhase(v, seconds) !== null).length,
      ).toBeLessThanOrEqual(1);
    expect(visitorPhase("fox", 70)).not.toBeNull();
    expect(visitorPhase("bird", 120)).not.toBeNull();
    expect(visitorPhase("beaver", 250)).not.toBeNull();
    expect(visitorPhase("fox", 430)).toBe(visitorPhase("fox", 70));
  });
});

it("shows the same dirt and waste percentages that the scene draws", async () => {
  const { cleanupPercent } = await import("../src/cleanup");
  expect(cleanupPercent("aquarium", 1000, 1000)).toBe(0);
  expect(cleanupPercent("aquarium", 1000, 200000)).toBe(100);
  expect(cleanupPercent("sea", 1000, 62000)).toBe(6);
  expect(
    cleanupPercent("aquarium", 1000, 200000, {
      glass: Array(16).fill(200000),
      litter: Array(16).fill(0),
    }),
  ).toBe(0);
});

it("schedules the bird during daylight in the faster six-minute day", async () => {
  const { worldEnvironment } = await import("../src/environment");
  expect(visitorPhase("bird", 120)).not.toBeNull();
  expect(worldEnvironment(0, 120000).daylight).toBeGreaterThan(0.3);
});
