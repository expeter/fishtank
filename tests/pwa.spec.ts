import { test, expect } from "@playwright/test";
import { createSave, makeFish, uid, VERSION } from "../src/game";
test("production app reopens offline with assets and saved worlds", async ({
  page,
  context,
}) => {
  test.skip(!process.env.FT_PRODUCTION, "Requires production preview");
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await expect(page.getByRole("button", { name: "Come on in" })).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator(".friends")).toContainText("2");
  expect(
    await page.evaluate(() => navigator.serviceWorker.controller !== null),
  ).toBe(true);
});
test("legacy over-capacity habitat keeps residents and remains interactive", async ({
  page,
}) => {
  await page.goto("/");
  const s = createSave(0, "Full of life", "creative");
  s.tutorial = false;
  s.worlds.aquarium.fish = Array.from({ length: 100 }, (_, i) =>
    makeFish(
      ["guppy", "goldfish", "tetra", "angelfish", "snail", "frog"][i % 6],
      true,
    ),
  );
  s.worlds.aquarium.decor = Array.from({ length: 150 }, (_, i) => ({
    id: uid(),
    kind: `d${i % 12}`,
    x: 0.05 + (i % 20) / 22,
    y: 0.5 + Math.floor(i / 20) / 17,
    scale: 0.5,
    flip: false,
    layer: i,
  }));
  await page.evaluate(async (save) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open("little-fishtank", 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    await new Promise<void>((resolve) => {
      const tx = db.transaction("saves", "readwrite");
      tx.objectStore("saves").put(save, 0);
      tx.oncomplete = () => resolve();
    });
    db.close();
  }, s);
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page.locator(".friends")).toContainText("100");
  await page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
  await page.getByRole("button", { name: "Guppy Add friend" }).click();
  await expect(page.getByRole("status")).toContainText("Sell an animal");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  const fps = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let n = 0;
        const start = performance.now();
        const frame = () => {
          n++;
          if (performance.now() - start > 1500)
            resolve((n * 1000) / (performance.now() - start));
          else requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }),
  );
  console.log(
    `Full habitat headless browser frame rate: ${fps.toFixed(1)} FPS`,
  );
  expect(fps).toBeGreaterThan(15);
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await expect(
    page.getByRole("heading", { name: "Your little friends" }),
  ).toBeVisible();
});

test("a waiting update refuses failed saves, then saves successfully before reloading", async ({
  page,
}) => {
  test.skip(!process.env.FT_PRODUCTION, "Requires production preview");
  const { readFile, writeFile, unlink } = await import("node:fs/promises");
  const filename = `update-check-${Date.now()}.js`;
  await writeFile(
    `dist/${filename}`,
    (await readFile("dist/sw.js", "utf8")).replace(
      ".then(()=>self.skipWaiting())",
      "",
    ) + "\n// update lifecycle verification\n",
  );
  try {
    await page.route("**/version.json", (route) =>
      route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          version: `${Number(VERSION.split(".")[0]) + 1}.0.0`,
        }),
      }),
    );
    await page.goto("/");
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.getByRole("button", { name: "Create a world" }).first().click();
    await page
      .getByPlaceholder("My little paradise")
      .pressSequentially("Update reef");
    await page.getByRole("button", { name: "Let’s dive in" }).click();

    await page
      .getByRole("button", { name: "Little shop Find something lovely" })
      .click();
    await page.getByRole("button", { name: "Goldfish 20" }).click();
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await page.evaluate(async (name) => {
      const registration = await navigator.serviceWorker.register("/" + name, {
        scope: "/",
      });
      if (registration.waiting) return;
      await new Promise<void>((resolve, reject) => {
        const worker = registration.installing;
        if (!worker) {
          reject(new Error("No installing update"));
          return;
        }
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed") resolve();
          if (worker.state === "redundant")
            reject(new Error("Update installation failed"));
        });
      });
    }, filename);
    await expect(page.locator(".friends")).toContainText("3");
    const oldController = await page.evaluate(
      () => navigator.serviceWorker.controller!.scriptURL,
    );
    await page.evaluate(() => {
      const original = IDBDatabase.prototype.transaction;
      (window as any).__restoreWrites = () => {
        IDBDatabase.prototype.transaction = original;
      };
      IDBDatabase.prototype.transaction = function (
        ...args: Parameters<IDBDatabase["transaction"]>
      ) {
        if (args[1] === "readwrite")
          throw new DOMException("Storage full", "QuotaExceededError");
        return original.apply(this, args);
      };
    });
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page
      .getByRole("button", { name: "Save and update", exact: true })
      .click();
    await expect(page.locator(".error-banner")).toContainText(
      "Browser storage is unavailable",
    );
    await expect(page.getByRole("main", { name: "Update reef" })).toBeVisible();
    expect(
      await page.evaluate(() => navigator.serviceWorker.controller!.scriptURL),
    ).toBe(oldController);
    expect(
      await page.evaluate(async () =>
        Boolean((await navigator.serviceWorker.getRegistration())!.waiting),
      ),
    ).toBe(true);
    await page.evaluate(() => (window as any).__restoreWrites());
    const reload = page.waitForEvent("load");
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page
      .getByRole("button", { name: "Save and update", exact: true })
      .click();
    await reload;
    await page.getByRole("button", { name: "Come on in" }).click();
    await expect(page.getByRole("main", { name: "Update reef" })).toBeVisible();
    await expect(page.locator(".friends")).toContainText("3");
    await expect(page.locator(".coin-pill")).toContainText("80");
  } finally {
    await unlink(`dist/${filename}`);
  }
});
