import { test, expect, type Page } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

async function begin(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();
}

async function settings(page: Page) {
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
}

test("phone shop is a small shelf and the uncovered water still receives touches", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await begin(page);
  await page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
  const shop = page.locator(".shop-modal");
  await expect(shop).toBeVisible();
  const bounds = await shop.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.height).toBeLessThanOrEqual(300);
  expect(bounds!.width).toBeLessThanOrEqual(390);
  expect(bounds!.y).toBeGreaterThan(400);
  // A real touch must reach canvas rather than a transparent full-screen overlay.
  const canvas = page.locator(".tank canvas");
  await canvas.evaluate((el) => {
    el.setAttribute("data-touches", "0");
    el.addEventListener("pointerdown", () =>
      el.setAttribute(
        "data-touches",
        String(Number(el.getAttribute("data-touches")) + 1),
      ),
    );
  });
  // Stay clear of the new arrivals at the center of the tank.
  await page.touchscreen.tap(15, 260);
  await expect(canvas).toHaveAttribute("data-touches", "1");
  await expect(shop).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Feed A little nibble" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Goldfish 20", exact: true }).click();
  await expect(page.locator(".coin-pill")).toContainText("79");
  await expect(shop).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "/tmp/fishtank-living-phone-shop.png" });
  expect(errors).toEqual([]);
});

test("Pip offers a personal story and a compact naming card saves the new friend", async ({
  page,
}) => {
  await begin(page);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "How to play", exact: true }).click();
  await page.getByRole("button", { name: "Meet Pip", exact: true }).click();
  await expect(
    page.getByText("A name makes a friend", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".pip-speech")).toContainText("I’m Pip!");
  await page.getByRole("button", { name: /Name a fish/ }).click();
  const card = page.locator(".compact-friend");
  await expect(card).toBeVisible();
  const bounds = await card.boundingBox();
  expect(bounds!.height).toBeLessThanOrEqual(410);
  expect(bounds!.width).toBeLessThanOrEqual(390);
  await page.getByLabel("A name for your friend").fill("Bubbles");
  await expect(card.getByRole("heading", { name: "Bubbles" })).toBeVisible();
  await expect(card).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "/tmp/fishtank-living-phone-name.png" });
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.locator(".pip-companion")).toHaveCount(0);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await expect(page.getByRole("button", { name: /Bubbles/ })).toBeVisible();
});

test("weather clock advances and optional food-chain play starts off and persists only after confirmation", async ({
  page,
}) => {
  await page.clock.install();
  await begin(page);
  const weather = page.getByLabel("World weather and time");
  await expect(weather).toHaveText(/09:0[0-9]/);
  await page.clock.fastForward(61000);
  await expect(weather).toHaveText(/10:0[0-9]/);
  await page
    .getByRole("button", { name: "Woodland coast", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
  await page.getByRole("button", { name: "Clownfish 20", exact: true }).click();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.clock.runFor(1000);
  await page.screenshot({ path: "/tmp/fishtank-living-coast-day.png" });
  await page.clock.fastForward(720000);
  await page.clock.runFor(1000);
  await expect(weather).toHaveText(/22:0[0-9]/);
  await page.screenshot({ path: "/tmp/fishtank-living-coast-night.png" });
  await settings(page);
  const toggle = page.getByRole("switch", { name: "Food-chain play" });
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await toggle.click();
  await expect(
    page.getByText(/Named friends and bought animals stay safe/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Yes, please" }).click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  await settings(page);
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "false");
});
