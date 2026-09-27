import { test, expect, type Page } from "@playwright/test";
import { createSave, type Save } from "../src/game";
import { glassPatch, litterPosition } from "../src/cleanup";
import { waterSurface } from "../src/behaviors";
async function seed(page: Page, save: Save) {
  await page.goto("/");
  await page.evaluate(async (save) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open("little-fishtank", 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("saves", "readwrite");
      tx.objectStore("saves").put(save, 0);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }, save);
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
}
async function saved(page: Page): Promise<Save> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open("little-fishtank", 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    const save = await new Promise<Save>((resolve, reject) => {
      const r = db.transaction("saves").objectStore("saves").get(0);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    db.close();
    return save;
  });
}
test("food costs per drop, rapid taps cannot overspend, and active pocket money restores buying power", async ({
  page,
}) => {
  const now = Date.parse("2026-09-27T12:00:00Z");
  await page.clock.install({ time: new Date(now) });
  const save = createSave(0, "Pocket money", "progression", now);
  save.tutorial = false;
  save.coins = 2;
  save.earned = 0;
  for (const fish of save.worlds.aquarium.fish) {
    fish.hunger = 0;
    fish.seed = 0;
    fish.x = 0.65;
    fish.y = 0.55;
  }
  await seed(page, save);
  await page.locator(".tank canvas").evaluate((canvas) => {
    const box = canvas.getBoundingClientRect();
    for (let i = 0; i < 12; i++) {
      canvas.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          clientX: box.left + 25,
          clientY: box.top + box.height * 0.75,
          pointerId: 1,
        }),
      );
      canvas.dispatchEvent(
        new PointerEvent("pointerup", {
          bubbles: true,
          clientX: box.left + 25,
          clientY: box.top + box.height * 0.75,
          pointerId: 1,
        }),
      );
    }
  });
  await expect.poll(async () => (await saved(page)).coins).toBe(0);
  await expect(page.locator(".coin-pill")).toHaveText("0coins");
  expect(
    (await saved(page)).worlds.aquarium.fish.every(
      (fish) => fish.lastFedAt === undefined,
    ),
  ).toBe(true);
  await expect(
    page.getByText("Not enough coins. Pocket money: 5 each minute of play.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.clock.fastForward(60000);
  await expect.poll(async () => (await saved(page)).coins).toBe(5);
  expect((await saved(page)).earned).toBe(0);
  await page.getByRole("button", { name: "Feed A little nibble" }).click();
  await page.getByRole("button", { name: "Worms", exact: true }).click();
  await page.locator(".tank canvas").click({ position: { x: 25, y: 250 } });
  await expect.poll(async () => (await saved(page)).coins).toBe(3);
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  expect((await saved(page)).coins).toBe(3);
});
test("optional aquarium wiping and individual shore cleanup persist when the world reopens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const now = Date.now(),
    save = createSave(0, "Clean little world", "creative", now - 180000);
  save.tutorial = false;
  save.lastAt = now;
  save.worlds.aquarium.fish = [];
  save.worlds.sea.fish = [];
  await seed(page, save);
  await page.getByRole("button", { name: "Decorate Make it yours" }).click();
  await page.getByRole("button", { name: "Clean window", exact: true }).click();
  const canvas = page.locator(".tank canvas"),
    box = (await canvas.boundingBox())!,
    patch = glassPatch(0, save.created);
  await page.screenshot({ path: "/tmp/fishtank-glass-needs-wiping.png" });
  await canvas.click({
    position: { x: patch.x * box.width, y: patch.y * box.height },
  });
  await expect
    .poll(
      async () => (await saved(page)).worlds.aquarium.cleanup?.glass[0] ?? 0,
    )
    .toBeGreaterThan(now);
  const cleanTime = (await saved(page)).worlds.aquarium.cleanup!.glass[0];
  await page.screenshot({ path: "/tmp/fishtank-glass-after-wipe.png" });
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  expect((await saved(page)).worlds.aquarium.cleanup!.glass[0]).toBe(cleanTime);
  await page
    .getByRole("button", { name: "Woodland coast", exact: true })
    .click();
  await page.getByRole("button", { name: "Decorate Make it yours" }).click();
  await page.getByRole("button", { name: "Clean shore", exact: true }).click();
  await expect(page.locator(".clean-tools")).toContainText(
    "Tap litter on the shore",
  );
  const shore = (await canvas.boundingBox())!,
    litter = litterPosition(0, save.created);
  await canvas.click({
    position: {
      x: litter.x * shore.width,
      y: waterSurface(shore.height) + litter.offset,
    },
  });
  await expect
    .poll(
      async () =>
        (await saved(page)).worlds.sea.cleanup?.litter.filter((t) => t > 0)
          .length ?? 0,
    )
    .toBe(1);
  const shoreState = (await saved(page)).worlds.sea.cleanup!.litter;
  await page.screenshot({ path: "/tmp/fishtank-shore-cleanup.png" });
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  expect((await saved(page)).worlds.sea.cleanup!.litter).toEqual(shoreState);
  expect((await saved(page)).coins).toBe(save.coins);
});

test("homework and nature jobs are clearly marked as future ideas without awarding coins", async ({
  page,
}) => {
  const save = createSave(0, "Future ideas", "progression");
  save.tutorial = false;
  await seed(page, save);
  for (const [habitat, label, heading] of [
    ["Aquarium", "Homework · coming next", "Homework club"],
    ["Woodland coast", "Mini job · coming next", "Little nature helpers"],
  ]) {
    await page.getByRole("button", { name: habitat, exact: true }).click();
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Coming in a later version", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("dialog").locator("input,select,textarea"),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Close", exact: true }).click();
  }
  expect((await saved(page)).coins).toBe(100);
});
