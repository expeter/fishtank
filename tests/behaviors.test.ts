import { describe, it, expect } from "vitest";
import { makeFish } from "../src/game";
import {
  animalBehavior,
  jumpPosition,
  frogSnack,
  waterSurface,
  type BehaviorInput,
} from "../src/behaviors";
const environment: BehaviorInput = {
  width: 800,
  height: 400,
  time: 0,
  now: 1000,
  reduced: false,
  tool: "",
  pointer: null,
  food: null,
};
describe("autonomous aquarium behavior", () => {
  it("rests without care, wakes for food, and follows only when playful and content", () => {
    const f = {
      ...makeFish("guppy", true, 0),
      seed: Math.PI / 2,
      careUntil: 0,
      playful: 0.9,
      mood: 80,
    };
    expect(animalBehavior(f, environment).activity).toBe("resting");
    const play = { ...environment, tool: "play", pointer: { x: 0.8, y: 0.55 } };
    expect(animalBehavior(f, play)).toMatchObject({
      activity: "following",
      sleeping: false,
    });
    expect(animalBehavior({ ...f, playful: 0.1 }, play).activity).toBe(
      "resting",
    );
    expect(animalBehavior({ ...f, mood: 45 }, play).activity).toBe("resting");
    expect(
      animalBehavior(f, { ...environment, food: { x: 0.25, y: 0.5 } }),
    ).toMatchObject({ activity: "eating", sleeping: false, x: 200, y: 200 });
    expect(
      animalBehavior({ ...f, careUntil: 10000 }, environment).sleeping,
    ).toBe(false);
  });
  it("keeps frogs at the surface, crawlers at the bottom and snails on the glass", () => {
    const active = {
      ...environment,
      time: 58.2,
      tool: "play",
      pointer: { x: 0.7, y: 0.4 },
      food: { x: 0.3, y: 0.85 },
    };
    const frog = animalBehavior(
      { ...makeFish("frog"), seed: 0, playful: 1 },
      active,
    );
    expect(frog).toMatchObject({
      activity: "surface",
      y: waterSurface(400) - 7,
      jumpPhase: null,
    });
    for (const species of ["crab", "shrimp"]) {
      expect(animalBehavior(makeFish(species), active)).toMatchObject({
        activity: "eating",
        y: 340,
        jumpPhase: null,
      });
    }
    const snail = { ...makeFish("snail"), seed: 1 };
    const early = animalBehavior(snail, environment),
      later = animalBehavior(snail, { ...environment, time: 20 });
    expect(early.activity).toBe("crawling");
    expect(later.x).not.toBe(early.x);
    expect(later.y).toBe(early.y);
    expect(later.y).toBe(340);
    expect(later.y).toBeGreaterThan(waterSurface(400));
  });
  it("keeps snails on the ground or a real side pane, never floating through open water", () => {
    const snail = { ...makeFish("snail"), seed: 1 };
    let bottom = 0,
      glass = 0;
    for (let time = 0; time < 300; time++) {
      const behavior = animalBehavior(snail, {
        ...environment,
        time,
        habitat: "aquarium",
      });
      if (behavior.y === 340) bottom++;
      else {
        glass++;
        expect(behavior.x).toBeGreaterThan(720);
        expect(behavior.activity).toBe("sliding");
      }
      expect(
        animalBehavior(snail, { ...environment, time, habitat: "sea" }).y,
      ).toBe(340);
    }
    expect(bottom).toBeGreaterThan(glass);
    expect(glass).toBeGreaterThan(0);
    const climbing = animalBehavior(snail, {
      ...environment,
      time: 122,
      habitat: "aquarium",
      food: { x: 0.5, y: 0.85 },
    });
    expect(climbing.activity).toBe("sliding");
    expect(climbing.x).toBeGreaterThan(720);
  });
  it("jumps through a continuous arc and returns safely to the starting point", () => {
    const f = {
      ...makeFish("guppy", true, 0),
      seed: 0,
      playful: 0.8,
      careUntil: 10000,
    };
    const b = animalBehavior(f, { ...environment, time: 58.2 });
    expect(b.activity).toBe("jumping");
    expect(b.jumpPhase).toBeCloseTo(0.5);
    const start = { x: 300, y: 240 };
    expect(jumpPosition(start, 0, 800, 400, 1)).toMatchObject(start);
    expect(jumpPosition(start, 1, 800, 400, 1).y).toBe(240);
    expect(jumpPosition(start, 0.5, 800, 400, 1).y).toBeLessThan(
      waterSurface(400) - 20,
    );
    for (const boundary of [0.25, 0.75])
      expect(
        jumpPosition(start, boundary - 0.000001, 800, 400, 1).y,
      ).toBeCloseTo(jumpPosition(start, boundary + 0.000001, 800, 400, 1).y, 2);
    expect(
      animalBehavior(f, { ...environment, time: 58.2, reduced: true })
        .jumpPhase,
    ).toBeNull();
    for (const species of ["frog", "snail", "crab", "shrimp", "seahorse"])
      expect(
        animalBehavior(
          { ...makeFish(species), seed: 0, playful: 1 },
          { ...environment, time: 58.2 },
        ).jumpPhase,
      ).toBeNull();
  });
  it("keeps pointer targets bounded and reduced-motion care interactions functional", () => {
    const f = { ...makeFish("goldfish"), playful: 1, mood: 80 };
    for (const pointer of [
      { x: -2, y: -2 },
      { x: 3, y: 3 },
    ]) {
      const b = animalBehavior(f, {
        ...environment,
        tool: "play",
        pointer,
        reduced: true,
      });
      expect(b.activity).toBe("following");
      expect(b.x).toBeGreaterThanOrEqual(35);
      expect(b.x).toBeLessThanOrEqual(765);
      expect(b.y).toBeGreaterThan(waterSurface(400));
      expect(b.y).toBeLessThan(400);
    }
  });
  it("removes a caught mosquito and waits before another arrives", () => {
    const pos = { x: 300, y: 65 };
    expect(frogSnack(0, 9.1, pos, 400).visible).toBe(true);
    expect(frogSnack(0, 9.25, pos, 400)).toMatchObject({
      visible: false,
      tongue: 1,
    });
    expect(frogSnack(0, 10, pos, 400)).toMatchObject({
      visible: false,
      tongue: 0,
    });
    expect(frogSnack(0, 12, pos, 400).visible).toBe(true);
    expect(frogSnack(0, 9.25, pos, 400, true).tongue).toBe(0);
    expect(frogSnack(0, 9.1, pos, 400).y).toBeLessThan(waterSurface(400));
  });
});
