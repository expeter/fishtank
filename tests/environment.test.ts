import { describe, expect, it } from "vitest";
import { bubbleField, worldEnvironment } from "../src/environment";

describe("living woodland environment", () => {
  it("starts sunny and has a full persistent storybook day", () => {
    const born = 1720000000000;
    expect(worldEnvironment(born, born)).toMatchObject({
      hour: 9,
      weather: "clear",
      daylight: 1,
    });
    expect(worldEnvironment(born, born + 12 * 60000).daylight).toBe(0);
    expect(worldEnvironment(born, born + 24 * 60000).hour).toBe(9);
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
