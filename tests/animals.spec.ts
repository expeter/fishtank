import { test, expect } from "@playwright/test";
import { createSave, growth } from "../src/game";

test("individual colors and a discovered baby survive saving and reopening", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0.1;
  });
  await page.goto("/");
  const now = Date.now();
  const save = createSave(0, "Family reef", "progression", now);
  save.tutorial = false;
  const [a, b] = save.worlds.aquarium.fish;
  a.name = "Sunny";
  b.name = "Coral";
  a.seed = 12;
  b.seed = 88;
  a.grown = b.grown = growth[0];
  a.careUntil = b.careUntil = now + 120000;
  a.lastFedAt = b.lastFedAt = now;
  save.breedAt.aquariumguppy = now - 300000;
  await page.evaluate(async (s) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open("little-fishtank", 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("saves", "readwrite");
      tx.objectStore("saves").put(s, 0);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }, save);
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page.locator(".birth-banner")).toContainText(
    "A tiny new friend!",
  );
  await expect(page.locator(".friends")).toContainText("3");
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: "Sunny 100%" }).click();
  const sunny = await page
    .locator(".individual-portrait canvas")
    .evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: "Coral 100%" }).click();
  const coral = await page
    .locator(".individual-portrait canvas")
    .evaluate((c: HTMLCanvasElement) => c.toDataURL());
  expect(coral).not.toBe(sunny);
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.screenshot({ path: "/tmp/fishtank-family.png", fullPage: true });
  await page.getByRole("button", { name: "Meet the baby" }).click();
  await expect(page.locator(".born-here")).toHaveText(
    "Born in your little world",
  );
  await page.getByPlaceholder("Give me a name…").pressSequentially("Pebble");
  await expect(page.getByRole("heading", { name: "Pebble" })).toBeVisible();
  const babyBefore = await page
    .locator(".individual-portrait canvas")
    .evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await expect(page.getByRole("button", { name: "Come on in" })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page.locator(".birth-banner")).toHaveCount(0);
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: /Pebble/ }).click();
  await expect(page.locator(".born-here")).toHaveText(
    "Born in your little world",
  );
  const babyAfter = await page
    .locator(".individual-portrait canvas")
    .evaluate((c: HTMLCanvasElement) => c.toDataURL());
  expect(babyAfter).toBe(babyBefore);
});
