import { test, expect } from "@playwright/test";
import { createSave, makeFish, animals, canLiveIn } from "../src/game";
import { fishColor } from "../src/appearance";
test.use({ hasTouch: true });

test("phone world: wallet, persistent tools, field guide, sizes, panning and save recovery", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).nth(2).click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  const stage = page.locator(".tank");
  await expect(stage).toHaveCSS("height", "768px");
  await expect(page.locator(".coin-pill")).toContainText("100");
  const food = page.getByRole("button", { name: "Feed A little nibble" });
  await expect(food).toHaveAttribute("aria-pressed", "true");
  await page.touchscreen.tap(20, 650);
  await page.locator(".tank canvas").click({ position: { x: 25, y: 650 } });
  await expect(food).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
  await expect(page.locator(".shop-wallet")).toContainText("98 coins");
  await expect(page.locator(".catalog>button")).toHaveCount(
    animals.filter((a) => canLiveIn(a.id, "aquarium")).length,
  );
  await page.getByRole("button", { name: "Goldfish 20", exact: true }).click();
  await expect(page.locator(".shop-wallet")).toContainText("78 coins");
  await expect(page.locator(".coin-pill")).toContainText("78");
  await page.screenshot({ path: "/tmp/fishtank-overhaul-shop.png" });
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page
    .getByRole("button", { name: /Goldfish/ })
    .first()
    .click();
  await page.getByRole("button", { name: /Sell for 10/ }).click();
  await page.getByRole("button", { name: "Yes, please" }).click();
  await expect(page.locator(".coin-pill")).toContainText("88");

  await page.getByRole("button", { name: "Explore Drag the world" }).click();
  await page.mouse.move(320, 410);
  await page.mouse.down();
  await page.mouse.move(65, 410, { steps: 12 });
  await page.mouse.up();
  expect(await stage.evaluate((el) => el.scrollLeft)).toBeGreaterThan(200);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Field guide", exact: true }).click();
  await expect(page.locator(".guide-grid>button")).toHaveCount(animals.length);
  await page.getByRole("button", { name: "Moon jelly", exact: true }).click();
  await page.getByRole("button", { name: "Discover the biology" }).click();
  await expect(
    page.getByRole("heading", { name: "A jelly is not a fish" }),
  ).toBeVisible();
  await page.screenshot({ path: "/tmp/fishtank-overhaul-guide.png" });
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page
    .getByRole("button", { name: "Woodland coast", exact: true })
    .click();
  await page.screenshot({ path: "/tmp/fishtank-overhaul-coast.png" });
  await page.getByRole("button", { name: "Aquarium", exact: true }).click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await expect(page.getByRole("button", { name: "Come on in" })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page.locator(".coin-pill")).toContainText("88");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.getByLabel("World size", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.setViewportSize({ width: 844, height: 390 });
  await page.screenshot({ path: "/tmp/fishtank-overhaul-landscape.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("rapid purchases cannot overspend the balance shown in the HUD and shop", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  await page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
  await page
    .getByRole("button", { name: "Guppy 20", exact: true })
    .evaluate((button) => {
      for (let i = 0; i < 12; i++) (button as HTMLButtonElement).click();
    });
  await expect(page.locator(".coin-pill")).toHaveText("0coins");
  await expect(page.locator(".shop-wallet")).toContainText("0 coins to spend");
  await expect(
    page.getByRole("button", { name: "Guppy 20", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.locator(".friends")).toContainText("7");
});

test("tapping a fish opens its compact action card without buying food", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem("ft-reduced", "true"));
  await page.goto("/");
  const save = createSave(0, "Peek world", "progression");
  save.tutorial = false;
  const fish = {
    ...makeFish("goldfish", true, Date.now() - 600000),
    seed: 42,
    x: 0.5,
    y: 0.5,
    careUntil: Date.now() + 600000,
  };
  save.worlds.aquarium.fish = [fish];
  save.worlds.aquarium.decor = [];
  await page.evaluate(async (save) => {
    await new Promise<void>((resolve, reject) => {
      const r = indexedDB.open("little-fishtank", 1);
      r.onsuccess = () => {
        const tx = r.result.transaction("saves", "readwrite");
        tx.objectStore("saves").put(save, 0);
        tx.oncomplete = () => {
          r.result.close();
          resolve();
        };
        tx.onerror = () => reject(tx.error);
      };
    });
  }, save);
  await page.reload();
  await page.getByRole("button", { name: "Come on in" }).click();
  const readPoint = () =>
    page
      .locator(".tank canvas")
      .evaluate((canvas: HTMLCanvasElement, color) => {
        const c = canvas.getContext("2d")!;
        const sample = document.createElement("canvas").getContext("2d")!;
        sample.fillStyle = color;
        sample.fillRect(0, 0, 1, 1);
        const rgb = sample.getImageData(0, 0, 1, 1).data;
        const pixels = c.getImageData(0, 0, canvas.width, canvas.height).data;
        let count = 0,
          x = 0,
          y = 0;
        for (let i = 0; i < pixels.length; i += 4)
          if (
            pixels[i] === rgb[0] &&
            pixels[i + 1] === rgb[1] &&
            pixels[i + 2] === rgb[2]
          ) {
            count++;
            x += (i / 4) % canvas.width;
            y += Math.floor(i / 4 / canvas.width);
          }
        const bounds = canvas.getBoundingClientRect();
        return count
          ? {
              x:
                bounds.left + ((x / count) * canvas.clientWidth) / canvas.width,
              y:
                bounds.top +
                ((y / count) * canvas.clientHeight) / canvas.height,
            }
          : null;
      }, fishColor(fish));
  let point = await readPoint();
  await expect
    .poll(async () => {
      point = await readPoint();
      return point;
    })
    .not.toBeNull();
  await page.touchscreen.tap(point!.x, point!.y);
  await expect(page.locator(".compact-friend")).toBeVisible();
  await expect(page.locator(".coin-pill")).toContainText("100");
  await expect(page.locator(".fish-peek")).toHaveCount(0);
  await expect(page.locator(".compact-friend")).toHaveCSS("opacity", "1");
  await expect(page.getByLabel("A name for your friend")).toBeVisible();
  await page.screenshot({ path: "/tmp/fishtank-overhaul-fish-actions.png" });
  await page.getByRole("button", { name: "Close", exact: true }).click();
});

test("large-world decorations are placed in the visible area", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Create a world" }).nth(2).click();
  await page.getByRole("button", { name: "Just imagine" }).click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();

  await page.getByRole("button", { name: "Explore Drag the world" }).click();
  await page.locator(".tank canvas").focus();
  for (let i = 0; i < 5; i++) await page.keyboard.press("ArrowRight");
  const center = await page
    .locator(".tank canvas")
    .evaluate(
      (c) =>
        (c.parentElement!.scrollLeft + c.parentElement!.clientWidth / 2) /
        c.clientWidth,
    );
  expect(center).toBeGreaterThan(0.65);
  await page.getByRole("button", { name: "Decorate Make it yours" }).click();
  await page.getByRole("button", { name: "Leafy fern", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            const r = indexedDB.open("little-fishtank", 1);
            r.onsuccess = () => {
              const tx = r.result.transaction("saves");
              const get = tx.objectStore("saves").get(2);
              get.onsuccess = () =>
                resolve(get.result.worlds.aquarium.decor.at(-1).x);
              tx.oncomplete = () => r.result.close();
            };
          }),
      ),
    )
    .toBeCloseTo(center, 2);
});
