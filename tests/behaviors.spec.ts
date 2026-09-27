import { test, expect, type Page } from "@playwright/test";
import { createSave, makeFish, type Save } from "../src/game";
import { fishColor } from "../src/appearance";
import { waterSurface } from "../src/behaviors";
async function seed(page: Page, save: Save) {
  await page.goto("/");
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
}
async function savedResident(page: Page, id: string) {
  return page.evaluate(async (fishId) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("little-fishtank", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const saved = await new Promise<Save>((resolve, reject) => {
      const request = db.transaction("saves").objectStore("saves").get(0);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return saved.worlds.aquarium.fish.find((fish) => fish.id === fishId)!;
  }, id);
}
async function pixels(page: Page, color: string) {
  return page
    .locator(".tank canvas")
    .evaluate((canvas: HTMLCanvasElement, color) => {
      const swatch = document.createElement("canvas");
      swatch.width = swatch.height = 1;
      const ctx = swatch.getContext("2d")!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const match = ctx.getImageData(0, 0, 1, 1).data;
      const data = canvas
        .getContext("2d")!
        .getImageData(0, 0, canvas.width, canvas.height).data;
      let n = 0,
        x = 0,
        y = 0;
      for (let i = 0; i < data.length; i += 4)
        if (
          data[i] === match[0] &&
          data[i + 1] === match[1] &&
          data[i + 2] === match[2]
        ) {
          n++;
          const pixel = i / 4;
          x += pixel % canvas.width;
          y += Math.floor(pixel / canvas.width);
        }
      return {
        count: n,
        x: n ? x / n / canvas.width : 0,
        y: n ? y / n / canvas.height : 0,
      };
    }, color);
}
test("rendered fish follows a finger, eats visible food, and updates its care stats", async ({
  page,
}) => {
  const s = createSave(0, "Play reef", "progression");
  s.tutorial = false;
  s.worlds.aquarium.decor = [];
  const f = {
    ...makeFish("guppy", true),
    seed: 3,
    playful: 0.9,
    x: 0.2,
    y: 0.6,
    careUntil: Date.now() + 600000,
    hunger: 85,
  };
  s.worlds.aquarium.fish = [f];
  await seed(page, s);
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: "Guppy 100%" }).click();
  await page
    .locator(".fish-modal")
    .getByRole("button", { name: "Draw a trail", exact: true })
    .click();
  const box = (await page.locator(".tank canvas").boundingBox())!;
  await page
    .locator(".tank canvas")
    .click({ position: { x: box.width * 0.8, y: box.height * 0.6 } });
  await expect
    .poll(async () => (await pixels(page, fishColor(f))).x)
    .toBeGreaterThan(0.67);
  await page
    .getByRole("button", { name: "Explore Drag the world", exact: true })
    .click();
  await page.getByRole("button", { name: "Feed A little nibble" }).click();
  await page
    .locator(".tank canvas")
    .click({ position: { x: box.width * 0.4, y: box.height * 0.6 } });
  // Food now has different shapes and colors; it need not all be eaten.
  const foodColors = ["#ffe289", "#dd803e", "#efba56", "#aaca62", "#f7ce8b"];
  await expect
    .poll(async () => {
      const samples = await Promise.all(
        foodColors.map((color) => pixels(page, color)),
      );
      return samples.filter((sample) => sample.count > 0).length;
    })
    .toBeGreaterThan(2);
  await page
    .getByRole("button", { name: "Explore Drag the world", exact: true })
    .click();
  await expect
    .poll(async () => (await pixels(page, fishColor(f))).x)
    .toBeLessThan(0.47);
  // An actual consumed pellet changes this fish's saved hunger; simply tapping
  // the tank no longer feeds every resident, nor must the remaining crumbs vanish.
  await expect
    .poll(async () => (await savedResident(page, f.id)).hunger, {
      timeout: 10000,
    })
    .toBeLessThan(65);
  expect((await savedResident(page, f.id)).lastFedAt).toBeGreaterThanOrEqual(
    f.born,
  );
  await page.screenshot({ path: "/tmp/fishtank-feeding.png", fullPage: true });
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  expect((await savedResident(page, f.id)).hunger).toBeLessThan(65);
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: "Guppy 100%" }).click();
  await expect(page.locator(".fish-stats")).toContainText("Happy");
  await expect(page.locator(".fish-stats")).toContainText(/Doing fine|Full/);
});
test("rendered jump crosses the water surface and returns underwater", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-09-26T12:00:00Z") });
  const now = Date.parse("2026-09-26T12:00:00Z");
  const s = createSave(0, "Splash reef", "creative", now);
  s.tutorial = false;
  s.worlds.aquarium.decor = [];
  const f = {
    ...makeFish("guppy", true, now),
    seed: 0,
    playful: 0.9,
    x: 0.5,
    y: 0.6,
    careUntil: now + 3600000,
  };
  s.worlds.aquarium.fish = [f];
  await seed(page, s);
  const time = await page.evaluate(() => performance.now());
  await page.clock.fastForward((58200 - (time % 60000) + 60000) % 60000);
  await page.clock.runFor(32);
  const box = (await page.locator(".tank canvas").boundingBox())!;
  expect((await pixels(page, fishColor(f))).y).toBeLessThan(
    waterSurface(box.height) / box.height - 0.025,
  );
  await page.screenshot({ path: "/tmp/fishtank-jumping.png", fullPage: true });
  await page.clock.runFor(2200);
  expect((await pixels(page, fishColor(f))).y).toBeGreaterThan(
    waterSurface(box.height) / box.height + 0.08,
  );
});
test("frog catches an above-water mosquito and resting fish close their eyes", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-09-26T12:00:00Z") });
  const now = Date.parse("2026-09-26T12:00:00Z");
  const s = createSave(0, "Lily pond", "creative", now);
  s.tutorial = false;
  s.worlds.aquarium.decor = [];
  s.worlds.aquarium.fish = [
    { ...makeFish("frog", true, now), seed: 0, x: 0.7 },
    {
      ...makeFish("guppy", true, now),
      seed: Math.PI / 2,
      x: 0.3,
      y: 0.65,
      careUntil: 0,
    },
  ];
  await seed(page, s);
  await page.clock.runFor(1000);
  await page.screenshot({ path: "/tmp/fishtank-resting.png", fullPage: true });
  const time = await page.evaluate(() => performance.now());
  await page.clock.fastForward((9150 - (time % 12000) + 12000) % 12000);
  await page.clock.runFor(32);
  expect((await pixels(page, "#dca2a0")).count).toBeGreaterThan(10);
  await page.screenshot({
    path: "/tmp/fishtank-frog-catching.png",
    fullPage: true,
  });
  await page.clock.runFor(600);
  expect((await pixels(page, "#dca2a0")).count).toBe(0);
  expect((await pixels(page, "#496957")).count).toBe(0);
});

