import { test, expect } from "@playwright/test";
test.use({ viewport: { width: 390, height: 844 } });
test("audio preferences, mute shortcut and background lifecycle work without muting typed names", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Base = AudioContext;
    const contexts: AudioContext[] = [];
    (window as any).__audioContexts = contexts;
    window.AudioContext = class extends Base {
      constructor(options?: AudioContextOptions) {
        super(options);
        contexts.push(this);
      }
    };
  });
  await page.goto("/");
  const toggle = page.locator(".header button[title=M]");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() => page.evaluate(() => (window as any).__audioContexts[0]?.state))
    .toBe("running");
  await page.keyboard.press("m");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect
    .poll(() => page.evaluate(() => (window as any).__audioContexts[0]?.state))
    .toBe("suspended");
  await page.evaluate(() =>
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "m", repeat: true }),
    ),
  );
  await page.keyboard.press("Control+m");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("m");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByPlaceholder("My little paradise").pressSequentially("Mimi");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("switch", { name: "Gentle music" }).click();
  await page.getByRole("switch", { name: "Little sound effects" }).click();
  await expect(
    page.getByRole("switch", { name: "Gentle music" }),
  ).toHaveAttribute("aria-checked", "false");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => page.evaluate(() => (window as any).__audioContexts[0]?.state))
    .toBe("suspended");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() => page.evaluate(() => (window as any).__audioContexts[0]?.state))
    .toBe("running");
  await page.reload();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await expect(
    page.getByRole("switch", { name: "Gentle music" }),
  ).toHaveAttribute("aria-checked", "false");
  await expect(
    page.getByRole("switch", { name: "Little sound effects" }),
  ).toHaveAttribute("aria-checked", "false");
});
test("prepared native sharing has a fresh gesture, handles cancellation, and offers download after failure", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).__shareOutcome = "cancel";
    (window as any).__shares = [];
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: () => true,
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (data: ShareData) => {
        const active = navigator.userActivation.isActive;
        const file = data.files![0];
        (window as any).__shares.push({
          active,
          name: file.name,
          type: file.type,
          title: data.title,
          text: data.text,
          bytes: Array.from(new Uint8Array(await file.arrayBuffer())).slice(
            0,
            8,
          ),
        });
        const outcome = (window as any).__shareOutcome;
        if (outcome === "cancel")
          throw new DOMException("Cancelled", "AbortError");
        if (outcome === "fail")
          throw new DOMException("Unavailable", "NotAllowedError");
      },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Share a postcard", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Your underwater postcard" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("img")).toBeVisible();
  const initialUrl = await dialog.locator("img").getAttribute("src");
  await page
    .getByLabel("Postcard message")
    .fill("Hello Grandma!\nLove from our cove.");
  await expect(dialog.locator("img")).not.toHaveAttribute("src", initialUrl!);
  await expect(
    page.getByRole("button", { name: "Save image", exact: true }),
  ).toBeEnabled();
  const saveBounds = (await dialog
    .getByRole("button", { name: "Save image", exact: true })
    .boundingBox())!;
  expect(saveBounds.y + saveBounds.height).toBeLessThanOrEqual(844);
  const closeBounds = (await dialog
    .getByRole("button", { name: "Close", exact: true })
    .boundingBox())!;
  expect(closeBounds.y).toBeGreaterThanOrEqual(0);
  await page.screenshot({ path: "/tmp/fishtank-personal-postcard.png" });
  await page
    .getByRole("button", { name: "Share postcard", exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__shares.length))
    .toBe(1);
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
  await page.evaluate(() => {
    (window as any).__shareOutcome = "fail";
  });
  await page
    .getByRole("button", { name: "Share postcard", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "save the image instead",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save image", exact: true }).click();
  expect((await download).suggestedFilename()).toMatch(
    /-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.png$/,
  );
  await page.evaluate(() => {
    (window as any).__shareOutcome = "success";
  });
  await page
    .getByRole("button", { name: "Share postcard", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  const calls = await page.evaluate(() => (window as any).__shares);
  expect(calls).toHaveLength(3);
  for (const call of calls) {
    expect(call.active).toBe(true);
    expect(call.type).toBe("image/png");
    expect(call.name).toMatch(/-\d{4}-\d{2}-\d{2}T.*Z\.png$/);
    expect(call.title).toBeTruthy();
    expect(call.text).toBe("Hello Grandma!\nLove from our cove.");
    expect(call.bytes).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  }
});
