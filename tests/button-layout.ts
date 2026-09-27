import { expect, type Page } from "@playwright/test";
/** Inspect rendered text, not CSS promises: catch split words, wrapped action
 * labels and text spilling outside its actual button. Card names may wrap
 * between whole words; prices/descriptions are separate intentional rows. */
export async function assertButtonLabelsFit(page: Page, screen: string) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.querySelectorAll(".modal")]
        .flatMap((el) => el.getAnimations())
        .map((animation) => animation.finished.catch(() => {})),
    );
    await new Promise<void>((r) =>
      requestAnimationFrame(() => requestAnimationFrame(() => r())),
    );
  });
  const issues = await page.locator("button").evaluateAll((buttons) => {
    const errors: string[] = [];
    for (const button of buttons) {
      const box = button.getBoundingClientRect();
      if (
        !box.width ||
        !box.height ||
        getComputedStyle(button).visibility === "hidden"
      )
        continue;
      const label = (
        button.getAttribute("aria-label") ||
        button.textContent ||
        ""
      )
        .trim()
        .replace(/\s+/g, " ");
      const card = !!button.closest(".catalog,.guide-grid,.panel-residents");
      const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const value = node.textContent || "";
        if (!value.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rects = [...range.getClientRects()].filter(
          (r) => r.width > 0 && r.height > 0,
        );
        if (!rects.length) continue;
        const modal = button.closest(".modal")?.getBoundingClientRect();
        if (
          !button.closest(".catalog") &&
          rects.some(
            (r) =>
              r.left < Math.max(0, modal?.left ?? 0) - 1 ||
              r.right > Math.min(innerWidth, modal?.right ?? innerWidth) + 1,
          )
        )
          errors.push(`${label}: text extends outside the screen or panel`);
        for (
          let parent = node.parentElement;
          parent && parent !== button;
          parent = parent.parentElement
        ) {
          const style = getComputedStyle(parent),
            bounds = parent.getBoundingClientRect();
          if (
            ["hidden", "clip"].includes(style.overflowX) &&
            rects.some(
              (r) => r.left < bounds.left - 1 || r.right > bounds.right + 1,
            )
          )
            errors.push(`${label}: text clipped by inner element`);
        }
        if (
          rects.some(
            (r) =>
              r.left < box.left - 1 ||
              r.right > box.right + 1 ||
              r.top < box.top - 1 ||
              r.bottom > box.bottom + 1,
          )
        )
          errors.push(`${label}: clipped/overflowing text ${value.trim()}`);
        if (
          !card &&
          !node.parentElement?.closest(".mode-options small") &&
          new Set(rects.map((r) => Math.round(r.top))).size > 1
        )
          errors.push(`${label}: action label wraps ${value.trim()}`);
        for (const match of value.matchAll(/\S+/g)) {
          range.setStart(node, match.index!);
          range.setEnd(node, match.index! + match[0].length);
          if (
            new Set(
              [...range.getClientRects()]
                .filter((r) => r.width > 0)
                .map((r) => Math.round(r.top)),
            ).size > 1
          )
            errors.push(`${label}: word splits ${match[0]}`);
        }
      }
    }
    return [...new Set(errors)];
  });
  expect.soft(issues, screen).toEqual([]);
}
