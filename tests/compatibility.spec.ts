import { test, expect } from "@playwright/test";

test("without Web Locks or randomUUID: create, reload, protect, release and delete a world", async ({
  page,
  context,
}) => {
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "locks", { value: undefined });
    Object.defineProperty(crypto, "randomUUID", { value: undefined });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  if (process.env.FT_HTTP_TEST)
    expect(await page.evaluate(() => isSecureContext)).toBe(false);
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  await expect(page.locator(".tank canvas")).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page.locator(".tank canvas")).toBeVisible();

  const second = await context.newPage();
  second.on("pageerror", (error) => errors.push(error.message));
  await second.goto("/");
  await second.getByRole("button", { name: "Come on in" }).click();
  await expect(second.locator(".world-recovery")).toContainText(
    "another tab or app window on this device",
  );
  await expect(
    second.getByRole("button", { name: "Play here", exact: true }),
  ).toBeVisible();
  await second.getByRole("button", { name: "Delete world" }).click();
  await second.getByRole("button", { name: "Yes, please" }).click();
  await expect(second.locator(".toast")).toContainText("other tabs");

  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await expect(page.getByRole("button", { name: "Come on in" })).toBeVisible();
  await second.getByRole("button", { name: "Come on in" }).click();
  await expect(second.locator(".tank canvas")).toBeVisible();
  await second.getByRole("button", { name: "Menu", exact: true }).click();
  await second.getByRole("button", { name: "My worlds", exact: true }).click();
  await second.getByRole("button", { name: "Delete world" }).click();
  await second.getByRole("button", { name: "Yes, please" }).click();
  await expect(
    second.getByRole("button", { name: "Create a world" }),
  ).toHaveCount(3);
  await second.reload();
  await expect(
    second.getByRole("button", { name: "Create a world" }),
  ).toHaveCount(3);
  expect(errors).toEqual([]);
});

test("postcard preview and personal PNG download work without native sharing", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByPlaceholder("My little paradise").fill("Pip's lovely cove");
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  const sourceHeight = await page
    .locator(".tank canvas")
    .evaluate((c: HTMLCanvasElement) => c.height);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Share a postcard", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Your underwater postcard" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Share postcard", exact: true }),
  ).toBeDisabled();
  const image = dialog.locator("img");
  await expect
    .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalHeight))
    .toBeGreaterThan(sourceHeight);
  const before = await image.evaluate((el: HTMLImageElement, h) => {
    const c = document.createElement("canvas");
    c.width = el.naturalWidth;
    c.height = h;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(el, 0, 0);
    return c.toDataURL();
  }, sourceHeight);
  const oldUrl = await image.getAttribute("src");
  await page
    .getByLabel("Postcard message")
    .fill("Dear Grandma,\nMeet my fish!");
  await expect(image).not.toHaveAttribute("src", oldUrl!);
  await expect(
    dialog.getByRole("button", { name: "Save image", exact: true }),
  ).toBeEnabled();
  const after = await image.evaluate((el: HTMLImageElement, h) => {
    const c = document.createElement("canvas");
    c.width = el.naturalWidth;
    c.height = h;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(el, 0, 0);
    return c.toDataURL();
  }, sourceHeight);
  expect(after).toBe(before);
  const download = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "Save image", exact: true }).click();
  expect((await download).suggestedFilename()).toMatch(
    /^pip-s-lovely-cove-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.png$/,
  );
});
