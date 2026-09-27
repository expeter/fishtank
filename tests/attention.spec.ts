import { test, expect, type Page } from "@playwright/test";
import { createSave, makeFish, type Fish, type Save } from "../src/game";
import { fishColor } from "../src/appearance";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

async function fixture(page: Page) {
  await page.clock.install({ time: new Date("2026-09-27T12:00:00Z") });
  await page.goto("/");
  const now = await page.evaluate(() => Date.now());
  const save = createSave(0, "One little friend", "creative", now);
  save.tutorial = false;
  save.story = { fed: true, planted: true, hidden: true };
  save.worlds.aquarium.decor = [];
  const shy = {
    ...makeFish("guppy", true, now),
    name: "Shy",
    seed: 3,
    playful: 0.1,
    mood: 30,
    x: 0.35,
    y: 0.5,
    trick: {
      points: [
        { x: 0.2, y: 0.35 },
        { x: 0.3, y: 0.35 },
        { x: 0.7, y: 0.7 },
        { x: 0.8, y: 0.7 },
      ],
      learnedAt: now - 500000,
      rehearsals: 1,
    },
  };
  const other = {
    ...makeFish("goldfish", true, now),
    name: "Others",
    seed: 62,
    playful: 0.9,
    mood: 90,
    x: 0.8,
    y: 0.65,
  };
  save.worlds.aquarium.fish = [shy, other];
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
  await page.getByRole("button", { name: "Come on in", exact: true }).click();
  // Wait for the first actual fish frame, including on a busy software renderer.
  await expect
    .poll(async () => {
      await page.clock.runFor(100);
      return (await pixels(page, shy)).count;
    })
    .toBeGreaterThan(20);
  return { shy, other };
}
async function pixels(page: Page, fish: Fish) {
  return page
    .locator(".tank canvas")
    .evaluate((canvas: HTMLCanvasElement, color) => {
      const swatch = document.createElement("canvas");
      swatch.width = swatch.height = 1;
      const ctx = swatch.getContext("2d")!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const rgb = ctx.getImageData(0, 0, 1, 1).data;
      const data = canvas
        .getContext("2d")!
        .getImageData(0, 0, canvas.width, canvas.height).data;
      let n = 0,
        x = 0,
        y = 0;
      for (let i = 0; i < data.length; i += 4)
        if (
          data[i] === rgb[0] &&
          data[i + 1] === rgb[1] &&
          data[i + 2] === rgb[2]
        ) {
          n++;
          x += (i / 4) % canvas.width;
          y += Math.floor(i / 4 / canvas.width);
        }
      return {
        count: n,
        x: n ? x / n / canvas.width : 0,
        y: n ? y / n / canvas.height : 0,
      };
    }, fishColor(fish));
}
async function tapFish(page: Page, fish: Fish) {
  const point = await pixels(page, fish);
  expect(point.count).toBeGreaterThan(20);
  const box = (await page.locator(".tank canvas").boundingBox())!;
  await page.touchscreen.tap(
    box.x + point.x * box.width,
    box.y + point.y * box.height,
  );
  await expect(page.locator(".compact-friend")).toBeVisible();
}
async function saved(page: Page): Promise<Save> {
  return page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const r = indexedDB.open("little-fishtank", 1);
        r.onsuccess = () => {
          const db = r.result,
            tx = db.transaction("saves"),
            q = tx.objectStore("saves").get(0);
          q.onsuccess = () => resolve(q.result);
          tx.oncomplete = () => db.close();
        };
        r.onerror = () => reject(r.error);
      }),
  );
}

test("one fish tap opens its centered naming and play card directly", async ({
  page,
}) => {
  const { shy } = await fixture(page);
  await tapFish(page, shy);
  await expect(page.locator(".fish-peek")).toHaveCount(0);
  const card = page.locator(".compact-friend");
  await expect(
    card.getByRole("heading", { name: "Shy", exact: true }),
  ).toBeVisible();
  const box = (await card.boundingBox())!;
  expect(Math.abs(box.x + box.width / 2 - 195)).toBeLessThan(12);
  expect(Math.abs(box.y + box.height / 2 - 422)).toBeLessThan(100);
  for (const name of [
    "Draw a trail",
    "Replay learned trails",
    "Circle dance",
    "Gather friends",
    "Bubble game",
  ])
    await expect(card.getByRole("button", { name, exact: true })).toBeVisible();
  await card.getByLabel("A name for your friend").fill("Pebble");
  await page.clock.runFor(1200);
  expect(
    (await saved(page)).worlds.aquarium.fish.find((f) => f.id === shy.id)?.name,
  ).toBe("Pebble");
  await page.screenshot({ path: "/tmp/fishtank-attention-card.png" });
});

test("a chosen shy fish responds to circle, bubble and remembered trail actions", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const { shy, other } = await fixture(page);
  for (const action of [
    "Circle dance",
    "Bubble game",
    "Replay learned trails",
  ]) {
    if (action === "Circle dance") await tapFish(page, shy);
    else {
      await page
        .getByRole("button", { name: "Play Make a friend", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Fish details", exact: true })
        .click();
    }
    await page
      .locator(".compact-friend")
      .getByRole("button", { name: action, exact: true })
      .click();
    await expect(page.locator(".compact-friend")).toHaveCount(0);
    await expect(page.locator(".play-tools")).toHaveCount(0);
    if (action === "Bubble game") {
      const box = (await page.locator(".tank canvas").boundingBox())!;
      await page.touchscreen.tap(
        box.x + box.width * 0.55,
        box.y + box.height * 0.7,
      );
      await page.clock.runFor(4000);
      await expect(page.locator(".compact-friend")).toHaveCount(0);
    } else {
      // The old implementation reset the assignment after eleven seconds.
      await page.clock.runFor(14000);
      await page.getByRole("button", { name: "Feed A little nibble" }).click();
      await page.getByRole("button", { name: "Flakes", exact: true }).click();
    }
    const points = [];
    for (let i = 0; i < 4; i++) {
      await page.clock.runFor(1000);
      const p = await pixels(page, shy);
      expect(p.count).toBeGreaterThan(20);
      points.push(p);
    }
    const horizontal =
      Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x));
    const vertical =
      Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y));
    expect(
      Math.max(horizontal, vertical),
      `${action} must visibly move the selected shy fish`,
    ).toBeGreaterThan(0.05);
    if (action === "Bubble game") expect(vertical).toBeGreaterThan(0.12);
    if (action === "Replay learned trails")
      expect(horizontal).toBeGreaterThan(0.15);
  }
  await page.clock.runFor(1200);
  const otherAfter = (await saved(page)).worlds.aquarium.fish.find(
    (f) => f.id === other.id,
  )!;
  expect(otherAfter.trick).toBeUndefined();
  expect(otherAfter.careUntil).toBe(other.careUntil);
  await page.screenshot({ path: "/tmp/fishtank-attention-trail.png" });
  expect(errors).toEqual([]);
});
