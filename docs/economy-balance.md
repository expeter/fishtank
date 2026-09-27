# Progression balance

The first four tiers remain unchanged. Three late-game pairs add freshwater and marine choices with matching fictional economics:

| Tier | Species | Buy | Lifetime sales required | Unassisted growth | Adult sale |
| --- | --- | ---: | ---: | ---: | ---: |
| 4 | Pearl gourami / regal angelfish | 2,000 | 6,000 | 4 hours | 4,000 |
| 5 | Boesemani rainbowfish / Achilles tang | 8,000 | 20,000 | 6 hours | 16,000 |
| 6 | Black ghost knifefish / zebra shark | 24,000 | 60,000 | 12 hours | 48,000 |

Creative purchases remain free and may start adult. Progression purchases always start newborn; an immediate resale returns half the purchase price. Both modes share 24 animal spaces per habitat. Breeding checks wait at least half the species' unassisted growth duration (minimum five minutes), with the existing 35% chance and two adults that actually ate within the last thirty minutes and have hunger at most 60, so an expensive pair cannot generate a valuable baby every five minutes. Old animals, balances and unlocks remain valid.

`tests/economy.test.ts` simulates actual `buyFish`, `advance`, `sell` and optional `breed`: 100 starting coins and two guppies; sell adults, reinvest in the unlocked fish with the best nominal profit per space per hour, fill up to 24 per habitat, keep the game active between trading visits, and give two minutes of growth care at each visit. Feeding is paid: one flake drop per six animals, reserving eight coins for food before restocking. The model assumes each of those six animals successfully eats; real scattered feeding can require extra drops. Active play awards five pocket-money coins per minute without adding to sales unlock progress. No save edits, adult purchases, decoration spending or forced waiting gates. The model tests all seven tiers, not just guppies.

Measured game-world hours until both final-tier unlock and cash affordability:

| Visits | Habitats | Hours |
| --- | --- | ---: |
| Every 5 minutes | Both | 16.9 |
| Every 15 minutes | Both | 20.25 |
| Every 30 minutes | Both | 21.5 |
| Every hour | Both | 23.0 |
| Every 15 minutes | Aquarium only | 18.25 |
| Every 15 minutes, retain two recently fed adults per habitat for nursery | Both | 17.5 |
| Every 15 minutes, no care bonus or food purchases | Both | 20.5 |
| Every 5 minutes, continuous ideal care for every animal | Both | 11.83 |

These are scenario estimates, not a guarantee of twenty hours or a measurement of hands-on screen time. Offline growth also helps, but offline time pays no pocket money. These scenarios keep the game active between trading visits. Reinvestment timing makes the greedy strategy non-monotonic: care can alter purchases and delay a large cash balance. Optimised cheap-fish farming, early sale strategies or concentrated care can be faster; decorating, keeping favourites and infrequent sales can be slower. The intended ordinary repeated-visit target is roughly twenty hours of growing and trading across sessions.

Nominal adult-minus-purchase profit per occupied space per unassisted hour is 120, 120, 90, 125, 500, 1,333 and 2,000 coins for tiers 0–6. Higher tiers reward patient investment rather than making cheap fish the only sensible business. Real-world care and lifespan in the field guide are separate from these fictional prices and growth times.
