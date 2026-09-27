import { expect, it } from "vitest";
import {
  advance,
  animals,
  breed,
  breedingCooldown,
  buyFish,
  buyFood,
  capacity,
  createSave,
  growth,
  makeFish,
  prices,
  progress,
  sell,
  tiers,
  value,
  type Habitat,
} from "../src/game";

/** Repeatable balance model: both habitats, restock by profit/space/hour,
 * two minutes of care per visit, no purchased adults or save edits. */
function campaign(
  visitMinutes: number,
  habitats: Habitat[] = ["aquarium", "sea"],
  careSeconds = 120,
  nursery = false,
) {
  let s = createSave(0, "Balance", "progression", 0);
  const milestones: Record<number, number> = {};
  let seed = 17;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let minute = 0; minute <= 120 * 60; minute += visitMinutes) {
    s = advance(s, minute * 60000);
    if (nursery) s = breed(s, minute * 60000, random);
    for (const habitat of habitats) {
      s.habitat = habitat;
      const adults = s.worlds[habitat].fish.filter((f) => progress(f) === 1);
      const keep = nursery ? adults.slice(0, 2).map((f) => f.id) : [];
      for (const fish of adults)
        if (!keep.includes(fish.id)) s = sell(s, fish.id);
    }
    for (let tier = 0; tier < tiers.length; tier++)
      if (s.earned >= tiers[tier] && s.coins >= prices[tier])
        milestones[tier] ??= minute;
    if (milestones[6] !== undefined) return milestones;
    for (const habitat of habitats) {
      s.habitat = habitat;
      const candidates = animals
        .filter(
          (a) =>
            a.habitat === habitat && a.tier < 6 && tiers[a.tier] <= s.earned,
        )
        .sort(
          (a, b) =>
            prices[b.tier] / growth[b.tier] - prices[a.tier] / growth[a.tier],
        );
      while (s.worlds[habitat].fish.length < capacity(s)) {
        const next = candidates.find((a) => prices[a.tier] <= s.coins - 8);
        if (!next) break;
        s = buyFish(s, next.id, false, minute * 60000);
      }
      // Four small drops can feed 24 animals; hold a little cash for both habitats.
      // This models successful eating, not simply throwing food near every animal.
      if (careSeconds > 0)
        for (let i = 0; i < s.worlds[habitat].fish.length; i += 6) {
          const paid = buyFood(s, "flakes");
          if (paid === s) break;
          s = paid;
          for (const fish of s.worlds[habitat].fish.slice(i, i + 6)) {
            fish.careUntil = minute * 60000 + careSeconds * 1000;
            fish.lastFedAt = minute * 60000;
            fish.hunger = Math.max(0, fish.hunger - 30);
          }
        }
    }
  }
  return milestones;
}
it("puts late-game affordability near twenty hours for ordinary repeat visits", () => {
  const regular = campaign(15);
  expect(Object.keys(regular)).toHaveLength(tiers.length);
  expect(regular[4]).toBeGreaterThan(regular[3]);
  expect(regular[5]).toBeGreaterThan(regular[4]);
  expect(regular[6] / 60).toBeGreaterThanOrEqual(18);
  expect(regular[6] / 60).toBeLessThanOrEqual(25);
  expect(campaign(30)[6] / 60).toBeGreaterThanOrEqual(18);
  expect(campaign(30)[6] / 60).toBeLessThanOrEqual(25);
  expect(campaign(15, ["aquarium"], 120, true)[6] / 60).toBeLessThan(30);
  // Constant care is intentionally faster; this is not a forced twenty-hour wait.
  expect(campaign(5, ["aquarium", "sea"], 300)[6]).toBeLessThan(regular[6]);
});
it("keeps progression purchases young and rejects locked, wrong-habitat or full purchases", () => {
  let s = createSave(0, "Shop", "progression");
  expect(buyFish(s, "ghostknife", true)).toBe(s);
  s.coins = 100000;
  s.earned = 100000;
  const bought = buyFish(s, "ghostknife", true);
  expect(progress(bought.worlds.aquarium.fish.at(-1)!)).toBe(0);
  expect(value(bought.worlds.aquarium.fish.at(-1)!)).toBeLessThan(prices[6]);
  expect(
    sell(bought, bought.worlds.aquarium.fish.at(-1)!.id).coins,
  ).toBeLessThan(s.coins);
  expect(buyFish(s, "zebra_shark")).toBe(s);
  s.worlds.aquarium.fish = Array.from({ length: 24 }, () => makeFish("snail"));
  expect(buyFish(s, "guppy")).toBe(s);
  s = createSave(0, "Free", "creative");
  const free = buyFish(s, "ghostknife", true);
  expect(free.coins).toBe(s.coins);
  expect(progress(free.worlds.aquarium.fish.at(-1)!)).toBe(1);
});
it("bounds premium nursery income with species growth-linked cooldowns", () => {
  const s = createSave(0, "Nursery", "progression", 0);
  s.worlds.aquarium.fish = [
    makeFish("ghostknife", true, 0),
    makeFish("ghostknife", true, 0),
  ];
  s.breedAt.aquariumghostknife = 0;
  expect(breed(s, 300001, () => 0).worlds.aquarium.fish).toHaveLength(2);
  for (const fish of s.worlds.aquarium.fish)
    fish.lastFedAt = breedingCooldown(6);
  const born = breed(s, breedingCooldown(6) + 1, () => 0);
  expect(born.worlds.aquarium.fish).toHaveLength(3);
  expect(
    breed(born, breedingCooldown(6) + 300001, () => 0).worlds.aquarium.fish,
  ).toHaveLength(3);
});
