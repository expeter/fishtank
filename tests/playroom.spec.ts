import { test, expect, type Page } from "@playwright/test";
import { createSave, decorations, type Save } from "../src/game";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
async function readSave(page: Page): Promise<Save> {
  return page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const request = indexedDB.open("little-fishtank", 1);
        request.onsuccess = () => {
          const db = request.result,
            tx = db.transaction("saves"),
            r = tx.objectStore("saves").get(0);
          r.onsuccess = () => resolve(r.result);
          tx.oncomplete = () => db.close();
          tx.onerror = () => reject(tx.error);
        };
        request.onerror = () => reject(request.error);
      }),
  );
}
async function seedWorld(page: Page, german = false) {
  if (german)
    await page.addInitScript(() => localStorage.setItem("ft-language", "de"));
  await page.goto("/");
  const save = createSave(0, "Pip’s playroom", "creative");
  save.tutorial = false;
  save.worlds.aquarium.fish.forEach((fish, i) => {
    fish.name = i ? "Coral" : "Sunny";
    fish.seed = i ? 73 : 42;
    fish.playful = 0.95;
    fish.mood = 90;
    fish.x = 0.45 + i * 0.1;
    fish.y = 0.45;
    fish.careUntil = Date.now() + 600000;
  });
  await page.evaluate(async (s) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open("little-fishtank", 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("saves", "readwrite");
      tx.objectStore("saves").put(s, 0);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }, save);
  await page.reload();
  await page
    .getByRole("button", {
      name: german ? "Komm herein" : "Come on in",
      exact: true,
    })
    .click();
}

test("German phone dock has five accessible icons without visible label collisions", async ({
  page,
}) => {
  await seedWorld(page, true);
  const buttons = page.locator(".toolbar > button");
  await expect(buttons).toHaveCount(5);
  const boxes = await buttons.evaluateAll((els) =>
    els.map((el) => {
      const b = el.getBoundingClientRect();
      const label = el.querySelector("span:not(.tool-icon)")!;
      return {
        x: b.x,
        y: b.y,
        right: b.right,
        bottom: b.bottom,
        width: b.width,
        height: b.height,
        hidden: getComputedStyle(label).display === "none",
        name: el.getAttribute("aria-label"),
      };
    }),
  );
  boxes.forEach((box, i) => {
    expect(box.hidden).toBe(true);
    expect(box.name).toBeTruthy();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.right).toBeLessThanOrEqual(390);
    expect(box.bottom).toBeLessThanOrEqual(844);
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    if (i) expect(box.x).toBeGreaterThanOrEqual(boxes[i - 1].right);
  });
  await page.screenshot({ path: "/tmp/fishtank-playroom-german-dock.png" });
});

test("decoration editing has one tray at a time and the expanded catalogue can be used", async ({
  page,
}) => {
  await seedWorld(page);
  expect(decorations).toHaveLength(36);
  await page.getByRole("button", { name: "Decorate Make it yours" }).click();
  await expect(page.locator(".panel-decorate")).toBeVisible();
  await expect(page.locator(".panel-decorate .modal")).toHaveCSS(
    "opacity",
    "1",
  );
  await page.screenshot({ path: "/tmp/fishtank-playroom-decor-shelf.png" });
  await expect(page.locator(".decor-controls")).toHaveCount(0);
  await expect(page.locator(".tool-status")).toHaveCount(0);
  await page.getByRole("button", { name: "Leafy fern", exact: true }).click();
  await expect(page.locator(".panel-decorate")).toHaveCount(0);
  await expect(page.locator(".decor-controls")).toBeVisible();
  await expect(page.locator(".decor-controls")).toHaveCSS("opacity", "1");
  const editor = (await page.locator(".decor-controls").boundingBox())!;
  const dock = (await page.locator(".toolbar").boundingBox())!;
  expect(editor.y).toBeGreaterThanOrEqual(8);
  expect(editor.width).toBeLessThanOrEqual(180);
  expect(editor.y + editor.height).toBeLessThan(422);
  expect(editor.y + editor.height).toBeLessThan(dock.y);
  expect(editor.x).toBeGreaterThanOrEqual(0);
  expect(editor.x + editor.width).toBeLessThanOrEqual(390);
  await page.screenshot({
    path: "/tmp/fishtank-playroom-decor-controls.png",
    animations: "disabled",
  });
  await page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
  await expect(page.locator(".decor-controls")).toHaveCount(0);
  await expect(page.locator(".tool-status")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Window snail Add friend", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Little crab Add friend", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Lovely things", exact: true })
    .click();
  await expect(page.locator(".catalog > button")).toHaveCount(18);
  for (const item of decorations.filter(
    (d) => d.kind >= 24 && d.habitat === "aquarium",
  )) {
    await expect(
      page.locator(".catalog > button").filter({ hasText: item.en }),
    ).toBeVisible();
  }
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page
    .getByRole("button", { name: "Woodland coast", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Little shop Find something lovely" })
    .click();
  await page
    .getByRole("button", { name: "Lovely things", exact: true })
    .click();
  await expect(page.locator(".catalog > button")).toHaveCount(18);
  for (const item of decorations.filter((d) => d.kind >= 30))
    await expect(
      page.locator(".catalog > button").filter({ hasText: item.en }),
    ).toBeVisible();
});

test("selected playful fish learns a drawn trail, remembers it, and can replay it", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await seedWorld(page);
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: /Sunny/ }).click();
  await expect(page.locator(".compact-friend")).toBeVisible();
  await page.getByRole("button", { name: "Draw a trail", exact: true }).click();
  await expect(page.locator(".compact-friend")).toHaveCount(0);
  await expect(page.locator(".play-tools")).toHaveCount(0);
  await page.mouse.move(195, 380);
  await page.mouse.down();
  // Allow an interested fish to reach the start before drawing a gentle loop.
  await page.waitForTimeout(1500);
  for (let i = 0; i <= 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    await page.mouse.move(
      195 + 65 * Math.sin(angle),
      380 + 70 * (1 - Math.cos(angle)),
    );
    await page.waitForTimeout(50);
  }
  await page.mouse.up();
  await expect
    .poll(
      async () =>
        (await readSave(page)).worlds.aquarium.fish.find(
          (f) => f.name === "Sunny",
        )?.trick?.rehearsals,
    )
    .toBe(1);
  const learned = (await readSave(page)).worlds.aquarium.fish.find(
    (f) => f.name === "Sunny",
  )!.trick!;
  expect(learned.points.length).toBeGreaterThanOrEqual(4);
  expect(
    (await readSave(page)).worlds.aquarium.fish.find((f) => f.name === "Coral")!
      .trick,
  ).toBeUndefined();
  await page.getByRole("button", { name: "Play Make a friend" }).click();
  await page.getByRole("button", { name: "Replay learned trails" }).click();
  await page.screenshot({ path: "/tmp/fishtank-playroom-learned-trail.png" });
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "My worlds", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Come on in", exact: true }).click();
  expect(
    (await readSave(page)).worlds.aquarium.fish.find((f) => f.name === "Sunny")!
      .trick,
  ).toEqual(learned);
  await page.getByRole("button", { name: "Meet all animals" }).click();
  await page.getByRole("button", { name: /Sunny/ }).click();
  await expect(page.locator(".trick-memory")).toContainText("Learned trail");
  expect(errors).toEqual([]);
});
