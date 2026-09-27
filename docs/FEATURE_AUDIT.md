# Current release: v0.2.0

The phone-world overhaul is implemented. See [FT-201–FT-208](tickets/002-phone-world-overhaul.md) for feedback, acceptance evidence and screenshots. The latest build and 33 unit tests pass; the final complete 27-scenario production browser run passed, alongside the preceding 16 plain-HTTP scenarios including decoration placement after panning. Older results below are historical evidence for the original game.

New behavior: viewport-filling gameplay, icon dock and hamburger, persistent tools, quick fish peek, compact shop with consistent spendable balance, original woodland coast, saved world sizes and panning, 24 animals, bilingual field guide, animation/sound feedback and fullscreen-first installation manifest. Browser-managed chrome and physical-device validation remain subject to the release checks below.

---

# Completion audit

The planned game implementation is complete at version **0.1.2**. This record distinguishes automated and visual verification from release checks that require hosting access or physical devices. The site has not been deployed by this workspace.

## Evidence currently established

- `npm run build`: successful TypeScript and static production build, including generated offline worker.
- `npm test`: 27 passing tests for growth, care, breeding cooldown/capacity, economy, rescue, save validation, IndexedDB backups, slot independence, refresh-rate-independent movement, and layered touch selection.
- Production Playwright suite: 22 passing tests, including real offline reload and acceptance of a waiting service worker with saved animals and coins restored.
- Full creative habitat: 100 animals and 150 decorations rendered at approximately 60 FPS in desktop headless Chromium. This does not establish phone performance.

## Requirements and current evidence

| Requirement                                                | Current implementation/evidence                                                                                                                                                      | Remaining verification or work                                                                                                                                                         |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aquarium and sea in each save                              | Separate habitat state, switch controls, habitat-specific catalogs; browser coverage switches habitats                                                                               | Both catalogs and all six background/ground combinations visually reviewed; scenery persists after reload                                                                                       |
| Three persistent saves                                     | IndexedDB, backup recovery, slot locks; unit and browser tests                                                                                                                       | Physical-device storage behavior                                                                                                                                                       |
| Progression versus creative                                | Mode selected at creation, free creative catalog, capacity guards; browser tests                                                                                                     | All tiers reached in a browser using purchases, timed growth and sales; long-session child playtesting remains                                                                         |
| Grow, feed, sell, earn and unlock                          | Simulation tests plus browser feeding/purchase/sale flow                                                                                                                             | Next-unlock progress is shown in the shop; accelerated browser progression verified through 1,800 earned coins                                                                         |
| Free care and no death or neglect penalty                  | Growth capped at adulthood; no death path; offline reconciliation tests                                                                                                              | Rendered away-growth and feeding tests verify hungry/content transitions to happy/well-fed without loss                                                                                                                                       |
| Naming and animal stats                                    | Animal cards and accessible resident list; browser naming and sale confirmation                                                                                                      | Long German names tested at 390×844 and 844×390; hungry/content and happy/well-fed cards verified                                                                     |
| Autonomous swimming, resting, eating and playful following | Canvas movement and interaction logic present; frame-rate invariance now tested                                                                                                      | Rendered pixel checks verify closed resting eyes, movement toward taps, and food consumption before expiry                                                                                                          |
| Breeding                                                   | Adult-pair breeding, saved family links, parent/baby hearts and a localized discovery notice; unit tests, browser save/reload test and rendered screenshot                           | Physical-device visual review                                                                                                                                                          |
| Individual animal variation                                | Stable individual shades and size variation from the saved seed; unique portraits verified across save/reload                                                                        | Physical-device visual review                                                                                                                                                          |
| Snails, frogs, mosquitoes and occasional jumps             | Species renderers and canvas events present; jumps restricted to swimming fish                                                                                                       | Waterline, continuous above-water jumps and frog mosquito catches visually verified; species movement and reduced motion unit-tested                                                                                                                  |
| 12 animals and 24 decorations                              | Defined content and local procedural artwork                                                                                                                                         | All 12 animals and 24 items rendered and visually inspected; corrected shrimp/crab shapes, angelfish fins, tang tail, coral, pearl shell, sea arch and grass                           |
| Free placement, resize, flip, layering, remove and undo    | 50-step session undo, layer-aware touch selection, placement and scenery controls; browser tests exercise dragging, resize, flip, front, removal and each undo; ownership unit tests | Physical touch review                                                                                                                                                                  |
| English and German                                         | Localized controls and browser-default preference; switch tested                                                                                                                     | Browser-default German, long names and canvas accessibility labels verified; replaced unsupported decorative glyphs with vector icons                                                  |
| Child-friendly responsive menus                            | Four main tools and compact menu; 390px layout test                                                                                                                                  | German portrait/landscape layouts reviewed in Chromium; fish positions rescale on rotation; physical touch review remains                                                              |
| Sound, music, mute shortcut                                | Web Audio and persisted settings, M handler                                                                                                                                          | Real AudioContext state, background suspension/resume, shortcut isolation and persistence tested; audible output on physical phones remains                                            |
| Share image                                                | Canvas PNG export and download test                                                                                                                                                  | Prepared postcard uses a fresh share gesture; cancellation, failure/download fallback and PNG payload tested with the native API stubbed; actual OS share sheet remains                |
| Fullscreen and optional installation                       | Fullscreen action, manifest, icons, browser prompt and instructions                                                                                                                  | Actual Chromium fullscreen enter/exit tested; unsupported/rejected requests and deferred/dismissed/rejected/installed prompt states verified; real Android/iPhone installation remains |
| Offline and version checks                                 | Precached build, version polling, deferred activation                                                                                                                                | Offline restore, successful activation, and refusal to reload when saving fails are verified                                                                                           |
| Hosting at fishtank.minizap.online                         | Static build and deployment instructions                                                                                                                                             | No hosting access or deployment evidence is present                                                                                                                                    |

