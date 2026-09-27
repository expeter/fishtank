import "fake-indexeddb/auto";
import { afterEach, expect, it, vi } from "vitest";
import { createSave } from "../src/game";
import {
  withSlotLock,
  persist,
  deleteSave,
  loadSaves,
  SaveOwnershipError,
} from "../src/storage";

afterEach(() => vi.unstubAllGlobals());

async function replaceLease(value: { owner: string; until: number }) {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open("little-fishtank", 1);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("saves", "readwrite");
      tx.objectStore("saves").put(value, "lease-0");
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    };
  });
}

it("fallback serializes opening/deletion and releases on completion", async () => {
  vi.stubGlobal("navigator", {});
  await withSlotLock(1, async (acquired) => {
    expect(acquired).toBe(true);
    await persist(createSave(1, "Safe world", "creative"));
    await withSlotLock(1, async (other) => {
      expect(other).toBe(false);
    });
  });
  await withSlotLock(1, async (acquired) => {
    expect(acquired).toBe(true);
    await deleteSave(1);
  });
  expect((await loadSaves())[1]).toBeNull();
});

it("an expired lease is recoverable but a stale owner cannot write or delete", async () => {
  vi.stubGlobal("navigator", {});
  await replaceLease({ owner: "crashed-tab", until: Date.now() - 1 });
  const save = createSave(0, "Keep me", "creative");
  await withSlotLock(0, async (acquired) => {
    expect(acquired).toBe(true);
    await persist(save);
    await replaceLease({ owner: "new-tab", until: Date.now() + 30000 });
    await expect(persist({ ...save, coins: 999 })).rejects.toBeInstanceOf(
      SaveOwnershipError,
    );
    await expect(deleteSave(0)).rejects.toBeInstanceOf(SaveOwnershipError);
  });
  await expect(persist({ ...save, coins: 999 })).rejects.toBeInstanceOf(
    SaveOwnershipError,
  );
  expect((await loadSaves())[0]?.coins).toBe(save.coins);
});

it("explicit transfer fences the previous document and its late release", async () => {
  vi.stubGlobal("navigator", {
    locks: {
      request: vi.fn(() => {
        throw new Error("native locks are not required");
      }),
    },
  });
  vi.resetModules();
  const first = await import("../src/storage");
  vi.resetModules();
  const second = await import("../src/storage");
  let releaseFirst!: () => void;
  let releaseSecond!: () => void;
  let firstReady!: () => void;
  let secondReady!: () => void;
  const ready1 = new Promise<void>((r) => {
    firstReady = r;
  });
  const ready2 = new Promise<void>((r) => {
    secondReady = r;
  });
  const save = createSave(2, "Pearl's home", "creative");
  const session1 = first.withSlotLock(2, async (acquired) => {
    expect(acquired).toBe(true);
    await first.persist(save);
    firstReady();
    await new Promise<void>((r) => {
      releaseFirst = r;
    });
  });
  await ready1;
  expect((await second.getSlotPresence(2)).active).toBe(true);
  await second.withSlotLock(2, async (acquired) => {
    expect(acquired).toBe(false);
  });
  const session2 = second.withSlotLock(
    2,
    async (acquired) => {
      expect(acquired).toBe(true);
      expect((await second.loadSaves())[2]?.name).toBe("Pearl's home");
      await second.persist({ ...save, coins: 777 });
      secondReady();
      await new Promise<void>((r) => {
        releaseSecond = r;
      });
    },
    { takeover: true },
  );
  await ready2;
  await expect(first.persist({ ...save, coins: 1 })).rejects.toBeInstanceOf(
    first.SaveOwnershipError,
  );
  await expect(first.deleteSave(2)).rejects.toBeInstanceOf(
    first.SaveOwnershipError,
  );
  releaseFirst();
  await session1;
  expect((await second.getSlotPresence(2)).active).toBe(true);
  await second.persist({ ...save, coins: 888 });
  expect((await second.loadSaves())[2]?.coins).toBe(888);
  releaseSecond();
  await session2;
  expect((await second.getSlotPresence(2)).active).toBe(false);
});

it("pagehide releases ownership for immediate reload and copied sessions cannot steal", async () => {
  const listeners = new Map<string, () => void>();
  vi.stubGlobal("addEventListener", (event: string, callback: () => void) =>
    listeners.set(event, callback),
  );
  vi.stubGlobal("removeEventListener", (event: string) =>
    listeners.delete(event),
  );
  vi.resetModules();
  const oldDocument = await import("../src/storage");
  let release!: () => void;
  let ready!: () => void;
  const started = new Promise<void>((r) => {
    ready = r;
  });
  const running = oldDocument.withSlotLock(2, async (acquired) => {
    expect(acquired).toBe(true);
    ready();
    await new Promise<void>((r) => {
      release = r;
    });
  });
  await started;
  vi.resetModules();
  const newDocument = await import("../src/storage");
  await newDocument.withSlotLock(2, async (acquired) => {
    expect(acquired).toBe(false);
  });
  listeners.get("pagehide")!();
  await newDocument.withSlotLock(2, async (acquired) => {
    expect(acquired).toBe(true);
    await expect(
      oldDocument.persist(createSave(2, "Old", "creative")),
    ).rejects.toBeInstanceOf(oldDocument.SaveOwnershipError);
  });
  release();
  await running;
});
