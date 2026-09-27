import { test, expect } from "@playwright/test";
import { animals, decorations, canLiveIn, type Habitat } from "../src/game";
test("all animal and decoration catalog artwork renders in both habitats", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1400, height: 1400 });
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Just imagine" }).click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  for (const habitat of ["aquarium", "sea"] as Habitat[]) {
    if (habitat === "sea")
      await page
        .getByRole("button", { name: "Woodland coast", exact: true })
        .click();
    await page
      .getByRole("button", { name: "Little shop Find something lovely" })
      .click();
    await page
      .getByRole("button", { name: "Little friends", exact: true })
      .click();
    await expect(page.locator(".catalog>button")).toHaveCount(
      animals.filter((a) => canLiveIn(a.id, habitat)).length,
    );
    await page
      .locator(".shop-modal")
      .screenshot({ path: `/tmp/fishtank-${habitat}-animals.png` });
    await page
      .getByRole("button", { name: "Lovely things", exact: true })
      .click();
    await expect(page.locator(".catalog>button")).toHaveCount(
      decorations.filter((d) => d.habitat === habitat).length,
    );
    await page
      .locator(".shop-modal")
      .screenshot({ path: `/tmp/fishtank-${habitat}-decor.png` });
    await page.getByRole("button", { name: "Close", exact: true }).click();
  }
  expect(errors).toEqual([]);
});
test("German defaults and long names fit phone portrait and landscape layouts", async ({
  browser,
}) => {
  const context = await browser.newContext({
    locale: "de-DE",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await page.getByRole("button", { name: "Welt erstellen" }).first().click();
    await page
      .getByPlaceholder("Mein kleines Paradies")
      .pressSequentially("Sonnenuntergangsunterwasserparadies");
    await page.getByRole("button", { name: "Einfach gestalten" }).click();
    await page.getByRole("button", { name: "Tauchen wir ein" }).click();

    for (const [width, height] of [
      [390, 844],
      [844, 390],
    ]) {
      await page.setViewportSize({ width, height });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `/tmp/fishtank-german-${width}.png`,
        fullPage: true,
      });
      await page.getByRole("button", { name: /^Kleiner Laden/ }).click();
      await page
        .getByRole("button", { name: "Kleine Freunde", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Kleiner Frosch Hinzufügen" })
        .click();
      await page
        .getByRole("button", { name: "Schließen", exact: true })
        .click();
    }
    await page.getByRole("button", { name: "Alle Tiere ansehen" }).click();
    await page
      .getByRole("button", { name: /Kleiner Frosch/ })
      .first()
      .click();
    await page
      .getByPlaceholder("Gib mir einen Namen…")
      .pressSequentially("Glitzerflossenprinzessin");
    await page.screenshot({
      path: "/tmp/fishtank-german-stats.png",
      fullPage: true,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  } finally {
    await context.close();
  }
});

test("every background and ground style renders and the selected scenery persists", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Just imagine" }).click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  for (const habitat of ["aquarium", "sea"] as Habitat[]) {
    if (habitat === "sea") {
      await page
        .getByRole("button", { name: "Woodland coast", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Little shop Find something lovely" })
        .click();
      await page.getByRole("button", { name: "Clownfish Add friend" }).click();
      await page.getByRole("button", { name: "Close", exact: true }).click();
    }
    const samples: string[] = [];
    for (let i = 0; i < 3; i++) {
      await page
        .getByRole("button", { name: "Decorate Make it yours" })
        .click();
      await page
        .getByRole("button", {
          name: ["Daydream", "Blue lagoon", "Twilight"][i],
          exact: true,
        })
        .click();
      await page
        .getByRole("button", {
          name: ["Soft sand", "Riverbed", "Rose pebbles"][i],
          exact: true,
        })
        .click();
      await page.getByRole("button", { name: "Close", exact: true }).click();
      await page
        .locator(".tank canvas")
        .screenshot({ path: `/tmp/fishtank-${habitat}-scenery-${i}.png` });
      samples.push(
        await page
          .locator(".tank canvas")
          .evaluate((c: HTMLCanvasElement) =>
            Array.from(
              c
                .getContext("2d")!
                .getImageData(Math.floor(c.width * 0.5), 3, 1, 1).data,
            ).join(","),
          ),
      );
    }
    expect(new Set(samples).size).toBe(3);
    await page.getByRole("button", { name: "Done", exact: true }).click();
  }
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await expect(page.getByRole("button", { name: "Come on in" })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  await page.getByRole("button", { name: "Decorate Make it yours" }).click();
  await expect(
    page.getByRole("button", { name: "Twilight", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Rose pebbles", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
