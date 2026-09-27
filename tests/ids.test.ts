import { afterEach, expect, it, vi } from "vitest";
import { createSave, uid, validSave } from "../src/game";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("uses native randomUUID when available", () => {
  const randomUUID = vi.fn(() => "native-id");
  vi.stubGlobal("crypto", { randomUUID });
  expect(uid()).toBe("native-id");
  expect(randomUUID).toHaveBeenCalledOnce();
});

it("creates valid worlds with unique IDs when randomUUID is unavailable", () => {
  const getRandomValues = globalThis.crypto.getRandomValues.bind(
    globalThis.crypto,
  );
  vi.stubGlobal("crypto", { getRandomValues });
  const save = createSave(0, "HTTP world", "creative");
  expect(validSave(save)).toBe(true);
  const ids = Object.values(save.worlds).flatMap((world) =>
    [...world.fish, ...world.decor].map((item) => item.id),
  );
  expect(new Set(ids).size).toBe(ids.length);
  for (const id of ids)
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
});

it("works without crypto and distinguishes IDs even with fixed time and randomness", () => {
  vi.stubGlobal("crypto", undefined);
  vi.spyOn(Date, "now").mockReturnValue(1000);
  vi.spyOn(Math, "random").mockReturnValue(0.5);
  expect(new Set(Array.from({ length: 1000 }, uid)).size).toBe(1000);
  expect(validSave(createSave(0, "Fallback world", "progression"))).toBe(true);
});
