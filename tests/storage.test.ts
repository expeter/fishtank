import "fake-indexeddb/auto";
import { describe, it, expect } from "vitest";
import { createSave, makeFish } from "../src/game";
import { persist, loadSaves, deleteSave } from "../src/storage";
describe("browser save storage", () => {
  it("keeps all three slots separate, recovers a backup and deletes both copies", async () => {
    const a = createSave(0, "One", "progression"),
      b = createSave(1, "Two", "creative"),
      c = createSave(2, "Three", "progression");
    await persist(a);
    await persist(b);
    await persist(c);
    a.coins = 240;
    await persist(a);
    expect((await loadSaves()).map((s) => s?.name)).toEqual([
      "One",
      "Two",
      "Three",
    ]);
    expect((await loadSaves())[0]?.coins).toBe(240);
    await new Promise<void>((resolve, reject) => {
      const r = indexedDB.open("little-fishtank", 1);
      r.onsuccess = () => {
        const tx = r.result.transaction("saves", "readwrite");
        tx.objectStore("saves").put({ broken: true }, 0);
        tx.oncomplete = () => {
          r.result.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      };
    });
    expect((await loadSaves())[0]?.coins).toBe(100);
    await deleteSave(0);
    expect((await loadSaves())[0]).toBeNull();
    expect((await loadSaves())[1]?.mode).toBe("creative");
  });
  it("loads legacy dimensions at their fixed slot size without deleting excess animals", async () => {
    const old = createSave(2, "Legacy", "creative");
    old.worlds.aquarium.size = "small";
    delete old.worlds.sea.size;
    old.worlds.aquarium.fish = Array.from({ length: 40 }, () =>
      makeFish("guppy"),
    );
    await persist(old);
    const loaded = (await loadSaves())[2]!;
    expect(loaded.worlds.aquarium.size).toBe("large");
    expect(loaded.worlds.sea.size).toBe("large");
    expect(loaded.worlds.aquarium.fish).toEqual(old.worlds.aquarium.fish);
    expect(loaded.worlds.aquarium.decor).toEqual(old.worlds.aquarium.decor);
    expect(old.worlds.aquarium.size).toBe("small");
    await deleteSave(2);
  });
  it("refuses to overwrite valid storage with invalid data", async () => {
    await expect(persist({ schema: 55 } as any)).rejects.toThrow(
      "Invalid save",
    );
    expect((await loadSaves())[1]?.name).toBe("Two");
  });
});