test("away growth preserves a hungry content animal and care restores happy well-fed stats", async ({
  page,
}) => {
  const now = Date.now();
  const s = createSave(0, "Welcome back", "progression", now - 86400000);
  s.tutorial = false;
  s.worlds.aquarium.fish = [
    {
      ...makeFish("goldfish", false, now - 86400000),
      name: "Old friend",
      hunger: 85,
      mood: 60,
      seed: 2,
    },
  ];
  await seed(page, s);
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: "Old friend 100%" }).click();
  await expect(page.locator(".fish-stats")).toContainText("Content");
  await expect(page.locator(".fish-stats")).toContainText("Peckish");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Feed A little nibble" }).click();
  for (let i = 0; i < 3; i++)
    await page.locator(".tank canvas").click({ position: { x: 300, y: 180 } });
  await page
    .getByRole("button", { name: "Explore Drag the world", exact: true })
    .click();
  await expect
    .poll(
      async () => {
        const resident = await savedResident(
          page,
          s.worlds.aquarium.fish[0].id,
        );
        return resident.hunger < 65 && resident.mood > 70;
      },
      { timeout: 10000 },
    )
    .toBe(true);
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: "Old friend 100%" }).click();
  await expect(page.locator(".fish-stats")).toContainText("Happy");
  await expect(page.locator(".fish-stats")).toContainText(/Doing fine|Full/);
  await expect(page.locator(".friends")).toContainText("1");
  await page.screenshot({
    path: "/tmp/fishtank-care-stats.png",
    fullPage: true,
  });
});
