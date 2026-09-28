import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
class FakeContext {
  static instances: FakeContext[] = [];
  static deferred = false;
  state = "suspended";
  currentTime = 0;
  destination = {};
  completeResume?: () => void;
  oscillators: any[] = [];
  gains: any[] = [];
  filters: any[] = [];
  buffers: any[] = [];
  sampleRate = 8000;
  createBiquadFilter() {
    const node = {
      type: "",
      frequency: { value: 0 },
      Q: { value: 0 },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
    this.filters.push(node);
    return node;
  }
  createBuffer(_channels: number, length: number) {
    return { getChannelData: () => new Float32Array(length) };
  }
  createBufferSource() {
    const node = {
      buffer: undefined,
      connect: vi.fn(),
      disconnect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      onended: null,
    };
    this.buffers.push(node);
    return node;
  }
  constructor() {
    FakeContext.instances.push(this);
  }
  resume() {
    if (FakeContext.deferred)
      return new Promise<void>((resolve) => {
        this.completeResume = () => {
          this.state = "running";
          resolve();
        };
      });
    this.state = "running";
    return Promise.resolve();
  }
  suspend = vi.fn(() => {
    this.state = "suspended";
    return Promise.resolve();
  });
  createOscillator() {
    const node = {
      type: "",
      frequency: { value: 0 },
      connect: vi.fn(),
      disconnect: vi.fn(),
      startedAt: 0,
      start: vi.fn(() => {
        node.startedAt = Date.now();
      }),
      stop: vi.fn(),
      onended: null as null | (() => void),
    };
    this.oscillators.push(node);
    return node;
  }
  createGain() {
    const node = {
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
    this.gains.push(node);
    return node;
  }
}
beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  FakeContext.instances = [];
  FakeContext.deferred = false;
  vi.stubGlobal("AudioContext", FakeContext);
  vi.stubGlobal("window", { setInterval: globalThis.setInterval });
});
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
describe("optional audio playback", () => {
  it("starts music once, stops its schedule, and keeps effects separate", async () => {
    const { sound, tone } = await import("../src/audio");
    sound(true, true);
    sound(true, true);
    await vi.advanceTimersByTimeAsync(2200);
    const ctx = FakeContext.instances[0];
    expect(FakeContext.instances).toHaveLength(1);
    const musicVoices = ctx.oscillators.length;
    expect(musicVoices).toBeGreaterThan(0);
    expect(vi.getTimerCount()).toBe(1);
    sound(true, false);
    expect(vi.getTimerCount()).toBe(0);
    expect(
      ctx.oscillators.every((o) => o.disconnect.mock.calls.length === 1),
    ).toBe(true);
    await vi.advanceTimersByTimeAsync(2200);
    expect(ctx.oscillators).toHaveLength(musicVoices);
    tone();
    expect(ctx.oscillators).toHaveLength(musicVoices + 1);
    ctx.oscillators[musicVoices].onended();
    expect(ctx.oscillators[musicVoices].disconnect).toHaveBeenCalledOnce();
    expect(ctx.gains[musicVoices].disconnect).toHaveBeenCalledOnce();
    sound(false, false);
    tone();
    expect(ctx.oscillators).toHaveLength(musicVoices + 1);
    expect(ctx.state).toBe("suspended");
  });
  it("a delayed audio unlock cannot override muting or emit effects", async () => {
    FakeContext.deferred = true;
    const { sound, tone } = await import("../src/audio");
    sound(true, true);
    const ctx = FakeContext.instances[0];
    sound(false, true);
    ctx.completeResume!();
    await Promise.resolve();
    await Promise.resolve();
    expect(ctx.state).toBe("suspended");
    ctx.state = "running";
    tone();
    expect(ctx.oscillators).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(2200);
    expect(ctx.oscillators).toHaveLength(0);
  });
  it("keeps the game usable without an available audio output", async () => {
    vi.stubGlobal("AudioContext", undefined);
    const { sound, tone } = await import("../src/audio");
    expect(() => sound(true, true)).not.toThrow();
    expect(() => tone()).not.toThrow();
    vi.stubGlobal(
      "AudioContext",
      class {
        constructor() {
          throw new Error("No output");
        }
      },
    );
    expect(() => sound(true, true)).not.toThrow();
    expect(vi.getTimerCount()).toBe(0);
  });
});

it("plays distinct short effects and discards their remaining notes when muted", async () => {
  const { sound, effect } = await import("../src/audio");
  sound(true, false);
  const ctx = FakeContext.instances[0];
  effect("learn");
  await vi.advanceTimersByTimeAsync(250);
  expect(ctx.oscillators).toHaveLength(4);
  expect(ctx.oscillators[3].frequency.value).toBeGreaterThan(
    ctx.oscillators[0].frequency.value,
  );
  effect("hello");
  const beforeMute = ctx.oscillators.length;
  sound(false, false);
  expect(ctx.oscillators.every((o) => o.stop.mock.calls.length >= 2)).toBe(
    true,
  );
  sound(true, false);
  await vi.advanceTimersByTimeAsync(300);
  expect(ctx.oscillators).toHaveLength(beforeMute);
  effect("bubble");
  await vi.advanceTimersByTimeAsync(100);
  expect(ctx.oscillators).toHaveLength(beforeMute + 2);
  expect(ctx.oscillators.at(-1).frequency.value).toBeLessThan(500);
});

