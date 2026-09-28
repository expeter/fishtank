import { describe, expect, it } from "vitest";
import {
  bubbleField,
  worldEnvironment,
  DAY_CYCLE_MS,
  celestialPosition,
  clockAngles,
} from "../src/environment";

describe("living woodland environment", () => {
  it("starts sunny and has a full persistent storybook day", () => {
    const born = 1720000000000;
    expect(worldEnvironment(born, born)).toMatchObject({
      hour: 9,
      weather: "clear",
      daylight: 1,
    });
    expect(worldEnvironment(born, born + DAY_CYCLE_MS / 2).daylight).toBe(0);
    expect(worldEnvironment(born, born + DAY_CYCLE_MS).hour).toBe(9);
    expect(worldEnvironment(born, born + 745123)).toEqual(
      worldEnvironment(born, born + 745123),
    );
    expect(worldEnvironment(born, born - 1).hour).toBe(9);
  });
  it("cycles through clear, cloudy and gentle rain with smooth boundaries", () => {
    const born = 1720000000000;
    const weather = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const e = worldEnvironment(born, born + i * 150000 + 20000);
      weather.add(e.weather);
      expect(e.rain).toBeGreaterThanOrEqual(0);
      expect(e.rain).toBeLessThanOrEqual(1);
      expect(worldEnvironment(born, born + i * 150000).rain).toBe(0);
    }
    expect([...weather].sort()).toEqual(["clear", "cloudy", "rain"]);
  });
  it("bubbles stay underwater with individually varied positions and sizes", () => {
    for (const seconds of [0, 1, 15, 100, 1000]) {
      const bubbles = bubbleField(390, 680, 100, seconds, 2381);
      expect(bubbles.length).toBeGreaterThan(5);
      for (const b of bubbles) {
        expect(b.x).toBeGreaterThanOrEqual(0);
        expect(b.x).toBeLessThan(390);
        expect(b.y).toBeGreaterThan(100);
        expect(b.y).toBeLessThanOrEqual(680);
        expect(b.radius).toBeGreaterThan(1);
        expect(b.alpha).toBeGreaterThanOrEqual(0);
      }
      expect(new Set(bubbles.map((b) => b.radius)).size).toBe(bubbles.length);
    }
  });
  it("new bubble lifecycles use new origins, not looping fixed columns", () => {
    const start = bubbleField(390, 680, 100, 0, 2381);
    expect(bubbleField(390, 680, 100, 0, 2381)).toEqual(start);
    expect(bubbleField(390, 680, 100, 60, 2381)).not.toEqual(start);
    expect(bubbleField(390, 680, 100, 0, 2382)).not.toEqual(start);
  });
});

it("moves sun and moon through corresponding arcs and synchronizes clock hands", () => {
  expect(DAY_CYCLE_MS).toBe(360000);
  expect(celestialPosition(6)).toMatchObject({ sun: true, x: 0.08 });
  expect(celestialPosition(12).y).toBeCloseTo(0.15);
  expect(celestialPosition(17).x).toBeGreaterThan(celestialPosition(9).x);
  expect(celestialPosition(0)).toEqual(celestialPosition(24));
  expect(celestialPosition(0)).toMatchObject({ sun: false });
  expect(clockAngles(9).minute).toBeCloseTo(-Math.PI / 2);
  expect(clockAngles(9.5).minute).toBeCloseTo(Math.PI / 2);
  expect(clockAngles(9.5).hour).toBeGreaterThan(clockAngles(9).hour);
});
