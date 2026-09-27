import { test, expect, type Page } from "@playwright/test";
import type { Save } from "../src/game";
test.use({ viewport: { width: 393, height: 740 }, hasTouch: true });
async function begin(page: Page, slot = 0, creative = false) {
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).nth(slot).click();
  if (creative)
    await page.getByRole("button", { name: /Just imagine/ }).click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();
  await expect(page.locator(".tank canvas")).toBeVisible();
}
async function saved(page: Page, slot = 0): Promise<Save> {
  return page.evaluate(
    (slot) =>
      new Promise((resolve, reject) => {
        const r = indexedDB.open("little-fishtank", 1);
        r.onsuccess = () => {
          const db = r.result;
          const tx = db.transaction("saves");
          const q = tx.objectStore("saves").get(slot);
          q.onsuccess = () => resolve(q.result);
          tx.oncomplete = () => db.close();
        };
        r.onerror = () => reject(r.error);
      }),
    slot,
  );
}
for (const [slot, size, ratio] of [
  [0, "small", 1],
  [1, "medium", 1.6],
  [2, "large", 2.4],
] as const) {
  test(`slot ${slot + 1} keeps its ${size} size and lower controls leave the forest clear`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await begin(page, slot);
    await expect
      .poll(async () => (await saved(page, slot))?.worlds.aquarium.size)
      .toBe(size);
    const canvas = (await page.locator(".tank canvas").boundingBox())!;
    expect(canvas.width).toBeCloseTo(320 * ratio, 0);
    const controls = [".world-heading", ".habitat-tabs", ".header"];
    const boxes = [];
    for (const selector of controls) {
      const box = (await page.locator(selector).boundingBox())!;
      boxes.push(box);
      expect(box.y).toBeGreaterThan(400);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(320);
    }
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i],
          b = boxes[j];
        expect(a.x + a.width <= b.x || b.x + b.width <= a.x).toBe(true);
      }
    await page
      .getByRole("button", { name: "Woodland coast", exact: true })
      .click();
    await expect
      .poll(async () => (await saved(page, slot)).worlds.sea.size)
      .toBe(size);
    await page.screenshot({ path: `/tmp/fishtank-workbench-slot-${slot}.png` });
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await expect(page.getByLabel("World size", { exact: true })).toHaveCount(0);
  });
}
test("large age buttons and a shared animal limit leave a full habitat unchanged", async ({
  page,
}) => {
  await begin(page, 0, true);
  await page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
  const adult = page.getByRole("button", { name: "Grown-ups", exact: true });
  expect((await adult.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await adult.click();
  await expect(adult).toHaveAttribute("aria-pressed", "true");
  const guppy = page.getByRole("button", {
    name: "Guppy Add friend",
    exact: true,
  });
  for (let i = 0; i < 24; i++) await guppy.click();
  await expect
    .poll(async () => (await saved(page)).worlds.aquarium.fish.length)
    .toBe(24);
  await expect(page.locator(".toast")).toContainText("Sell an animal");
  await page
    .getByRole("button", { name: "Little helpers", exact: true })
    .click();
  await page.getByRole("button", { name: /Window snail Add friend/ }).click();
  await expect
    .poll(async () => (await saved(page)).worlds.aquarium.fish.length)
    .toBe(24);
});
test("mobile side editor supports big rotated items, repeated placement and local sand undo", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await begin(page);
  await page.getByRole("button", { name: "Decorate Make it yours" }).click();
  const panel = (await page.locator(".panel-decorate").boundingBox())!;
  expect(panel.width).toBeLessThanOrEqual(240);
  expect(panel.x).toBeGreaterThan(100);
  await page.getByRole("button", { name: "Leafy fern", exact: true }).click();
  const editor = page.locator(".decor-controls");
  await expect(editor).toBeVisible();
  const scale = page.getByRole("slider", { name: "Decoration size" });
  await scale.focus();
  await page.keyboard.press("End");
  const rotation = page.getByRole("slider", { name: "Decoration rotation" });
  await rotation.focus();
  await page.keyboard.press("End");
  await expect
    .poll(
      async () => (await saved(page)).worlds.aquarium.decor.at(-1)?.rotation,
    )
    .toBe(180);
  expect((await saved(page)).worlds.aquarium.decor.at(-1)?.scale).toBe(4);
  await page.screenshot({ path: "/tmp/fishtank-workbench-editor.png" });
  await page.getByRole("button", { name: "Add another", exact: true }).click();
  await expect
    .poll(async () => (await saved(page)).worlds.aquarium.decor.length)
    .toBe(5);
  await editor
    .getByRole("button", { name: "Close controls", exact: true })
    .click();
  await expect(editor).toHaveCount(0);
  await page
    .getByRole("button", { name: "Scenery & items", exact: true })
    .click();
  await page.getByRole("button", { name: "Scoop sand", exact: true }).click();
  await page.touchscreen.tap(100, 420);
  await expect
    .poll(async () => (await saved(page)).worlds.aquarium.sand?.length)
    .toBe(48);
  const raised = (await saved(page)).worlds.aquarium.sand!;
  expect(Math.max(...raised)).toBeGreaterThan(0.14);
  await page.getByRole("button", { name: "Remove sand", exact: true }).click();
  await page.touchscreen.tap(100, 420);
  await expect
    .poll(async () => Math.max(...(await saved(page)).worlds.aquarium.sand!))
    .toBeLessThan(Math.max(...raised));
  await page.getByRole("button", { name: "Undo sand", exact: true }).click();
  await expect
    .poll(async () => (await saved(page)).worlds.aquarium.sand)
    .toEqual(raised);
  await page.screenshot({ path: "/tmp/fishtank-workbench-sand.png" });
  await page.getByRole("button", { name: "Finish sand", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Come on in", exact: true }).click();
  expect((await saved(page)).worlds.aquarium.sand).toEqual(raised);
  expect(errors).toEqual([]);
});

test("illustrated help explains matching fish signs and stays inside a narrow phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await begin(page);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "How to play", exact: true }).click();
  const guide = page.locator(".help-guide");
  await expect(
    guide.getByText("Pencil: draw a trail", { exact: true }),
  ).toBeVisible();
  await expect(guide.locator("details[open] li svg")).toHaveCount(6);
  await expect(guide).toContainText("Tap the water to place a bubble");
  await page.screenshot({ path: "/tmp/fishtank-illustrated-help.png" });
  await guide
    .locator("summary")
    .filter({ hasText: "Make it your own" })
    .click();
  await expect(guide.locator("details[open]")).toHaveCount(1);
  await expect(guide.locator("details[open]")).toContainText("sand");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("all six late-game species have in-app illustrated care entries", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await begin(page);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Field guide", exact: true }).click();
  const guide = page.locator(".field-guide");
  await expect(
    guide.getByRole("button", { name: "30 animals", exact: true }),
  ).toBeVisible();
  for (const name of [
    "Pearl gourami",
    "Boesemani rainbowfish",
    "Black ghost knifefish",
    "Regal angelfish",
    "Achilles tang",
    "Zebra shark",
  ]) {
    await guide.getByRole("button", { name, exact: true }).click();
    await expect(
      guide.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
    expect(
      (await guide.locator(".species-scientific").innerText()).length,
    ).toBeGreaterThan(5);
    await expect(guide.locator(".species-knowledge dd")).toHaveCount(2);
    await expect(guide.locator("a")).toHaveCount(0);
    await guide
      .getByRole("button", { name: "All animals", exact: false })
      .click();
  }
  expect(errors).toEqual([]);
});
