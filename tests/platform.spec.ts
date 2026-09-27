import { test, expect } from "@playwright/test";
test("fullscreen can be entered and exited, with helpful unsupported and failure states", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Fullscreen", exact: true }).click();

  await expect
    .poll(() => page.evaluate(() => Boolean(document.fullscreenElement)))
    .toBe(true);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Exit fullscreen" }).click();
  await expect
    .poll(() => page.evaluate(() => Boolean(document.fullscreenElement)))
    .toBe(false);
  await page.evaluate(() => {
    Object.defineProperty(document.documentElement, "requestFullscreen", {
      configurable: true,
      value: undefined,
    });
  });
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Fullscreen", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "Fullscreen is not available",
  );
  await page.evaluate(() => {
    Object.defineProperty(document.documentElement, "requestFullscreen", {
      configurable: true,
      value: () =>
        Promise.reject(new DOMException("Denied", "NotAllowedError")),
    });
  });
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Fullscreen", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "Could not change fullscreen",
  );
  await expect(page.locator(".tank canvas")).toBeVisible();
});
test("installation waits for a tap and handles dismissal, rejection and installed state", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.evaluate(() => {
    (window as any).__prompts = 0;
    const event = new Event("beforeinstallprompt", { cancelable: true });
    Object.assign(event, {
      prompt: async () => {
        (window as any).__prompts++;
        return { outcome: "dismissed" };
      },
    });
    window.dispatchEvent(event);
    (window as any).__prevented = event.defaultPrevented;
  });
  expect(await page.evaluate(() => (window as any).__prompts)).toBe(0);
  expect(await page.evaluate(() => (window as any).__prevented)).toBe(true);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Install app", exact: true }).click();
  await page
    .getByRole("button", { name: "Install Little Fishtank", exact: true })
    .click();
  expect(await page.evaluate(() => (window as any).__prompts)).toBe(1);
  await expect(page.locator(".callout")).toContainText("Add to Home Screen");
  await page.evaluate(() => {
    const event = new Event("beforeinstallprompt", { cancelable: true });
    Object.assign(event, {
      prompt: () =>
        Promise.reject(new DOMException("Denied", "NotAllowedError")),
    });
    window.dispatchEvent(event);
  });
  await page
    .getByRole("button", { name: "Install Little Fishtank", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Use your browser menu");
  await expect(page.locator(".callout")).toContainText("Safari");
  await page.evaluate(() => window.dispatchEvent(new Event("appinstalled")));
  await expect(page.locator(".callout")).toContainText("already installed");
  await expect(
    page.getByRole("button", { name: "Install Little Fishtank", exact: true }),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});
