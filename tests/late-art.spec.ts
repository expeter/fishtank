import { test, expect } from "@playwright/test";
test("late fish artwork and long German shop labels fit phone cards", async ({
  browser,
}) => {
  const context = await browser.newContext({
    locale: "de-DE",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await page.getByRole("button", { name: "Welt erstellen" }).first().click();
    await page.getByRole("button", { name: "Einfach gestalten" }).click();
    await page.getByRole("button", { name: "Tauchen wir ein" }).click();
    const images: { name: string; data: string; edge: number }[] = [];
    for (const [habitat, names] of [
      [
        "Aquarium",
        [
          "Mosaikfadenfisch",
          "Boesemans Regenbogenfisch",
          "Weißstirn-Messerfisch",
        ],
      ],
      ["Waldküste", ["Pfauenkaiserfisch", "Achilles-Doktorfisch", "Zebrahai"]],
    ] as const) {
      await page.getByRole("button", { name: habitat, exact: true }).click();
      await page.getByRole("button", { name: /^Kleiner Laden/ }).click();
      await page
        .getByRole("button", { name: "Kleine Freunde", exact: true })
        .click();
      for (const name of names) {
        const card = page.locator(".catalog>button").filter({ hasText: name });
        await card.scrollIntoViewIfNeeded();
        expect(
          await card.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
        ).toBe(true);
        await card.screenshot({ path: `/tmp/late-${images.length}.png` });
        const result = await card
          .locator("canvas")
          .evaluate((canvas: HTMLCanvasElement) => {
            const { width: w, height: h } = canvas;
            const pixels = canvas
              .getContext("2d")!
              .getImageData(0, 0, w, h).data;
            let edge = 0;
            for (let y = 0; y < h; y++)
              for (let x = 0; x < w; x++)
                if (
                  (x < 2 || x >= w - 2 || y < 2 || y >= h - 2) &&
                  pixels[(y * w + x) * 4 + 3] > 20
                )
                  edge++;
            return { data: canvas.toDataURL(), edge };
          });
        images.push({ name, ...result });
      }
      await page.screenshot({ path: `/tmp/late-shop-${habitat}.png` });
      await page
        .getByRole("button", { name: "Schließen", exact: true })
        .click();
    }
    const atlas = await context.newPage();
    await atlas.setViewportSize({ width: 1000, height: 680 });
    await atlas.setContent(
      `<body style="background:#cce5e6;font-family:sans-serif;display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:20px">${images.map((image) => `<article style="background:#ffefd4;border-radius:20px;text-align:center;padding:20px"><img src="${image.data}" style="width:260px;height:190px;object-fit:contain"><p>${image.name}</p><small>edge pixels: ${image.edge}</small></article>`).join("")}</body>`,
    );
    await atlas.screenshot({ path: "/tmp/fishtank-late-six-atlas.png" });
    expect(
      images.map((image) => ({ name: image.name, edge: image.edge })),
    ).toEqual(images.map((image) => ({ name: image.name, edge: 0 })));
  } finally {
    await context.close();
  }
});
