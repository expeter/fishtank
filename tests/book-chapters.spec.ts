import { test, expect } from "@playwright/test";
for (const lang of ["en", "de"] as const)
  test(`species life chapters are readable in ${lang} on a 320px phone`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
        locale: lang === "de" ? "de-DE" : "en-US",
        viewport: { width: 320, height: 740 },
      }),
      page = await context.newPage();
    const t = (en: string, de: string) => (lang === "de" ? de : en);
    try {
      await page.goto("/");
      await page
        .getByRole("button", { name: t("Create a world", "Welt erstellen") })
        .first()
        .click();
      await page
        .getByRole("button", { name: t("Let’s dive in", "Tauchen wir ein") })
        .click();
      if (lang === "en" && process.env.FT_PRODUCTION) {
        await page.evaluate(() => navigator.serviceWorker.ready);
        await expect
          .poll(() =>
            page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
          )
          .toBe(true);
        // The encyclopedia has never been opened in this context. Its lazy chunk
        // must come from the installed app's precache with the network disabled.
        await context.setOffline(true);
      }
      await page
        .getByRole("button", { name: t("Menu", "Menü"), exact: true })
        .click();
      await page
        .getByRole("button", {
          name: t("Field guide", "Entdeckerbuch"),
          exact: true,
        })
        .click();
      const guide = page.locator(".field-guide");
      for (const species of ["Guppy", t("Zebra shark", "Zebrahai")]) {
        await guide.getByRole("button", { name: species, exact: true }).click();
        await guide
          .getByRole("button", {
            name: t("Life & biology", "Leben & Biologie"),
            exact: true,
          })
          .click();
        const chapterButtons = guide.locator(".book-chapters button");
        // State colors switch together: fading only the background creates a
        // moment of dark text on dark teal and pale text on cream.
        for (const button of await chapterButtons.all())
          await expect(button).toHaveCSS("transition-duration", "0s");
        await expect(
          guide.locator('.book-chapters button[aria-pressed="true"]'),
        ).toHaveCSS("background-color", "rgb(22, 93, 87)");
        await expect(
          guide.locator('.book-chapters button[aria-pressed="true"]'),
        ).toHaveCSS("color", "rgb(255, 249, 223)");
        await expect(
          guide.locator('.book-chapters button[aria-pressed="false"]'),
        ).toHaveCSS("background-color", "rgb(243, 231, 191)");
        await expect(
          guide.locator('.book-chapters button[aria-pressed="false"]'),
        ).toHaveCSS("color", "rgb(35, 60, 67)");
        for (const number of await guide
          .locator(".book-chapters button > span")
          .all()) {
          await expect(number).toHaveCSS("flex-shrink", "0");
          await expect(number).toHaveCSS("white-space", "nowrap");
        }
        await page.waitForTimeout(400);
        await page.screenshot({
          path: `/tmp/fishtank-book-chapters-${lang}-${species.replaceAll(" ", "-")}.png`,
        });
        const chapters = guide.locator(".book-discovery details");
        await expect(chapters).toHaveCount(7);
        for (let i = 0; i < 7; i++) {
          const chapter = chapters.nth(i);
          if (
            !(await chapter.evaluate((el) => (el as HTMLDetailsElement).open))
          )
            await chapter.locator("summary").click();
          await expect(chapter.locator("p")).toBeVisible();
          expect(
            (await chapter.locator("p").innerText()).length,
          ).toBeGreaterThan(55);
          expect(
            await chapter.evaluate(
              (el) => el.scrollWidth <= el.clientWidth + 1,
            ),
          ).toBe(true);
          if (i === 0 || i === 6)
            await page.screenshot({
              path: `/tmp/fishtank-book-${lang}-${species.replaceAll(" ", "-")}-${i}.png`,
            });
          await chapter.locator("summary").click();
        }
        await expect(guide.locator("a")).toHaveCount(0);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await guide
          .getByRole("button", {
            name: t("All animals", "Alle Tiere"),
            exact: false,
          })
          .click();
      }
    } finally {
      await context.close();
    }
  });
