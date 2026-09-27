import { test, expect, type Page } from "@playwright/test";
const openShop = (page: Page) =>
  page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
const close = (page: Page) =>
  page.getByRole("button", { name: "Close", exact: true }).click();
async function buy(page: Page, name: string, count: number) {
  for (let i = 0; i < count; i++)
    await page.getByRole("button", { name, exact: true }).click();
}
async function sellAdults(
  page: Page,
  species: string,
  count: number,
  price: number,
) {
  for (let i = 0; i < count; i++) {
    await page.getByRole("button", { name: "Meet all animals" }).click();
    await page
      .getByRole("button", { name: `${species} 100%`, exact: true })
      .first()
      .click();
    await page
      .getByRole("button", { name: `Sell for ${price} coins`, exact: true })
      .click();
    await page.getByRole("button", { name: "Yes, please" }).click();
  }
}
test("ordinary purchases, growth and sales unlock starter tiers and reveal premium goals in both habitats", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.clock.install({ time: new Date("2026-09-26T12:00:00Z") });
  await page.addInitScript(() => {
    Math.random = () => 0.99;
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  await openShop(page);
  await expect(
    page.getByRole("button", { name: /^Neon tetra/ }),
  ).toBeDisabled();
  await expect(page.locator(".discovery-progress")).toContainText(
    "150 total coins",
  );
  await buy(page, "Guppy 20", 5);
  await close(page);
  await page.clock.fastForward(600000);
  await sellAdults(page, "Guppy", 6, 40);
  await expect(page.locator(".coin-pill")).toContainText("290");
  await openShop(page);
  await expect(page.locator(".discovery-progress")).toContainText(
    "600 total coins",
  );
  await expect(page.getByRole("button", { name: /^Angelfish/ })).toBeDisabled();
  await buy(page, "Neon tetra 60", 4);
  await close(page);
  await page.clock.fastForward(1800000);
  await sellAdults(page, "Neon tetra", 4, 120);
  await expect(page.locator(".coin-pill")).toContainText("680");
  await openShop(page);
  await expect(page.locator(".discovery-progress")).toContainText(
    "1800 total coins",
  );
  await expect(
    page.getByRole("button", { name: /^Little frog/ }),
  ).toBeDisabled();
  await buy(page, "Angelfish 180", 2);
  await close(page);
  await page.clock.fastForward(7200000);
  await sellAdults(page, "Angelfish", 2, 360);
  await openShop(page);
  await expect(
    page.getByRole("button", { name: /^Little frog/ }),
  ).toBeDisabled();
  await buy(page, "Angelfish 180", 1);
  await close(page);
  await page.clock.fastForward(7200000);
  await sellAdults(page, "Angelfish", 1, 360);
  await expect(page.locator(".coin-pill")).toContainText("2420");
  await openShop(page);
  await expect(page.locator(".discovery-progress")).toContainText(
    "6000 total coins",
  );
  await buy(page, "Little frog 500", 1);
  await close(page);
  await page
    .getByRole("button", { name: "Woodland coast", exact: true })
    .click();
  await openShop(page);
  await expect(page.locator(".discovery-progress")).toContainText(
    "6000 total coins",
  );
  await buy(page, "Seahorse 500", 1);
  await close(page);
  await expect(page.locator(".coin-pill")).toContainText("1420");
  await expect(page.locator(".friends")).toContainText("1");
  await page.getByRole("button", { name: "Aquarium", exact: true }).click();
  await expect(page.locator(".friends")).toContainText("2");
});
