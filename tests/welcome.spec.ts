import { test, expect } from "@playwright/test";

test("phone welcome is readable in German at 320 and 390 pixels", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("ft-language", "de"));
  await page.goto("/");
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(
      page.getByRole("button", {
        name: "Auf diesem Handy installieren",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Welt erstellen" }),
    ).toHaveCount(3);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const contrasts = await page.evaluate(() => {
      const rgb = (value: string) =>
        (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
      const luminance = (value: string) =>
        rgb(value).reduce((sum, c, i) => {
          const normalized = c / 255;
          return (
            sum +
            (normalized <= 0.04045
              ? normalized / 12.92
              : ((normalized + 0.055) / 1.055) ** 2.4) *
              [0.2126, 0.7152, 0.0722][i]
          );
        }, 0);
      const contrast = (a: string, b: string) => {
        const x = luminance(a),
          y = luminance(b);
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
      };
      return Array.from(
        document.querySelectorAll(
          ".save-info h2,.save-info p,.save-info>.outline,.welcome-install strong,.welcome-install p,.welcome-install-action",
        ),
      ).map((el) => {
        const own = getComputedStyle(el);
        let parent: Element | null = el;
        let bg = own.backgroundColor;
        while (parent && (bg === "rgba(0, 0, 0, 0)" || bg === "transparent")) {
          parent = parent.parentElement;
          if (parent) bg = getComputedStyle(parent).backgroundColor;
        }
        return { text: el.textContent, ratio: contrast(own.color, bg) };
      });
    });
    expect(contrasts.length).toBeGreaterThan(9);
    for (const item of contrasts)
      expect(item.ratio, item.text ?? "text").toBeGreaterThanOrEqual(4.5);
    await page.screenshot({
      path: `/tmp/fishtank-welcome-${width}.png`,
      fullPage: true,
    });
  }
});

test("welcome offers installation without opening an OS prompt until a tap", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const action = page.getByRole("button", {
    name: "Install on this phone",
    exact: true,
  });
  await expect(action).toBeVisible();
  // No native prompt available: the same entry point opens browser instructions.
  await action.click();
  await expect(page.locator(".callout")).toContainText("Safari");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.evaluate(() => {
    (window as any).__welcomePrompts = 0;
    const event = new Event("beforeinstallprompt", { cancelable: true });
    Object.assign(event, {
      prompt: async () => {
        (window as any).__welcomePrompts++;
        return { outcome: "dismissed" };
      },
    });
    window.dispatchEvent(event);
  });
  expect(await page.evaluate(() => (window as any).__welcomePrompts)).toBe(0);
  await action.click();
  expect(await page.evaluate(() => (window as any).__welcomePrompts)).toBe(1);
  await expect(
    page.getByRole("button", { name: "Create a world" }).first(),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Hide installation hint", exact: true })
    .click();
  await expect(action).toHaveCount(0);
  await page.reload();
  await expect(action).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event("appinstalled")));
  await expect(action).toHaveCount(0);
});

test("an already installed app starts a world without another install invitation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "standalone", { value: true }),
  );
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Create a world" }),
  ).toHaveCount(3);
  await expect(page.locator(".welcome-install")).toHaveCount(0);
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();
  await expect(page.locator(".tank canvas")).toBeVisible();
  await expect(page.locator(".welcome-install")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
