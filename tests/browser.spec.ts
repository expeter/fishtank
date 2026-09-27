import { test, expect } from "@playwright/test";
import { VERSION } from "../src/game";
test("create, care, shop, design, persist and switch language without randomUUID", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    Object.defineProperty(globalThis.crypto, "randomUUID", {
      value: undefined,
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page
    .getByPlaceholder("My little paradise")
    .pressSequentially("Pebble Bay");
  await page.getByRole("button", { name: "Let’s dive in" }).click();
  await expect(page.locator(".tank canvas")).toBeVisible();

  await page.getByRole("button", { name: "Feed A little nibble" }).click();
  await page.locator("canvas").click({ position: { x: 250, y: 150 } });
  await page
    .getByRole("button", { name: "Explore Drag the world", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
  await page.getByRole("button", { name: "Goldfish 20" }).click();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.locator(".friends")).toContainText("3");
  await page.getByRole("button", { name: "Decorate Make it yours" }).click();
  await page.getByRole("button", { name: "Twilight", exact: true }).click();
  await page.getByRole("button", { name: "Leafy fern" }).click();
  await expect(page.locator(".decor-controls")).toBeVisible();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await expect(page.getByRole("button", { name: "Come on in" })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page.locator(".friends")).toContainText("3");
  await page
    .getByRole("button", { name: "Woodland coast", exact: true })
    .click();
  await expect(page.getByText("A new beginning")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("canvas")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "/tmp/fishtank-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByLabel("Language", { exact: true }).selectOption("de");
  await expect(
    page.getByRole("heading", { name: "So fühlst du dich wohl." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("creative save stays separate and other tabs cannot edit", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).nth(1).click();
  await page.getByRole("button", { name: "Just imagine" }).click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  await page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
  await page.getByRole("button", { name: "Little frog Add friend" }).click();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.waitForTimeout(1600);
  const second = await context.newPage();
  await second.goto("/");
  await second.getByRole("button", { name: "Come on in" }).click();
  await expect(second.locator(".world-recovery")).toContainText(
    "another tab or app window on this device",
  );
  await expect(
    second.getByRole("button", { name: "Play here", exact: true }),
  ).toBeVisible();
  await expect(second.locator(".tank canvas")).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "/tmp/fishtank-desktop.png", fullPage: true });
});
test("three independent worlds, animal names, sale confirmation and photo export", async ({
  page,
}) => {
  await page.goto("/");
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Create a world" }).first().click();
    await page
      .getByPlaceholder("My little paradise")
      .pressSequentially(`World ${i + 1}`);
    await page.getByRole("button", { name: "Let’s dive in" }).click();

    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.getByRole("button", { name: "My worlds", exact: true }).click();
    await expect(page.getByRole("button", { name: "Come on in" })).toHaveCount(
      i + 1,
    );
  }
  await page.getByRole("button", { name: "Come on in" }).first().click();
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: /Guppy/ }).first().click();
  await page.getByPlaceholder("Give me a name…").pressSequentially("Bubbles");
  await expect(page.getByRole("heading", { name: "Bubbles" })).toBeVisible();
  await page.getByRole("button", { name: /Sell for/ }).click();
  await page.getByRole("button", { name: "Keep things as they are" }).click();
  await page.getByRole("button", { name: /Sell for/ }).click();
  await page.getByRole("button", { name: "Yes, please" }).click();
  await expect(page.locator(".friends")).toContainText("1");
  await expect(page.locator(".coin-pill")).toContainText("110");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Share a postcard", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Your underwater postcard" }),
  ).toBeVisible();
  await page.getByLabel("Postcard message").fill("Greetings from World 1!");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save image", exact: true }).click();
  expect((await download).suggestedFilename()).toMatch(
    /^world-1-\d{4}-.*Z\.png$/,
  );
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await expect(page.getByRole("button", { name: "Come on in" })).toHaveCount(3);
  await page.getByRole("button", { name: "Come on in" }).nth(1).click();
  await expect(page.locator(".friends")).toContainText("2");
  await expect(page.locator(".coin-pill")).toContainText("100");
});

test("storage failures are visible and do not offer a false saved world", async ({
  page,
}) => {
  await page.addInitScript(() => {
    indexedDB.open = () => {
      throw new DOMException("Storage blocked", "SecurityError");
    };
  });
  await page.goto("/");
  await expect(page.locator(".error-banner")).toContainText(
    "Browser storage is unavailable",
  );
  for (const button of await page
    .getByRole("button", { name: "Create a world" })
    .all())
    await expect(button).toBeDisabled();
});
test("a newer version is offered without interrupting play", async ({
  page,
}) => {
  await page.route("**/version.json", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        version: `${Number(VERSION.split(".")[0]) + 1}.0.0`,
      }),
    }),
  );
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Update ready" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  await expect(page.locator(".friends")).toContainText("2");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Save and update", exact: true })
    .click();
  // An explicit update now reloads the network-first shell even when the worker
  // has already activated. The saved world remains available after that reload.
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page.locator(".tank canvas")).toBeVisible();
  await expect(page.locator(".friends")).toContainText("2");
});
