# Release polish — v1.0.0

## Implemented

- [x] FT-801: food costs one coin per portion for flakes, pellets and algae; worms and insects cost two. Creative feeding stays free. Synchronous purchase acceptance blocks food creation when money is insufficient and protects rapid taps from overspending.
- [x] FT-802: five pocket-money coins per complete minute of active progression play. Persist the fractional minute; hidden/offline gaps do not pay. Pocket money never increases fish-sales unlock progress.
- [x] FT-803: stamp actual eating, not food placement. Breeding requires two grown same-species animals that ate within thirty minutes and have hunger at most 60, alongside existing chance, cooldown and capacity checks.
- [x] FT-804: visible aquarium glass buildup, finger wiping and snail cleaning; shoreline litter with tap-to-collect interaction. Persist sixteen glass and sixteen litter timestamps per habitat. Cleaning remains optional, without animal deaths or penalties.
- [x] FT-805: occasional background animal visitors with quiet pauses, using local procedural artwork.
- [x] FT-806: four original automatic music chapters with different melodies, chord progressions, instruments, pacing and rests. Music/effects stay independently controlled. Master mute stops active voices and pending notes; repeated settings calls do not create duplicate schedulers.
- [x] FT-807: bilingual help explains paid portions, pocket money, recent feeding, visible glass patches and shoreline cleanup.
- [x] FT-808: rebalance scenario verification includes paid feeding and active allowance. Regular fifteen-minute trading intervals reach final-tier affordability at about 20.25 game-world hours; see [measured scenarios](../economy-balance.md). This is not a forced wait or a promise of hands-on playtime.

- [x] FT-809: all 30 species have seven additional bilingual discovery sections, compact care/biology chapters, and 13 water topics. Content stays in the app; research notes are in `docs/knowledge-sources.md`.
- [x] FT-810: homework and nature mini-jobs have habitat-specific menu teasers. Actual tasks and rewards are deferred to the next-version planning discussion.

## Validation and release checks

- [x] Six focused audio tests cover audible variation, harmony, independent music/effects, mute cancellation, delayed browser unlock and unavailable audio output.
- [x] Twenty-four focused model/economy tests pass after the new rules, including food affordability, fractional allowance persistence, no offline income, strict cleanup validation, recently fed parents, premium breeding cooldowns and legacy saves.
- [x] Read-only integration review of the App food acceptance, actual-eating callback, cleanup callback and allowance visibility lifecycle completed. No App edits were needed for the reviewed money and persistence paths.
- [x] Final complete unit suite: 97 tests pass. Production build passes with a separately cached encyclopedia chunk.
- [x] 61 unique production browser scenarios verified across the full run and focused reruns, including paid feeding, recently fed breeding, allowance, persistent cleanup, teasers and narrow-screen interactions. The lazy-loaded book opens for the first time offline.
- [x] Final bilingual narrow-screen visual review, including encyclopedia and cleanup. Fixed chapter-button transition contrast and wrapping numbers; screenshots in `docs/screenshots/v1.0.0-*`.
- [ ] Real Android/iPhone audio, installation, sharing and sustained performance checks.
- [x] Published to https://fishtank.minizap.online via GitHub Pages workflow run 36348390264. Live HTTPS browser check returned 200, version 1.0.0, fullscreen manifest, successful world creation and offline first-open book, with zero JavaScript errors. This environment had an old DNS cache; the check used the GitHub address returned by public DNS.

Fish inspection is free: a tap starting on a fish opens its card without purchasing food. A paid water tap does not open a card if a fish swims underneath it. Empty-world prompts are hidden while cleaning, playing, exploring or designing.