## Release checks requiring external access

1. Upload the production `dist/` build to the HTTPS host for `fishtank.minizap.online` using the cache settings in README.md. Hosting configuration and credentials are not available in this workspace.
2. Validate Android/iPhone installation, actual OS share sheets, audible music/effects, physical touch and sustained performance on the target phones. Desktop emulation is not physical-device evidence.
3. Let the intended child audience try the game and use that feedback for future tuning.

## Final automated run

`npm run build` and `npm test` passed. The complete production browser suite passed **22/22** with `--workers=1`; the full creative tank measured **60.3 FPS** in desktop headless Chromium. Two renderer crashes occurred in an earlier parallel run; neither recurred in the complete sequential run. The cause of those crashes was not established. A sandboxed attempt could not launch Chromium; the successful run used the approved external browser process.

`tests/behaviors.test.ts` covers resting/waking, playful following, species-specific movement, continuous jumps, motion preferences and mosquito catch timing. `tests/behaviors.spec.ts` checks the actual rendered canvas and care cards. All three scenery styles in each habitat were rendered, inspected and checked for persistence. Jumping fish remain within the canvas; frogs sit on lily pads at the waterline and catch insects above the water.

## Latest rendered evidence

`/tmp/fishtank-family.png` shows distinct adult colors, a small baby, hearts on all three family members, and the localized discovery notice. The production browser test verifies that naming and saving the baby preserves its portrait and family badge after reload without replaying the announcement.

## Audio, sharing, and progression evidence

`tests/audio-sharing.spec.ts` checks actual browser AudioContext running/suspended states, preferences after reload, M shortcut handling, and prepared native-share data with transient user activation. The native share function is stubbed to exercise success, cancellation and failure; it does not prove physical OS sharing. `tests/audio.test.ts` also covers delayed autoplay unlock after muting and unavailable audio output.

`tests/progression.spec.ts` accelerates browser time but uses ordinary purchases and sales (no saved-state injection) to reach 150, 600 and 1,800 earned coins, then buys the highest-tier animals in both habitats. The update lifecycle test injects a storage failure, confirms the old controller and open game remain, then restores storage and verifies successful save-and-update.

## Content and platform evidence

The four `/tmp/fishtank-{aquarium,sea}-{animals,decor}.png` screenshots were inspected. `/tmp/fishtank-german-390.png`, `/tmp/fishtank-german-844.png` and `/tmp/fishtank-german-stats.png` were inspected for long-name layout and localized controls. Landscape uses a compact layout; resize preserves normalized animal positions. `tests/platform.spec.ts` exercises real Chromium fullscreen, unavailable/rejected fullscreen, and install prompt deferral, dismissal, rejection and installed-state recognition using browser events. Native installation still requires physical-device validation.

## Version 0.1.1 compatibility fix

Object IDs no longer require `crypto.randomUUID`. The generator falls back to `getRandomValues`, with a local timestamp/counter/random ID fallback when crypto is entirely absent. Existing saves remain compatible. Validation: 30 unit tests and the production build pass; the browser create/care/shop/decorate/save/reload/language scenario passes with `randomUUID` explicitly disabled. The 22-test full-suite result above records the preceding release.

## Version 0.1.2 startup and save compatibility

Removed the hard dependency on Web Locks for opening and deleting saves. The IndexedDB fallback serializes ownership claims, renews leases while open, rejects stale-owner writes atomically and reclaims the same tab's lease after reload. Unit tests cover conflicting claims, expired-lease recovery and stale write/deletion rejection. Browser tests exercise creation, direct reload/reopening, cross-tab opening/deletion protection, release and final deletion with both Web Locks and randomUUID unavailable.

