import { describe, it, expect } from "vitest";
import {
  motionBlend,
  pickDecoration,
  fitDecoration,
} from "../src/sceneGeometry";
import type { Decoration } from "../src/game";
describe("responsive habitat interactions", () => {
  it("moves the same distance at 30, 60, and 120 Hz", () => {
    const run = (fps: number) => {
      let x = 0;
      for (let i = 0; i < fps; i++)
        x += (100 - x) * motionBlend(0.013, 1000 / fps);
      return x;
    };
    expect(run(30)).toBeCloseTo(run(60), 8);
    expect(run(120)).toBeCloseTo(run(60), 8);
    expect(motionBlend(0.013, 0)).toBe(0);
    expect(motionBlend(0.013, 10000)).toBe(motionBlend(0.013, 100));
  });
  it("picks the front decoration even after layer order changes", () => {
    const back: Decoration = {
      id: "back",
      kind: "d0",
      x: 0.5,
      y: 0.8,
      scale: 1,
      flip: false,
      layer: 5,
    };
    const front = { ...back, id: "front", layer: 10 };
    expect(pickDecoration([front, back], 0.5, 0.7, 390, 400)?.id).toBe("front");
    expect(
      pickDecoration([{ ...front, layer: 0 }, back], 0.5, 0.7, 390, 400)?.id,
    ).toBe("back");
  });
  it("keeps a consistent touch target in CSS pixels at phone and desktop sizes", () => {
    const d: Decoration = {
      id: "plant",
      kind: "d0",
      x: 0.5,
      y: 0.8,
      scale: 1,
      flip: false,
      layer: 0,
    };
    for (const width of [390, 1160]) {
      expect(
        pickDecoration([d], 0.5 + 50 / width, 0.8 - 80 / 400, width, 400)?.id,
      ).toBe("plant");
      expect(
        pickDecoration([d], 0.5 + 80 / width, 0.8, width, 400),
      ).toBeUndefined();
    }
  });
});

it("hits the rotated shape instead of its former upright position", () => {
  const d: Decoration = {
    id: "turned",
    kind: "d0",
    x: 0.5,
    y: 0.5,
    scale: 2,
    flip: true,
    rotation: 90,
    layer: 1,
  };
  expect(pickDecoration([d], 0.5 + 180 / 500, 0.5, 500, 500)?.id).toBe(
    "turned",
  );
  expect(pickDecoration([d], 0.5, 0.5 - 180 / 500, 500, 500)).toBeUndefined();
});

it("keeps a tall flipped-over toy reachable inside the current viewport", () => {
  const d: Decoration = {
    id: "turned",
    kind: "d0",
    x: 0.5,
    y: 0.9,
    scale: 3,
    flip: false,
    rotation: 180,
    layer: 0,
  };
  const fitted = fitDecoration(d, 390, 740);
  expect(fitted.y).toBeLessThan(d.y);
  expect(fitted.y * 740 + 115 * 3).toBeLessThanOrEqual(732);
});

it("fits an edited decoration within a vertically scrolled viewport", () => {
  const d: Decoration = {
    id: "plant",
    kind: "d0",
    x: 0.5,
    y: 0.9,
    scale: 1,
    flip: false,
    layer: 0,
  };
  const result = fitDecoration(d, 393, 775, 0, 393, 200, 317);
  expect(result.y * 775 + 10).toBeLessThanOrEqual(509.001);
  expect(result.y * 775 - 115).toBeGreaterThanOrEqual(208);
  expect(
    pickDecoration(
      [{ ...d, ...result }],
      result.x,
      result.y - 40 / 775,
      393,
      775,
    )?.id,
  ).toBe("plant");
});

it("bounds swimming speed regardless of target distance or frame rate", async () => {
  const { swimStep } = await import("../src/sceneGeometry");
  for (const fps of [30, 60, 120]) {
    let p = { x: 0, y: 0 };
    for (let i = 0; i < fps; i++)
      p = swimStep(p, { x: 4000, y: 3000 }, 1000 / fps, 30);
    expect(Math.hypot(p.x, p.y)).toBeCloseTo(30, 6);
  }
  expect(swimStep({ x: 2, y: 2 }, { x: 2, y: 2 }, 16, 30)).toEqual({
    x: 2,
    y: 2,
  });
});
