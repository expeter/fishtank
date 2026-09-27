import { test, expect, type Page } from "@playwright/test";
import type { Save } from "../src/game";
async function readSave(page: Page): Promise<Save> {
  return page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const r = indexedDB.open("little-fishtank", 1);
        r.onsuccess = () => {
          const db = r.result,
            tx = db.transaction("saves"),
            request = tx.objectStore("saves").get(0);
          request.onsuccess = () => resolve(request.result);
          tx.oncomplete = () => db.close();
          tx.onerror = () => reject(tx.error);
        };
        r.onerror = () => reject(r.error);
      }),
  );
}
test("every decoration edit can be undone without losing or duplicating inventory", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  await page.getByRole("button", { name: "Decorate Make it yours" }).click();
  await page.getByRole("button", { name: "Leafy fern", exact: true }).click();
  await expect
    .poll(async () => (await readSave(page)).worlds.aquarium.decor.length)
    .toBe(4);
  const placed = (await readSave(page)).worlds.aquarium.decor.at(-1)!;
  await page.getByRole("slider", { name: "Decoration size" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(
      async () => (await readSave(page)).worlds.aquarium.decor.at(-1)!.scale,
    )
    .toBe(1.1);
  await page.getByRole("button", { name: "Flip", exact: true }).click();
  await page.getByRole("button", { name: "Front", exact: true }).click();
  await expect
    .poll(async () => (await readSave(page)).worlds.aquarium.decor.at(-1)!.flip)
    .toBe(true);
  const box = (await page.locator(".tank canvas").boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.8);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.65, {
    steps: 4,
  });
  await page.mouse.up();
  await expect
    .poll(async () => (await readSave(page)).worlds.aquarium.decor.at(-1)!.x)
    .toBeCloseTo(0.4, 2);
  await page.getByRole("button", { name: "Put away", exact: true }).click();
  await expect
    .poll(async () => (await readSave(page)).worlds.aquarium.decor.length)
    .toBe(3);
  const undo = page.getByRole("button", { name: "Undo", exact: true });
  await undo.click();
  await expect
    .poll(async () => (await readSave(page)).worlds.aquarium.decor.length)
    .toBe(4);
  expect(
    (await readSave(page)).inventory.filter((id) => id === "d0"),
  ).toHaveLength(0);
  await undo.click();
  await expect
    .poll(async () => (await readSave(page)).worlds.aquarium.decor.at(-1)!.x)
    .toBe(0.5);
  await undo.click();
  await expect
    .poll(
      async () => (await readSave(page)).worlds.aquarium.decor.at(-1)!.layer,
    )
    .toBe(placed.layer);
  await undo.click();
  await expect
    .poll(async () => (await readSave(page)).worlds.aquarium.decor.at(-1)!.flip)
    .toBe(false);
  await undo.click();
  await expect
    .poll(
      async () => (await readSave(page)).worlds.aquarium.decor.at(-1)!.scale,
    )
    .toBe(1);
  await undo.click();
  await expect
    .poll(async () => (await readSave(page)).worlds.aquarium.decor.length)
    .toBe(3);
  expect(
    (await readSave(page)).inventory.filter((id) => id === "d0"),
  ).toHaveLength(1);
  await expect(undo).toBeDisabled();
  await page.getByRole("button", { name: "Decorate Make it yours" }).click();
  await page.getByRole("button", { name: "Twilight", exact: true }).click();
  await page.getByRole("button", { name: "Riverbed", exact: true }).click();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Scenery & items" }),
  ).toBeVisible();
  await undo.click();
  await expect
    .poll(async () => (await readSave(page)).worlds.aquarium.ground)
    .toBe(0);
  await undo.click();
  await expect
    .poll(async () => (await readSave(page)).worlds.aquarium.background)
    .toBe(0);
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await expect(page.getByRole("button", { name: "Come on in" })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  expect((await readSave(page)).worlds.aquarium.decor).toHaveLength(3);
  expect((await readSave(page)).coins).toBe(100);
});