it("rotates contrasting melodies, harmony, instruments and pace without duplicate schedules", async () => {
  const { sound } = await import("../src/audio");
  sound(true, true);
  const ctx = FakeContext.instances[0];
  const start = Date.now();
  await vi.advanceTimersByTimeAsync(24000);
  const opening = ctx.oscillators.map((o) => o.frequency.value);
  const firstCount = ctx.oscillators.length;
  // Settings rerenders must not restart the score or add another music clock.
  for (let i = 0; i < 20; i++) sound(true, true);
  expect(vi.getTimerCount()).toBe(1);
  await vi.advanceTimersByTimeAsync(96000);
  const later = ctx.oscillators.slice(firstCount);
  expect(new Set(later.map((o) => o.frequency.value)).size).toBeGreaterThan(12);
  expect(later.some((o) => !opening.includes(o.frequency.value))).toBe(true);
  expect(new Set(ctx.oscillators.map((o) => o.type))).toEqual(
    new Set(["sine", "triangle"]),
  );
  const times = [...new Set(ctx.oscillators.map((o) => o.startedAt as number))];
  const gaps = new Set(times.slice(1).map((time, i) => time - times[i]));
  expect(gaps.size).toBeGreaterThan(4);
  // Multiple simultaneous low notes provide harmony, not merely changing a single loop.
  expect(
    ctx.oscillators.filter((o) => o.startedAt === start + 300).length,
  ).toBeGreaterThan(1);
  sound(false, false);
  expect(vi.getTimerCount()).toBe(0);
  expect(
    ctx.oscillators.every((o) => o.disconnect.mock.calls.length === 1),
  ).toBe(true);
  const stoppedAt = ctx.oscillators.length;
  await vi.advanceTimersByTimeAsync(120000);
  expect(ctx.oscillators).toHaveLength(stoppedAt);
});

it("switches off music immediately while allowing an effect phrase to finish", async () => {
  const { sound, effect } = await import("../src/audio");
  sound(true, true);
  await vi.advanceTimersByTimeAsync(350);
  const ctx = FakeContext.instances[0];
  const music = [...ctx.oscillators];
  effect("learn");
  const effectVoice = ctx.oscillators.at(-1);
  sound(true, false);
  expect(music.every((o) => o.disconnect.mock.calls.length === 1)).toBe(true);
  expect(effectVoice.disconnect).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(250);
  expect(ctx.oscillators).toHaveLength(music.length + 4);
  sound(false, false);
  expect(vi.getTimerCount()).toBe(0);
});

it("keeps ambience independent, sparse and quiet, and replaces habitat sounds without overlapping schedules", async () => {
  const { sound, effect } = await import("../src/audio");
  sound(true, false, true, "aquarium");
  const ctx = FakeContext.instances[0];
  for (let i = 0; i < 20; i++) sound(true, false, true, "aquarium");
  expect(vi.getTimerCount()).toBe(1);
  await vi.advanceTimersByTimeAsync(1800);
  expect(ctx.buffers).toHaveLength(1);
  expect(ctx.oscillators).toHaveLength(0);
  expect(ctx.filters[0].frequency.value).toBe(600);
  await vi.advanceTimersByTimeAsync(10000);
  expect(ctx.buffers).toHaveLength(1);
  sound(true, false, true, "sea");
  expect(ctx.buffers[0].disconnect).toHaveBeenCalledOnce();
  await vi.advanceTimersByTimeAsync(1800);
  expect(ctx.buffers).toHaveLength(2);
  expect(ctx.filters.at(-1).frequency.value).toBe(420);
  sound(true, false, false, "sea");
  expect(vi.getTimerCount()).toBe(0);
  expect(ctx.buffers[1].disconnect).toHaveBeenCalledOnce();
  effect("feed");
  expect(ctx.oscillators).toHaveLength(1);
  sound(false, true, true, "sea");
  await vi.advanceTimersByTimeAsync(60000);
  expect(ctx.buffers).toHaveLength(2);
  expect(vi.getTimerCount()).toBe(0);
});

it("bounds all musical and effect voices to a mellow filtered register", async () => {
  const { sound, effect, tone } = await import("../src/audio");
  sound(true, true);
  await vi.advanceTimersByTimeAsync(150000);
  for (const name of [
    "feed",
    "play",
    "learn",
    "bubble",
    "buy",
    "place",
    "hello",
  ] as const)
    effect(name);
  tone(4000, 0.2, 1);
  await vi.advanceTimersByTimeAsync(300);
  const ctx = FakeContext.instances[0];
  expect(
    ctx.oscillators.every(
      (o) => o.frequency.value >= 65 && o.frequency.value <= 520,
    ),
  ).toBe(true);
  expect(
    ctx.filters.every((f) => f.type === "lowpass" && f.frequency.value <= 700),
  ).toBe(true);
  expect(
    ctx.gains.every((g) =>
      g.gain.exponentialRampToValueAtTime.mock.calls.every(
        ([value]: number[]) => value <= 0.018,
      ),
    ),
  ).toBe(true);
  sound(false, false);
});
