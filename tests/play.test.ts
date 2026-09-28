import { describe, it, expect } from "vitest";
import { makeFish } from "../src/game";
import {
  addTrailPoint,
  bubbleTarget,
  placeBubble,
  type ActivePlayCommand,
  learnableTrail,
  pointOnTrail,
  playTarget,
  trailDuration,
  willingToPlay,
  canPlaySpecies,
  invitedPlayer,
} from "../src/play";
import { animalBehavior, type BehaviorInput } from "../src/behaviors";
const points = [
  { x: 0.2, y: 0.5 },
  { x: 0.4, y: 0.5 },
  { x: 0.6, y: 0.7 },
  { x: 0.8, y: 0.5 },
];
const friend = {
  ...makeFish("guppy", true, 0),
  playful: 0.9,
  mood: 90,
  trick: { points, learnedAt: 1000, rehearsals: 1 },
};
describe("playful paths and gentle social life", () => {
  it("learns meaningful bounded paths while rejecting taps and tiny scribbles", () => {
    expect(learnableTrail(points)).toBe(true);
    expect(learnableTrail([points[0]])).toBe(false);
    expect(learnableTrail(Array(4).fill(points[0]))).toBe(false);
    expect(addTrailPoint([], { x: -2, y: 2 })).toEqual([{ x: 0.04, y: 0.84 }]);
    let trail: { x: number; y: number }[] = [];
    for (let i = 0; i < 400; i++)
      trail = addTrailPoint(trail, {
        x: (i % 20) / 20,
        y: 0.5 + Math.sin(i) * 0.15,
      });
    expect(trail.length).toBeLessThanOrEqual(96);
  });
  it("moves by distance along a path and remembers it for later explicit replay", () => {
    expect(pointOnTrail(points, 0)).toEqual(points[0]);
    expect(pointOnTrail(points, 1)).toEqual(points[3]);
    expect(
      pointOnTrail(
        [
          { x: 0, y: 0 },
          { x: 0.1, y: 0 },
          { x: 1, y: 0 },
        ],
        0.5,
      ),
    ).toEqual({ x: 0.5, y: 0 });
    expect(playTarget(friend, 2000, null)).not.toBeNull();
    expect(playTarget(friend, 182000, null)).toBeNull();
    expect(
      playTarget(friend, 200000, {
        kind: "replay",
        nonce: 1,
        startedAt: 200000,
        center: { x: 0.5, y: 0.5 },
      }),
    ).not.toBeNull();
    expect(
      playTarget({ ...friend, trick: undefined }, 200000, {
        kind: "replay",
        nonce: 1,
        startedAt: 200000,
        center: { x: 0.5, y: 0.5 },
      }),
    ).toBeNull();
  });
  it("keeps circle and gather assignments active until changed", () => {
    for (const kind of ["circle", "gather"] as const) {
      const command = {
        kind,
        nonce: 1,
        startedAt: 200000,
        center: { x: 0.5, y: 0.55 },
      };
      const target = playTarget(friend, 201000, command)!;
      expect(target.x).toBeGreaterThan(0.3);
      expect(target.x).toBeLessThan(0.7);
      expect(target.y).toBeGreaterThan(0.2);
      expect(target.y).toBeLessThan(0.85);
      expect(playTarget(friend, 212000, command)).not.toBeNull();
      expect(playTarget(friend, 3800000, command)).not.toBeNull();
      expect(
        playTarget({ ...friend, playful: 0.1 }, 201000, command),
      ).toBeNull();
    }
    expect(willingToPlay({ ...friend, species: "crab" })).toBe(false);
  });
  it("continues an explicitly selected learned path indefinitely", () => {
    for (const now of [200000, 3600000, 86400000])
      expect(playTarget(friend, now, null, true)).not.toBeNull();
    const samples = [0, 0.25, 0.5, 0.75, 1, 1.5].map(
      (phase) =>
        playTarget(
          friend,
          3600000 + phase * trailDuration(friend.trick!.points) * 1000,
          null,
          true,
        )!.x,
    );
    expect(Math.max(...samples) - Math.min(...samples)).toBeGreaterThan(0.25);
  });
  it("waits for a tapped bubble, follows it upward after arrival, and retargets the next tap", () => {
    const command: ActivePlayCommand = {
      kind: "bubbles",
      nonce: 1,
      startedAt: 1000,
      center: { x: 0.5, y: 0.5 },
    };
    expect(playTarget(friend, 2000, command, true)).toBeNull();
    const placed = placeBubble(command, { x: 0.75, y: 0.7 }, 2000, 0.25);
    expect(bubbleTarget(placed, 90000)).toEqual({ x: 0.75, y: 0.7 });
    expect(playTarget(friend, 90000, placed, true)).toEqual({
      x: 0.75,
      y: 0.7,
    });
    placed.bubble!.reachedAt = 90000;
    expect(bubbleTarget(placed, 93000)!.y).toBeCloseTo(0.646);
    expect(bubbleTarget(placed, 120000)).toBeNull();
    const moved = placeBubble(placed, { x: 0.2, y: 0.6 }, 110000, 0.25);
    expect(moved.bubble!.reachedAt).toBeUndefined();
    expect(playTarget(friend, 111000, moved, true)).toEqual({ x: 0.2, y: 0.6 });
  });
  it("always responds when a swimmer is explicitly selected, even if shy or hungry", () => {
    const shy = { ...friend, playful: 0.01, mood: 10, hunger: 100 };
    const command = {
      kind: "circle" as const,
      nonce: 1,
      startedAt: 200000,
      center: { x: 0.5, y: 0.5 },
    };
    expect(playTarget(shy, 201000, command)).toBeNull();
    const target = playTarget(shy, 201000, command, true)!;
    expect(target).not.toBeNull();
    const behavior = animalBehavior(shy, {
      width: 800,
      height: 600,
      time: 1,
      now: 201000,
      reduced: false,
      tool: "play",
      pointer: target,
      forcePlay: true,
      food: { x: 0.1, y: 0.8 },
    });
    expect(behavior.activity).toBe("following");
    expect(behavior.x).toBeGreaterThan(250);
    expect(canPlaySpecies("guppy")).toBe(true);
    expect(canPlaySpecies({ ...shy, species: "frog" })).toBe(false);
    expect(
      playTarget({ ...shy, species: "frog" }, 201000, command, true),
    ).toBeNull();
  });
  it("invites exactly one willing swimmer and rotates after giving it time to swim away", () => {
    const friends = [
      { ...friend, id: "a" },
      { ...friend, id: "b" },
      { ...friend, id: "shy", playful: 0 },
    ];
    const first = invitedPlayer(friends, 1001, 1000);
    expect(["a", "b"]).toContain(first);
    expect(invitedPlayer(friends, 9000, 1000)).toBe(first);
    expect(invitedPlayer(friends, 12000, 1000)).toBeNull();
    expect(invitedPlayer(friends, 19001, 1000)).not.toBe(first);
    expect(
      invitedPlayer([{ ...friend, species: "snail" }], 1001, 1000),
    ).toBeNull();
  });
  it("gives nearby young fish short harmless chases, with more resting as fish age", () => {
    const env: BehaviorInput = {
      width: 800,
      height: 600,
      time: 0,
      now: 1000,
      reduced: false,
      tool: "",
      pointer: null,
      food: null,
    };
    const baby = {
      ...makeFish("guppy", false, 0),
      seed: 0,
      playful: 0.9,
      mood: 90,
      x: 0.3,
      y: 0.5,
    };
    const buddy = { ...makeFish("guppy", false, 0), x: 0.4, y: 0.5 };
    expect(
      animalBehavior(baby, {
        ...env,
        neighbors: [{ fish: buddy, x: 0.4, y: 0.5 }],
      }).activity,
    ).toBe("chasing");
    expect(
      animalBehavior(
        { ...baby, grown: 10000 },
        { ...env, neighbors: [{ fish: buddy, x: 0.4, y: 0.5 }] },
      ).activity,
    ).not.toBe("chasing");
    let young = 0,
      old = 0;
    for (let time = 0; time < 100; time++) {
      if (
        animalBehavior({ ...baby, careUntil: 0 }, { ...env, time, now: 60000 })
          .sleeping
      )
        young++;
      if (
        animalBehavior(
          { ...baby, careUntil: 0 },
          { ...env, time, now: 8 * 86400000 },
        ).sleeping
      )
        old++;
    }
    expect(old).toBeGreaterThan(young);
  });
});

it("slows long and large-world paths to a gentle distance-based pace", () => {
  const points = [
    { x: 0.1, y: 0.5 },
    { x: 0.9, y: 0.5 },
  ];
  expect(trailDuration(points, 600, 400)).toBe(20);
  expect(trailDuration(points, 1200, 400)).toBe(40);
});
