import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

for (const legacy of [false, true]) {
  test(`Play here safely transfers a world and reloads immediately (${legacy ? "plain HTTP APIs" : "standard APIs"})`, async ({
    page,
    context,
  }) => {
    if (legacy)
      await context.addInitScript(() => {
        Object.defineProperty(navigator, "locks", { value: undefined });
        Object.defineProperty(crypto, "randomUUID", { value: undefined });
      });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await page.getByRole("button", { name: "Create a world" }).first().click();
    await page.getByPlaceholder("My little paradise").fill("Pearl's home");
    await page.getByRole("button", { name: "Let’s dive in" }).click();

    await expect(page.locator(".tank canvas")).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: "Come on in" }).click();
    await expect(page.locator(".tank canvas")).toBeVisible();
    const second = await context.newPage();
    second.on("pageerror", (e) => errors.push(e.message));
    await second.goto("/");
    await second.getByRole("button", { name: "Come on in" }).click();
    await expect(second.locator(".world-recovery")).toContainText(
      "Pearl's home",
    );
    await expect(second.locator(".world-recovery")).toContainText(
      "this device",
    );
    await second
      .getByRole("button", { name: "Play here", exact: true })
      .click();
    await expect(second.locator(".tank canvas")).toBeVisible();
    await second
      .getByRole("button", { name: "Little shop Find something lovely" })
      .click();
    await second
      .getByRole("button", { name: "Goldfish 20", exact: true })
      .click();
    await second.getByRole("button", { name: "Close", exact: true }).click();
    await expect(second.locator(".friends")).toContainText("3");
    await expect(page.locator(".tank canvas")).toHaveCount(0, {
      timeout: 10000,
    });
    await second.reload();
    await second.getByRole("button", { name: "Come on in" }).click();
    await expect(second.locator(".friends")).toContainText("3");
    await page.getByRole("button", { name: "Come on in" }).click();
    await expect(
      page.getByRole("button", { name: "Play here", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Play here", exact: true }).click();
    await expect(page.locator(".friends")).toContainText("3");
    expect(errors).toEqual([]);
  });
}
