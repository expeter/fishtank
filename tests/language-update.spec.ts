import { test, expect } from "@playwright/test";
import { VERSION } from "../src/game";
import { writeFile, unlink } from "node:fs/promises";

test("flag buttons switch the whole game and remember English on a German phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "language", { value: "de-DE" });
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Deutsch", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".landing-language")).toContainText(`v${VERSION}`);
  await page.screenshot({ path: "/tmp/fishtank-language-start.png" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByRole("button", { name: "Let’s dive in" }).click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Deutsch", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Entdeckerbuch", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Field guide", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "English", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(page.locator(".friends")).toContainText("2");
});

test("an old cache-first worker upgrades without deleting a saved world", async ({
  page,
}) => {
  test.skip(!process.env.FT_PRODUCTION, "Production worker required");
  const name = `legacy-worker-${Date.now()}.js`;
  const html = `<!doctype html><h1>Old version 0.6.0</h1><script>navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'});</script>`;
  await writeFile(
    `dist/${name}`,
    `self.addEventListener('install',e=>e.waitUntil(caches.open('fishtank-legacy').then(c=>c.put('/index.html',new Response(${JSON.stringify(html)},{headers:{'Content-Type':'text/html'}}))).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{if(e.request.mode==='navigate')e.respondWith(caches.open('fishtank-legacy').then(c=>c.match('/index.html')));});`,
  );
  try {
    await page.goto("/");
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.getByRole("button", { name: "Create a world" }).first().click();
    await page
      .getByPlaceholder("My little paradise")
      .fill("Kept through update");
    await page.getByRole("button", { name: "Let’s dive in" }).click();
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.getByRole("button", { name: "My worlds", exact: true }).click();
    await page.evaluate(
      (name) => navigator.serviceWorker.register("/" + name, { scope: "/" }),
      name,
    );
    await page.waitForFunction(
      (name) => navigator.serviceWorker.controller?.scriptURL.endsWith(name),
      name,
    );
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Old version 0.6.0" }),
    ).toBeVisible();
    await page.waitForFunction(() =>
      navigator.serviceWorker.controller?.scriptURL.endsWith("/sw.js"),
    );
    await page.reload();
    await expect(page.locator(".landing-language")).toContainText(
      `v${VERSION}`,
    );
    await page.getByRole("button", { name: "Come on in" }).click();
    await expect(
      page.getByRole("main", { name: "Kept through update" }),
    ).toBeVisible();
    await expect(page.locator(".friends")).toContainText("2");
  } finally {
    await unlink(`dist/${name}`);
  }
});

test("save and update also works when the new worker is already active", async ({
  page,
}) => {
  test.skip(!process.env.FT_PRODUCTION, "Production worker required");
  await page.route("**/version.json", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ version: "99.0.0" }),
    }),
  );
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.getByRole("button", { name: "Create a world" }).first().click();
  await page.getByPlaceholder("My little paradise").fill("Already updated");
  await page.getByRole("button", { name: "Let’s dive in" }).click();
  await page.evaluate(() => {
    const original = ServiceWorkerRegistration.prototype.update;
    (window as any).restoreUpdate = () => {
      ServiceWorkerRegistration.prototype.update = original;
    };
    ServiceWorkerRegistration.prototype.update = () =>
      Promise.reject(new Error("Network unavailable"));
  });
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Save and update", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("internet connection");
  await expect(page.locator(".error-banner")).toHaveCount(0);
  await page.evaluate(() => (window as any).restoreUpdate());
  await page
    .getByRole("button", { name: "Save and update", exact: true })
    .click();
  await page.getByRole("button", { name: "Come on in" }).click();
  await expect(
    page.getByRole("main", { name: "Already updated" }),
  ).toBeVisible();
});
