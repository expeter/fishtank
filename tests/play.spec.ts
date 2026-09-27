import { test, expect, type Page } from "@playwright/test";
import { createSave, makeFish, type Save } from "../src/game";
async function saved(page: Page): Promise<Save> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open("little-fishtank", 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    const value = await new Promise<Save>((resolve, reject) => {
      const r = db.transaction("saves").objectStore("saves").get(0);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    db.close();
    return value;
  });
}
test("a selected playful friend learns a drawn trail, remembers it after reopening, and keeps game actions focused on that friend", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const save = createSave(0, "Play school", "creative");
  save.tutorial = false;
  save.story = { fed: true, planted: true, hidden: true };
  save.worlds.aquarium.fish = [
    {
      ...makeFish("guppy", true),
      name: "Sunny",
      seed: 0,
      x: 0.5,
      y: 0.55,
      playful: 0.9,
      mood: 90,
    },
    {
      ...makeFish("guppy", true),
      name: "Ruby",
      seed: 1,
      x: 0.55,
      y: 0.55,
      playful: 0.9,
      mood: 90,
    },
  ];
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
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: "Sunny 100%" }).click();
  await expect(page.locator(".compact-friend")).toBeVisible();
  await page.getByRole("button", { name: "Draw a trail", exact: true }).click();
  await expect(page.locator(".compact-friend")).toHaveCount(0);
  await expect(page.locator(".play-tools")).toHaveCount(0);
  const box = (await page.locator(".tank canvas").boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.55);
  await page.mouse.down();
  for (const [x, y] of [
    [0.45, 0.55],
    [0.55, 0.57],
    [0.65, 0.65],
    [0.55, 0.7],
    [0.4, 0.62],
  ]) {
    await page.mouse.move(box.x + box.width * x, box.y + box.height * y, {
      steps: 12,
    });
    await page.waitForTimeout(130);
  }
  await page.mouse.up();
  await expect
    .poll(
      async () =>
        (await saved(page)).worlds.aquarium.fish[0].trick?.points.length ?? 0,
    )
    .toBeGreaterThan(3);
  expect((await saved(page)).worlds.aquarium.fish[1].trick).toBeUndefined();
  const remembered = (await saved(page)).worlds.aquarium.fish[0].trick;
  expect((await saved(page)).playGift).toBe(true);
  expect((await saved(page)).inventory).toContain("d25");
  await page.screenshot({ path: "/tmp/fishtank-learned-trail.png" });
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  expect((await saved(page)).worlds.aquarium.fish[0].trick).toEqual(remembered);
  expect((await saved(page)).playGift).toBe(true);
  expect(
    (await saved(page)).inventory.filter((id) => id === "d25"),
  ).toHaveLength(1);
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: "Sunny 100%" }).click();
  await page
    .getByRole("button", { name: "Replay learned trails", exact: true })
    .click();
  await expect(page.locator(".compact-friend")).toHaveCount(0);
  await expect(page.locator(".play-tools")).toHaveCount(0);
  for (const label of [
    "Replay learned trails",
    "Circle dance",
    "Gather friends",
    "Bubble game",
  ]) {
    await page
      .getByRole("button", { name: "Play Make a friend", exact: true })
      .click();
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect(page.locator(".tank canvas")).toBeVisible();
    await expect(page.locator(".play-tools")).toHaveCount(0);
  }
  await page.screenshot({ path: "/tmp/fishtank-bubble-game.png" });
  await page
    .getByRole("button", { name: "Play Make a friend", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Finish playing", exact: true })
    .click();
  await expect(page.locator(".play-tools")).toContainText("Tap a fish to play");
  await expect(
    page.getByRole("button", { name: "Fish details", exact: true }),
  ).toHaveCount(0);
});
