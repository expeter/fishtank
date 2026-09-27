import { describe, expect, it } from "vitest";
import { makeFish } from "../src/game";
import { ecologyEvent } from "../src/ecology";
const predator = { ...makeFish("angelfish", true, 0), seed: 7 };
function residents(now: number) {
  return [
    predator,
    {
      ...makeFish("guppy", false, now - 60000),
      parents: ["a", "b"] as [string, string],
    },
    makeFish("snail"),
  ];
}
describe("optional gentle food-chain mode", () => {
  it("never removes animals by default, offline, too frequently, or after an offline gap", () => {
    for (let now = 120000; now < 12000000; now += 60000) {
      const fish = residents(now);
      expect(ecologyEvent(fish, false, true, now, now - 60000)).toBeNull();
      expect(ecologyEvent(fish, true, false, now, now - 60000)).toBeNull();
      expect(ecologyEvent(fish, true, true, now, now - 1000)).toBeNull();
      expect(ecologyEvent(fish, true, true, now, now - 3600000)).toBeNull();
    }
  });
  it("can choose only unnamed, home-born young of another species and protects a small family", () => {
    let events = 0;
    for (let now = 120000; now < 12000000; now += 60000) {
      const fish = residents(now),
        event = ecologyEvent(fish, true, true, now, now - 60000);
      if (event) {
        events++;
        expect(event).toEqual({ predatorId: predator.id, babyId: fish[1].id });
      }
      expect(
        ecologyEvent(fish.slice(0, 2), true, true, now, now - 60000),
      ).toBeNull();
      expect(
        ecologyEvent(
          fish.map((f, i) => (i === 1 ? { ...f, name: "Pip" } : f)),
          true,
          true,
          now,
          now - 60000,
        ),
      ).toBeNull();
      expect(
        ecologyEvent(
          fish.map((f, i) => (i === 1 ? { ...f, parents: undefined } : f)),
          true,
          true,
          now,
          now - 60000,
        ),
      ).toBeNull();
      expect(
        ecologyEvent(
          fish.map((f, i) => (i === 1 ? { ...f, species: "angelfish" } : f)),
          true,
          true,
          now,
          now - 60000,
        ),
      ).toBeNull();
    }
    expect(events).toBeGreaterThan(0);
    expect(events).toBeLessThan(40);
  });
});
