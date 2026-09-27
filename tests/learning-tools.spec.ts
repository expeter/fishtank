import { test, expect, type Page } from "@playwright/test";
import type { Save } from "../src/game";
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
async function begin(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  const hidePip = page.getByRole("button", { name: "Hide Pip", exact: true });
  if (await hidePip.isVisible()) await hidePip.click();
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
test("a friend's book opens its species inside the game with lifespan, social and care facts", async ({
  page,
  context,
}) => {
  await begin(page);
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: /Guppy/ }).first().click();
  await page
    .getByRole("button", { name: "Discover this species", exact: true })
    .click();
  const guide = page.locator(".field-guide");
  await expect(
    guide.getByRole("heading", { name: "Guppy", exact: true }),
  ).toBeVisible();
  await expect(guide.locator("a")).toHaveCount(0);
  await expect(guide.locator("dt")).toHaveText([
    "Lifespan",
    "Together or alone?",
  ]);
  for (const text of await guide.locator("dd").allTextContents())
    expect(text.length).toBeGreaterThan(12);
  for (const heading of [
    "Water & temperature",
    "Space & home",
    "Everyday care",
  ]) {
    const details = guide
      .locator("details")
      .filter({ has: page.locator("summary", { hasText: heading }) });
    await details.locator("summary").click();
    await expect(details.locator("p")).toBeVisible();
    expect((await details.locator("p").innerText()).length).toBeGreaterThan(30);
  }
  await expect(guide.locator("li").first()).toBeVisible();
  await page.screenshot({ path: "/tmp/fishtank-species-care-book.png" });
  await guide.getByRole("button", { name: "Discover the biology" }).click();
  await expect(
    guide.getByRole("heading", { name: "How do fish breathe?", exact: true }),
  ).toBeVisible();
  await expect(guide.locator("a")).toHaveCount(0);
  expect(context.pages()).toHaveLength(1);
});

test("five distinct foods select one tool and the aquarium pump persists with a clean-glass gesture", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await begin(page);
  const foods = page.getByLabel("Food types", { exact: true });
  const feed = page.getByRole("button", { name: "Feed A little nibble" });
  await feed.click();
  await expect(foods.getByRole("button")).toHaveCount(5);
  const icons = await foods
    .locator("button svg")
    .evaluateAll((els) => els.map((el) => el.innerHTML));
  expect(new Set(icons).size).toBe(5);
  for (const name of [
    "Flakes",
    "Pellets",
    "Worms",
    "Insects",
    "Algae wafers",
  ]) {
    const button = foods.getByRole("button", { name, exact: true });
    await button.click();
    await expect(foods).toHaveCount(0);
    await feed.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(foods.locator("button[aria-pressed=true]")).toHaveCount(1);
  }
  await page.getByRole("button", { name: "Decorate Make it yours" }).click();
  const pump = page.getByRole("switch", { name: /Air pump/ });
  await expect(pump).toHaveAttribute("aria-checked", "true");
  await pump.click();
  await expect(pump).toHaveAttribute("aria-checked", "false");
  await expect
    .poll(async () => (await saved(page)).worlds.aquarium.pumpOn)
    .toBe(false);
  await page.getByRole("button", { name: "Clean window", exact: true }).click();
  await expect(page.locator(".panel-decorate")).toHaveCount(0);
  await expect(page.locator(".clean-tools")).toContainText("Wipe the glass");
  await expect(page.locator(".food-tools")).toHaveCount(0);
  await expect(page.locator(".play-tools")).toHaveCount(0);
  await page.mouse.move(80, 250);
  await page.mouse.down();
  await page.mouse.move(270, 480, { steps: 12 });
  await page.mouse.move(95, 520, { steps: 12 });
  await page.mouse.up();
  await expect(page.locator(".compact-friend")).toHaveCount(0);
  await page.screenshot({ path: "/tmp/fishtank-clean-window.png" });
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(foods).toHaveCount(0);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Come on in", exact: true }).click();
  await page.getByRole("button", { name: "Decorate Make it yours" }).click();
  await expect(pump).toHaveAttribute("aria-checked", "false");
  await pump.click();
  await expect
    .poll(async () => (await saved(page)).worlds.aquarium.pumpOn)
    .toBe(true);
  expect(errors).toEqual([]);
});

test("German phone food tray and aquarium equipment remain readable inside the screen", async ({
  page,
}) => {
  await begin(page);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByLabel("Language", { exact: true }).selectOption("de");
  await page.getByRole("button", { name: "Schließen", exact: true }).click();
  await page
    .getByRole("button", { name: "Füttern Ein kleiner Happen" })
    .click();
  const food = page.getByLabel("Futtersorten", { exact: true });
  await expect(food).toBeVisible();
  for (const button of await food.getByRole("button").all()) {
    const box = (await button.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
  }
  await page.screenshot({ path: "/tmp/fishtank-german-food-types.png" });
  await page
    .getByRole("button", { name: "Gestalten Ganz dein Stil", exact: true })
    .click();
  await expect(page.getByRole("switch", { name: /Luftpumpe/ })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Scheibe putzen", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "/tmp/fishtank-german-pump-controls.png" });
});
