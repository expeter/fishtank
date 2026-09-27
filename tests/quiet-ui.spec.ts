import { test, expect } from "@playwright/test";

test.use({ hasTouch: true });
for (const [width, height] of [
  [320, 568],
  [393, 851],
  [851, 393],
]) {
  test(`quiet tank and collapsible bottom choices at ${width}x${height}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height });
    await page.addInitScript(() => localStorage.setItem("ft-language", "de"));
    await page.goto("/");
    await page.getByRole("button", { name: "Welt erstellen" }).first().click();
    await page.getByRole("button", { name: "Tauchen wir ein" }).click();
    await expect(page.locator(".tank canvas")).toBeVisible();
    await expect(
      page.locator(".tutorial,.pip-companion,.food-tools,.play-tools"),
    ).toHaveCount(0);
    const dock = page.locator(".toolbar");
    const feed = page.getByRole("button", {
      name: "Füttern Ein kleiner Happen",
    });
    await expect(feed).toHaveAttribute("aria-pressed", "true");
    await expect(feed).toHaveAttribute("aria-expanded", "false");
    await page.screenshot({ path: `/tmp/fishtank-quiet-${width}.png` });
    await feed.click();
    const foods = page.getByLabel("Futtersorten", { exact: true });
    await expect(foods).toBeVisible();
    const d = (await dock.boundingBox())!,
      f = (await foods.boundingBox())!;
    // Wide trays stay on screen even when the narrow-phone dock shifts beside the world toggle.
    const tank = (await page.locator(".tank").boundingBox())!;
    expect(tank.height).toBeGreaterThanOrEqual(height - 80);
    const header = (await page.locator(".header").boundingBox())!;
    expect(header.y).toBeLessThan(20);
    expect(header.x + header.width).toBeGreaterThan(width - 20);
    await expect(
      page.getByRole("button", { name: "Ton umschalten (M)", exact: true }),
    ).toBeVisible();
    if (width >= 600) {
      for (const selector of [".habitat-tabs", ".world-heading"]) {
        const b = (await page.locator(selector).boundingBox())!;
        expect(
          Math.abs(b.y + b.height / 2 - (d.y + d.height / 2)),
        ).toBeLessThan(5);
        expect(b.x + b.width <= d.x || b.x >= d.x + d.width).toBe(true);
      }
    }
    for (const button of await dock.getByRole("button").all()) {
      const b = (await button.boundingBox())!;
      expect(b.width).toBeGreaterThanOrEqual(44);
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(width);
    }
    expect(f.y + f.height).toBeLessThanOrEqual(d.y);
    expect(f.x).toBeGreaterThanOrEqual(0);
    expect(f.x + f.width).toBeLessThanOrEqual(width);
    for (const button of await foods.getByRole("button").all()) {
      const b = (await button.boundingBox())!;
      expect(b.width).toBeGreaterThanOrEqual(44);
      expect(b.height).toBeGreaterThanOrEqual(44);
    }
    await page.screenshot({ path: `/tmp/fishtank-food-dock-${width}.png` });
    await foods.getByRole("button", { name: "Würmchen", exact: true }).click();
    await expect(foods).toHaveCount(0);
    await expect(feed).toHaveAttribute("aria-pressed", "true");
    // Reopening keeps the food choice; tapping the same tool closes it again.
    await feed.click();
    await expect(
      foods.getByRole("button", { name: "Würmchen", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await feed.click();
    await expect(foods).toHaveCount(0);
    await page.getByRole("button", { name: "Spielen Freunde finden" }).click();
    await expect(page.locator(".play-tools")).toBeVisible();
    await feed.click();
    await expect(page.locator(".play-tools")).toHaveCount(0);
    await expect(foods).toBeVisible();
    await page
      .getByRole("button", { name: "Kleiner Laden Entdecke Schönes" })
      .click();
    await expect(foods).toHaveCount(0);
    await expect(page.locator(".panel-shop")).toBeVisible();
    await page.getByRole("button", { name: "Schließen", exact: true }).click();
    await expect(foods).toHaveCount(0);
    await feed.click();
    await expect(foods).toBeVisible();
    await expect(page.locator(".panel-shop")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}
