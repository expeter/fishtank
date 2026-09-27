import { normalizeSave, uid, validSave, type Save } from "./game";
const owners = new Map<number, string>();
const leaseMs = 30000;
export class SaveOwnershipError extends Error {}
const db = new Promise<IDBDatabase>((resolve, reject) => {
  const r = indexedDB.open("little-fishtank", 1);
  r.onupgradeneeded = () => r.result.createObjectStore("saves");
  r.onsuccess = () => resolve(r.result);
  r.onerror = () => reject(r.error);
});

export interface SlotPresence {
  active: boolean;
  lastActive: number | null;
  until: number | null;
}

/** No names, device IDs, or personal data are stored with a lease. */
export async function getSlotPresence(id: number): Promise<SlotPresence> {
  const d = await db;
  return new Promise((resolve, reject) => {
    const tx = d.transaction("saves");
    const request = tx.objectStore("saves").get(`lease-${id}`);
    request.onsuccess = () => {
      const lease = request.result;
      resolve({
        active: Boolean(lease && lease.until > Date.now()),
        lastActive:
          typeof lease?.lastActive === "number" ? lease.lastActive : null,
        until: typeof lease?.until === "number" ? lease.until : null,
      });
    };
    tx.onerror = () => reject(tx.error);
  });
}

// One atomic lease mechanism on HTTPS and HTTP alike. Web Locks cannot revoke a
// paused tab safely; a transactional ownership token can fence every stale write.
export async function withSlotLock(
  id: number,
  action: (acquired: boolean) => Promise<void>,
  options: { takeover?: boolean } = {},
): Promise<void> {
  const d = await db;
  const owner = uid();
  const key = `lease-${id}`;
  // IndexedDB work can be cancelled during navigation. This synchronous hint
  // releases only the exact document token, so reload never needs to wait 30s.
  const leaveKey = `fishtank-left-${id}`;
  const leftOwner = () => {
    try {
      return globalThis.localStorage?.getItem(leaveKey);
    } catch {
      return null;
    }
  };
  const update = (operation: "claim" | "renew" | "release") =>
    new Promise<boolean>((resolve, reject) => {
      const tx = d.transaction("saves", "readwrite");
      const store = tx.objectStore("saves");
      const request = store.get(key);
      let acquired = false;
      request.onsuccess = () => {
        const lease = request.result;
        if (operation === "release") {
          if (lease?.owner === owner) store.delete(key);
        } else if (
          lease?.owner === owner ||
          (operation === "claim" &&
            (options.takeover ||
              !lease ||
              lease.until <= Date.now() ||
              leftOwner() === lease.owner))
        ) {
          store.put(
            { owner, lastActive: Date.now(), until: Date.now() + leaseMs },
            key,
          );
          acquired = true;
        }
      };
      tx.oncomplete = () => resolve(acquired);
      tx.onerror = tx.onabort = () => reject(tx.error);
    });
  if (!(await update("claim"))) return action(false);
  owners.set(id, owner);
  const timer = setInterval(() => {
    void update("renew").catch(() => {});
  }, 5000);
  const leave = () => {
    clearInterval(timer);
    try {
      globalThis.localStorage?.setItem(leaveKey, owner);
    } catch {
      /* Explicit transfer remains available. */
    }
    void update("release").catch(() => {});
  };
  globalThis.addEventListener?.("pagehide", leave);
  try {
    await action(true);
  } finally {
    clearInterval(timer);
    globalThis.removeEventListener?.("pagehide", leave);
    await update("release");
    // Keep the revoked token so already queued writes cannot bypass ownership.
  }
}

function ownedWrite(
  d: IDBDatabase,
  id: number,
  write: (store: IDBObjectStore) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = d.transaction("saves", "readwrite");
    const store = tx.objectStore("saves");
    let ownershipLost = false;
    const owner = owners.get(id);
    const request = store.get(`lease-${id}`);
    request.onsuccess = () => {
      const lease = request.result;
      if ((owner && lease?.owner !== owner) || (!owner && lease)) {
        ownershipLost = true;
        tx.abort();
        return;
      }
      if (owner) {
        store.put(
          { owner, lastActive: Date.now(), until: Date.now() + leaseMs },
          `lease-${id}`,
        );
      }
      write(store);
    };
    tx.oncomplete = () => resolve();
    tx.onerror = tx.onabort = () =>
      reject(
        ownershipLost
          ? new SaveOwnershipError("World opened in another tab")
          : tx.error,
      );
  });
}
export async function loadSaves(): Promise<(Save | null)[]> {
  const d = await db;
  return Promise.all(
    [0, 1, 2].map(
      (id) =>
        new Promise<Save | null>((resolve, reject) => {
          const t = d.transaction("saves"),
            s = t.objectStore("saves"),
            r = s.get(id);
          r.onsuccess = () => {
            if (validSave(r.result)) resolve(normalizeSave(r.result));
            else {
              const back = s.get(`backup-${id}`);
              back.onsuccess = () => {
                if (validSave(back.result)) resolve(normalizeSave(back.result));
                else if (r.result !== undefined)
                  reject(new Error("Invalid save; original data preserved"));
                else resolve(null);
              };
            }
          };
          t.onerror = () => reject(t.error);
        }),
    ),
  );
}
export async function persist(save: Save) {
  if (!validSave(save)) throw new Error("Invalid save");
  const d = await db;
  await ownedWrite(d, save.id, (s) => {
    const r = s.get(save.id);
    r.onsuccess = () => {
      if (validSave(r.result)) s.put(r.result, `backup-${save.id}`);
      s.put(save, save.id);
    };
  });
}
export async function deleteSave(id: number) {
  const d = await db;
  await ownedWrite(d, id, (store) => {
    store.delete(id);
    store.delete(`backup-${id}`);
  });
}
