import { test } from "@playwright/test";
import { assertButtonLabelsFit } from "./button-layout";
for (const lang of ["en", "de"])
  for (const [width, height] of [
    [320, 568],
    [393, 851],
    [851, 393],
  ]) {
    test(`button labels fit in ${lang} at ${width}x${height}`, async ({
      page,
    }) => {
      const t = (en: string, de: string) => (lang === "de" ? de : en);
      await page.setViewportSize({ width, height });
      await page.addInitScript(
        (lang) => localStorage.setItem("ft-language", lang),
        lang,
      );
      await page.goto("/");
      await assertButtonLabelsFit(page, "start");
      await page
        .getByRole("button", { name: t("Create a world", "Welt erstellen") })
        .first()
        .click();
      await assertButtonLabelsFit(page, "new world");
      await page
        .getByRole("button", { name: t("Let’s dive in", "Tauchen wir ein") })
        .click();
      const close = () =>
        page
          .getByRole("button", { name: t("Close", "Schließen"), exact: true })
          .click();
      const menu = () =>
        page
          .getByRole("button", { name: t("Menu", "Menü"), exact: true })
          .click();
      await assertButtonLabelsFit(page, "tank");
      await page
        .getByRole("button", {
          name: t("Feed A little nibble", "Füttern Ein kleiner Happen"),
        })
        .click();
      await assertButtonLabelsFit(page, "food");
      await menu();
      await assertButtonLabelsFit(page, "menu");
      await page
        .getByRole("button", {
          name: t("Settings", "Einstellungen"),
          exact: true,
        })
        .click();
      await assertButtonLabelsFit(page, "settings");
      await close();
      await page
        .getByRole("button", {
          name: t(
            "Little shop Find something lovely",
            "Kleiner Laden Entdecke Schönes",
          ),
        })
        .click();
      await assertButtonLabelsFit(page, "shop animals");
      await page
        .getByRole("button", {
          name: t("Lovely things", "Schöne Dinge"),
          exact: true,
        })
        .click();
      await assertButtonLabelsFit(page, "shop decorations");
      await close();
      await page
        .getByRole("button", {
          name: t("Decorate Make it yours", "Gestalten Ganz dein Stil"),
        })
        .click();
      await assertButtonLabelsFit(page, "decorate");
      await close();
      await page
        .getByRole("button", {
          name: t("Meet all animals", "Alle Tiere ansehen"),
          exact: true,
        })
        .click();
      await assertButtonLabelsFit(page, "residents");
      await page.locator(".panel-residents .menu-list button").first().click();
      await assertButtonLabelsFit(page, "fish actions");
      await page.screenshot({ path: `/tmp/button-fish-${lang}-${width}.png` });

      await page
        .getByRole("button", {
          name: t("Close", "Schließen"),
          exact: true,
        })
        .click();
      await menu();
      await page
        .getByRole("button", {
          name: t("Field guide", "Entdeckerbuch"),
          exact: true,
        })
        .click();
      await assertButtonLabelsFit(page, "book index");
      await page.getByRole("button", { name: "Guppy", exact: true }).click();
      await assertButtonLabelsFit(page, "book chapters");
    });
  }
