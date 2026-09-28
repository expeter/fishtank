import { test, expect } from "@playwright/test";
for (const lang of ["en", "de"])
  for (const landscape of [false, true]) {
    test(`clear tools, separate animals, money help and ambient settings ${lang} ${landscape}`, async ({
      page,
    }) => {
      await page.setViewportSize(
        landscape ? { width: 851, height: 393 } : { width: 320, height: 568 },
      );
      await page.clock.install({ time: new Date("2026-09-28T12:00:00Z") });
      await page.addInitScript(
        (lang) => localStorage.setItem("ft-language", lang),
        lang,
      );
      await page.goto("/");
      await page
        .getByRole("button", {
          name: lang === "en" ? "Create a world" : "Welt erstellen",
        })
        .first()
        .click();
      await page
        .getByRole("button", {
          name: lang === "en" ? "Let’s dive in" : "Tauchen wir ein",
        })
        .click();
      await expect(page.locator(".toolbar > button")).toHaveCount(6);
      for (const button of await page.locator(".toolbar > button").all()) {
        const b = (await button.boundingBox())!;
        expect(Math.round(b.width)).toBeGreaterThanOrEqual(44);
        expect(b.x).toBeGreaterThanOrEqual(0);
        expect(b.x + b.width).toBeLessThanOrEqual(landscape ? 851 : 320);
      }
      await expect(page.locator(".dirt-meter")).toHaveText("0%");
      await page.locator(".coin-pill").click();
      await expect(page.locator("#help-money")).toBeInViewport();
      await expect(page.locator("#help-money")).toContainText(
        lang === "en" ? "5 pocket-money" : "5 Münzen Taschengeld",
      );
      await page
        .getByRole("button", {
          name: lang === "en" ? "Close" : "Schließen",
          exact: true,
        })
        .click();
      await page
        .getByRole("button", {
          name:
            lang === "en" ? "Clean Glass and shore" : "Putzen Scheibe und Ufer",
        })
        .click();
      await expect(page.locator(".clean-tools")).toBeVisible();
      await page
        .getByRole("button", {
          name: lang === "en" ? "Done" : "Fertig",
          exact: true,
        })
        .click();
      await page
        .getByRole("button", {
          name:
            lang === "en"
              ? "Little shop Find something lovely"
              : "Kleiner Laden Entdecke Schönes",
        })
        .click();
      await expect(
        page.locator('.animal-card[data-species="snail"]'),
      ).toHaveCount(0);
      for (const id of ["molly", "harlequin", "cherry_barb"])
        await expect(
          page.locator(`.animal-card[data-species="${id}"]`),
        ).toHaveCount(1);
      await page
        .getByRole("button", {
          name: lang === "en" ? "Little helpers" : "Helfer",
          exact: true,
        })
        .click();
      await expect(
        page.locator('.animal-card[data-species="snail"]'),
      ).toHaveCount(1);
      await expect(
        page.locator('.animal-card[data-species="guppy"]'),
      ).toHaveCount(0);
      await page
        .getByRole("button", {
          name: lang === "en" ? "Close" : "Schließen",
          exact: true,
        })
        .click();
      await page
        .getByRole("button", {
          name: lang === "en" ? "Menu" : "Menü",
          exact: true,
        })
        .click();
      await page
        .getByRole("button", {
          name: lang === "en" ? "Settings" : "Einstellungen",
          exact: true,
        })
        .click();
      const ambient = page.getByRole("switch", {
        name: lang === "en" ? "Ambient sounds" : "Umgebungsgeräusche",
      });
      await expect(ambient).toHaveAttribute("aria-checked", "true");
      await ambient.click();
      await expect(ambient).toHaveAttribute("aria-checked", "false");
      expect(
        await page.evaluate(() => localStorage.getItem("ft-ambience")),
      ).toBe("false");
      await page
        .getByRole("button", {
          name: lang === "en" ? "Close" : "Schließen",
          exact: true,
        })
        .click();
      await page.clock.runFor(100);
      await page.screenshot({
        path: `/tmp/polish-day-${lang}-${landscape}.png`,
      });
      await page.clock.fastForward(165000);
      await page.clock.runFor(100);
      await expect(page.locator(".dirt-meter")).toHaveText("100%");
      await page.screenshot({
        path: `/tmp/polish-night-${lang}-${landscape}.png`,
      });
    });
  }

test("new fish can be purchased and every biology page opens offline", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: /Just imagine/ }).click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();
  await page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
  for (const id of ["molly", "harlequin", "cherry_barb"]) {
    await page
      .locator(`.animal-card[data-species="${id}"] .animal-buy`)
      .click();
  }
  await expect(page.locator(".fish-count")).toContainText("5");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  if (process.env.FT_PRODUCTION) {
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await page.context().setOffline(true);
  }
  await page.getByRole("button", { name: "Field guide", exact: true }).click();
  for (const name of ["Molly", "Harlequin rasbora", "Cherry barb"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await page
      .getByRole("button", { name: "Life & biology", exact: true })
      .click();
    await expect(page.locator(".book-discovery details")).toHaveCount(7);
    await page.getByRole("button", { name: /All animals/ }).click();
  }
});
