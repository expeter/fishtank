import { describe, expect, it } from "vitest";
import {
  brushTerrain,
  createTerrain,
  DEFAULT_SAND_HEIGHT,
  MAX_SAND_HEIGHT,
  normalizeTerrain,
  sampleTerrainHeight,
  terrainSurface,
  TERRAIN_BINS,
} from "../src/terrain";

describe("paintable sand terrain", () => {
  it("uses a consistent optional default and converts thickness to canvas floor height", () => {
    const terrain = createTerrain();
    expect(terrain).toHaveLength(TERRAIN_BINS);
    expect(terrain.every((h) => h === DEFAULT_SAND_HEIGHT)).toBe(true);
    expect(sampleTerrainHeight(undefined, 0.3)).toBe(DEFAULT_SAND_HEIGHT);
    expect(terrainSurface(undefined, 0.3)).toBeCloseTo(0.86);
    expect(terrainSurface(createTerrain(0), 0.3)).toBe(1);
    expect(terrainSurface(createTerrain(0.22), 0.3)).toBeCloseTo(0.78);
  });
  it("interpolates a raised floor and bounds samples at either world edge", () => {
    expect(sampleTerrainHeight([0, 0.2], 0.25)).toBeCloseTo(0.05);
    expect(sampleTerrainHeight([0, 0.2], 0.75)).toBeCloseTo(0.15);
    expect(sampleTerrainHeight([0, 0.2], -4)).toBe(0);
    expect(sampleTerrainHeight([0, 0.2], 4)).toBe(0.2);
    expect(sampleTerrainHeight([0.12], 0.5)).toBe(0.12);
  });
  it("adds a soft local pile without mutating the saved profile or distant sand", () => {
    const before = createTerrain(0.1),
      after = brushTerrain(before, 0.5, 0.015, 0.1);
    expect(before.every((h) => h === 0.1)).toBe(true);
    expect(after[0]).toBe(0.1);
    expect(after[47]).toBe(0.1);
    expect(after[23]).toBeGreaterThan(after[21]);
    expect(after[23]).toBeCloseTo(after[24], 6);
    expect(after[23]).toBeLessThanOrEqual(0.115);
    for (let i = 0; i < 48; i++)
      if (Math.abs(i / 47 - 0.5) >= 0.1) expect(after[i]).toBe(0.1);
  });
  it("removes only part of a pile, then clamps repeated digging and adding", () => {
    const pile = brushTerrain(createTerrain(), 0.5, 0.02);
    const dug = brushTerrain(pile, 0.5, -0.01);
    expect(dug[23]).toBeLessThan(pile[23]);
    expect(dug[23]).toBeGreaterThan(DEFAULT_SAND_HEIGHT);
    let low = createTerrain(0.01),
      high = createTerrain(0.21);
    for (let n = 0; n < 50; n++) {
      low = brushTerrain(low, 0.5, -0.03);
      high = brushTerrain(high, 0.5, 0.03);
    }
    expect(low[23]).toBe(0);
    expect(high[23]).toBe(MAX_SAND_HEIGHT);
    expect(low[0]).toBe(0.01);
    expect(high[0]).toBe(0.21);
    expect([...low, ...high].every((h) => h >= 0 && h <= MAX_SAND_HEIGHT)).toBe(
      true,
    );
  });
  it("handles edge strokes, tiny brushes, invalid inputs and older shorter profiles", () => {
    expect(brushTerrain(undefined, 0, 0.015)[0]).toBeGreaterThan(
      DEFAULT_SAND_HEIGHT,
    );
    expect(brushTerrain(undefined, 1, -0.015)[47]).toBeLessThan(
      DEFAULT_SAND_HEIGHT,
    );
    expect(
      brushTerrain(undefined, 0.5, 0.015, 0.00001).some(
        (h) => h > DEFAULT_SAND_HEIGHT,
      ),
    ).toBe(true);
    expect(brushTerrain(undefined, NaN, 1)).toEqual(createTerrain());
    expect(brushTerrain(undefined, 0.5, Infinity)).toEqual(createTerrain());
    const normalized = normalizeTerrain([-0.2, NaN, 2]);
    expect(normalized).toHaveLength(48);
    expect(
      normalized.every((h) => Number.isFinite(h) && h >= 0 && h <= 0.22),
    ).toBe(true);
    expect(
      Math.max(...brushTerrain(createTerrain(0), 0.5, 100, 0.2)),
    ).toBeLessThanOrEqual(0.04);
  });
});
