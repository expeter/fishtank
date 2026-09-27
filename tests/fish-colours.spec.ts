import { test, expect } from "@playwright/test";
for (const lang of ["en", "de"])
  for (const landscape of [false, true]) {
    test(`${lang} fish colour selection persists in ${landscape ? "landscape" : "portrait"}`, async ({
      page,
    }) => {
      await page.setViewportSize(
        landscape ? { width: 851, height: 393 } : { width: 320, height: 568 },
      );
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
          name: lang === "en" ? /Just imagine/ : /Einfach gestalten/,
        })
        .click();
      await page
        .getByRole("button", {
          name: lang === "en" ? "Let’s dive in" : "Tauchen wir ein",
        })
        .click();
      await page
        .getByRole("button", {
          name:
            lang === "en"
              ? "Little shop Find something lovely"
              : /Kleiner Laden/,
        })
        .click();
      const card = page.locator('.animal-card[data-species="guppy"]');
      const blue = card.getByRole("button", {
        name: lang === "en" ? "Blue shimmer" : "Blauer Schimmer",
        exact: true,
      });
      const before = await card
        .locator("canvas")
        .evaluate((c: HTMLCanvasElement) => c.toDataURL());
      await blue.scrollIntoViewIfNeeded();
      const colourBounds = (await blue.boundingBox())!;
      const catalogBounds = (await page.locator(".catalog").boundingBox())!;
      expect(colourBounds.y + colourBounds.height).toBeLessThanOrEqual(
        catalogBounds.y + catalogBounds.height + 1,
      );
      await blue.click();
      await expect(blue).toHaveAttribute("aria-pressed", "true");
      await expect
        .poll(() =>
          card
            .locator("canvas")
            .evaluate((c: HTMLCanvasElement) => c.toDataURL()),
        )
        .not.toBe(before);
      const box = (await blue.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      await card.locator(".animal-buy").click();
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              new Promise((resolve) => {
                const open = indexedDB.open("little-fishtank", 1);
                open.onsuccess = () => {
                  const db = open.result;
                  const tx = db.transaction("saves");
                  const get = tx.objectStore("saves").get(0);
                  get.onsuccess = () =>
                    resolve(get.result?.worlds.aquarium.fish.at(-1)?.variant);
                  tx.oncomplete = () => db.close();
                };
              }),
          ),
        )
        .toBe("blue");
      await page.screenshot({
        path: `/tmp/fish-colours-${lang}-${landscape}.png`,
      });
      await page.reload();
      await page
        .getByRole("button", {
          name: lang === "en" ? "Come on in" : "Komm herein",
        })
        .click();
      await expect(page.locator(".tank canvas")).toBeVisible();
    });
  }