The core suite passed 12/12 on an actual non-secure HTTP origin (`http://fishtank.test:5182`, mapped locally). It covers all three slots, buying/selling, feeding, following, decorating/undo, growth/unlocks, naming, image download and language switching. All 32 unit tests and the production build pass. Version fixtures now derive a future release from the current version so update tests remain valid after releases.

The complete production suite also passed **23/23** on localhost with service workers enabled, including offline restoration, update save protection, German layouts and the full-capacity tank.


## Living Cove v0.3.0 — 2026-09-27

The new pass addresses the remaining phone obstruction and save-entry feedback. See [FT-301–FT-308](tickets/003-living-cove.md) for acceptance evidence and inspected phone images. Shops and naming are nonmodal compact trays, Pip offers a personal introductory story, food responses and appearances differ per fish, and the woodland changes with time/weather. Food-chain play is explicit opt-in with protected named/purchased animals and no offline predation.

The storage lease path is now shared across secure and insecure origins, with immediate reload recovery and an explicit **Play here** transfer. Old-tab writes are fenced after transfer. Production build and all 44 unit tests pass. Browser validation is recorded per scenario across sequential runs; renderer crashes in broad runs required isolated reruns. This does not establish sustained physical-phone performance or native installation/audio behavior.

Final validation: **44 unit tests, 32 unique production browser scenarios across coordinated runs, and 3 additional real non-secure HTTP compatibility/recovery scenarios passed.** Production build passed.


## Playroom v0.4.0 — 2026-09-27

[FT-401–FT-408](tickets/004-playroom.md) adds saved gesture learning, short practice bouts, replay/group games, a first-lesson decoration gift, satiety and settled food, young-fish chasing and older resting, indoor aquarium art, visiting wildlife, twelve original decorations and seven contextual sound families. Phone controls use icons and one contextual tray at a time; the permanent helper is removed in favor of the introduction.

Validation:54 unit tests and36 unique production browser scenarios passed across coordinated runs, plus4 real plain-HTTP tests covering compatibility, learned paths/gift persistence and safe save transfer. The full regression exposed a feed-tap peek dismissal, which was fixed; its focused check passed. A care assertion was updated for the intended new Full state. Physical-device performance and native installation/audio remain separate release checks.


## Focus and discovery v0.5.0 — 2026-09-27

[FT-501–FT-507](tickets/005-discovery.md) covers one-fish attention and working direct play commands, a 24-species bilingual in-app care book, five food types, personalized timestamped postcards, crawling/glass-cleaning snails, manual glass wiping and a saved air-pump toggle. The welcome screen now has readable save cards and an immediate dismissible installation invitation with native and manual paths.

Validation: production build, 66 unit tests, 45 unique production browser scenarios across coordinated runs, and 7 real plain-HTTP scenarios passed. Final welcome checks verify 320/390px German layouts, text contrast, installation prompting only after a tap and installed-app entry. Source attribution remains in developer documentation. Physical-device installation, sharing, audio and sustained performance remain unverified.


## Quiet phone controls v0.5.1 — 2026-09-27

[FT-601–FT-604](tickets/006-quiet-phone.md) replaces automatic introductory overlays and persistent food/play choices with an aligned bottom dock and collapsible options. Help/Pip are opt-in. Food remains active after choosing, and fish activities continue after their controls close. German small portrait and landscape layouts were reviewed from rendered screenshots. Build, 66 unit tests and 12 targeted browser scenarios passed; final submenu changes passed six focused reruns. No deployment or physical-device installation check was performed.


## Mobile workbench and longer discovery v0.6.0 — 2026-09-27

[FT-701–FT-708](tickets/007-mobile-workbench.md) covers ongoing single-fish commands, tap-placed rising bubbles, a reserved lower phone control strip, fixed slot sizes, 24 shared animal places, large age choices, a side editor with 4× scaling/rotation/repetition, saved add/remove sand with undo, and illustrated help. Six new animal portraits and care profiles bring the catalog to 30 species. The late economy is measured against repeat-visit scenarios in [the balance report](economy-balance.md), with roughly twenty growing/trading hours as the ordinary target and faster/slower strategies possible.

Validation: build, 86 unit tests, all 56 production browser scenarios across runs and 9 additional real plain-HTTP scenarios passed. The final menu-scroll and help spacing changes received focused reruns. The last broad suite was 55/56; the one remaining test accidentally tapped a fish while asserting empty-water behavior and passed after using clear water. New portraits, German labels and small portrait/landscape views were inspected. No deployment or physical-device installation/performance claim is made.

## Version 1.0.0 release additions

Paid food (1 coin, worms/insects 2), free creative feeding, active-play allowance (5/minute), recently-fed breeding, persisted glass and shore cleaning, staggered forest visitors, four rotating music themes, expanded species biology (30 × 7 bilingual sections) and 13 water topics. Homework/nature jobs are menu teasers only. See `tickets/008-release-polish.md` and `next-version-minigames.md`.
