import { test, expect, type Page } from "@playwright/test";
import type { Save } from "../src/game";

test.use({ viewport: { width: 393, height: 851 }, hasTouch: true });
async function saved(page: Page, slot: number): Promise<Save> {
  return page.evaluate(
    (slot) =>
      new Promise((resolve, reject) => {
        const request = indexedDB.open("little-fishtank", 1);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction("saves");
          const get = tx.objectStore("saves").get(slot);
          get.onsuccess = () => resolve(get.result);
          tx.oncomplete = () => db.close();
        };
        request.onerror = () => reject(request.error);
      }),
    slot,
  );
}
for (const slot of [0, 1, 2]) {
  test(`slot ${slot + 1}: rotation preserves the world and allows vertical exploration`, async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: "Create a world" })
      .nth(slot)
      .click();
    await page.getByRole("button", { name: "Let’s dive in" }).click();
    const canvas = page.locator(".tank canvas");
    await expect(canvas).toBeVisible();
    await expect
      .poll(async () => (await saved(page, slot))?.worlds.aquarium.viewSize)
      .toEqual({ width: 393, height: 775 });
    const original = await canvas.boundingBox();
    const layout = (await saved(page, slot)).worlds.aquarium.decor;
    await page.setViewportSize({ width: 851, height: 393 });
    await expect
      .poll(async () => (await canvas.boundingBox())!.height)
      .toBe(original!.height);
    expect((await canvas.boundingBox())!.width).toBe(original!.width);
    expect((await saved(page, slot)).worlds.aquarium.decor).toEqual(layout);
    // Four-way keyboard panning remains available independently of the tool.
    await canvas.focus();
    await page.keyboard.press("ArrowDown");
    const tank = page.locator(".tank");
    await expect
      .poll(() => tank.evaluate((el) => el.scrollTop))
      .toBeGreaterThan(100);
    // The explore tool supports finger dragging vertically, not just horizontally.
    await page.getByRole("button", { name: /Explore/ }).click();
    const box = (await canvas.boundingBox())!;
    const x = Math.max(60, box.x + Math.min(box.width, 700) / 2);
    const before = await tank.evaluate((el) => el.scrollTop);
    await page.mouse.move(x, 210);
    await page.mouse.down();
    await page.mouse.move(x, 100, { steps: 8 });
    await page.mouse.up();
    await expect
      .poll(() => tank.evaluate((el) => el.scrollTop))
      .toBeGreaterThan(before + 90);
    if (slot === 2) {
      await canvas.focus();
      await page.keyboard.press("ArrowRight");
      await expect
        .poll(() => tank.evaluate((el) => el.scrollLeft))
        .toBeGreaterThan(0);
    }
    await page.screenshot({ path: `/tmp/fishtank-rotation-${slot}.png` });
    await page.setViewportSize({ width: 393, height: 851 });
    await expect
      .poll(async () => (await canvas.boundingBox())!.height)
      .toBe(original!.height);
    expect((await canvas.boundingBox())!.width).toBe(original!.width);
    await page.setViewportSize({ width: 851, height: 393 });
    await page.reload();
    await page.getByRole("button", { name: "Come on in" }).click();
    await expect(canvas).toBeVisible();
    expect((await canvas.boundingBox())!.height).toBe(original!.height);
    expect((await canvas.boundingBox())!.width).toBe(original!.width);
    expect((await saved(page, slot)).worlds.aquarium.decor).toEqual(layout);
    await page
      .getByRole("button", { name: "Woodland coast", exact: true })
      .click();
    expect((await canvas.boundingBox())!.height).toBe(original!.height);
    expect((await canvas.boundingBox())!.width).toBe(original!.width);
    await page.getByRole("button", { name: "Aquarium", exact: true }).click();
    await canvas.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.getByRole("button", { name: "Decorate Make it yours" }).click();
    await page.getByRole("button", { name: "Leafy fern", exact: true }).click();
    await expect
      .poll(async () => (await saved(page, slot)).worlds.aquarium.decor.length)
      .toBe(layout.length + 1);
    const placed = (await saved(page, slot)).worlds.aquarium.decor.at(-1)!;
    const visible = await tank.evaluate((el) => ({
      top: el.scrollTop,
      height: el.clientHeight,
    }));
    expect(placed.y * original!.height).toBeGreaterThan(visible.top);
    expect(placed.y * original!.height).toBeLessThan(
      visible.top + visible.height,
    );
  });
}
