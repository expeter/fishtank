# Little Fishtank

A gentle, bilingual aquarium game. Three browser-local worlds, each with an aquarium and sea habitat. Progression and creative modes, 30 animal species, 36 decorations, naming, care, playful movement, breeding, photo export, sound, and offline installation.

## Run

```sh
npm install
npm run dev
```

Open the localhost URL printed by Vite. Build with `npm run build`, then serve `dist/` using any HTTPS static host. `npm run preview` previews that build locally.

## Check

```sh
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Browser tests use port 5179. To use an existing Chromium binary, set `FT_CHROMIUM=/path/to/chromium`.

## Deploy to fishtank.minizap.online

Upload the contents of `dist/` to the site's document root. Configure HTTPS and an index.html fallback for navigation. Do not cache `/version.json`, `/sw.js`, or `/index.html` at the CDN: serve them with `Cache-Control: no-cache`. Hashed `/assets/` files can use `Cache-Control: public, max-age=31536000, immutable`. Deploy the complete build atomically, keeping the previous asset files available until the upload completes.

For each release update the version in `package.json`, `src/game.ts`, and `public/version.json`, then build. The generated service worker precaches local assets, waits for user acceptance on updates, and preserves IndexedDB saves. A Save and update action appears in the menu when the version check finds a different release. Offline checks fail quietly.

No server database, API keys, account system, or analytics are required. Hosting credentials are not included. Browser storage belongs to the device and origin; clearing it deletes worlds. A previous valid snapshot is retained for recovery. Save-schema 1 is the initial schema; incompatible future schemas must be explicitly migrated before being written.

## Game rules

- Fish never die. Base growth continues while away (up to seven days per return); feeding/playing grants a two-minute double-growth boost.
- First fish mature in ten minutes, or five with continuous care. Later tiers take 30 minutes, two, four, six or twelve hours.
- Total sales unlock tiers at 150, 600, 1,800, 6,000, 20,000 and 60,000 coins. Food costs 1 coin per portion (worms/insects: 2); creative food is free. Active play grants 5 pocket-money coins each minute, without increasing lifetime sales. A bankrupt empty save receives a guppy.
- Same-species adults that have actually eaten within 30 minutes and have hunger at most 60 have a 35% breeding chance after a cooldown of half their growth time (at least five minutes) while open. No offline breeding. Fish and helpers share 24 places per habitat in both modes; existing over-capacity saves keep their residents. Decoration capacity is 150 per habitat.
- Slots 1, 2 and 3 are fixed small, medium and huge worlds, with matching sizes for their two habitats.
- `M` toggles sound outside text fields. Audio begins after interaction. Menu contains language, audio, reduced motion, installation help, and updates.

## Architecture

`src/game.ts` owns serializable simulation state and economy; `src/storage.ts` owns transactional IndexedDB snapshots; `src/Scene.tsx` draws and animates the habitats; `src/App.tsx` owns the responsive interface. All artwork is drawn locally; fonts are bundled. `scripts/pwa.mjs` generates the cache manifest from the production output.

Real-device Android/iPhone installation, native sharing, audio behavior, and sustained performance still require device validation. Automated desktop Chromium checks cannot substitute for those checks.

To run the offline production check, start `npm run preview -- --port 5180` after building, then run `FT_BASE_URL=http://localhost:5180 FT_PRODUCTION=1 npm run test:e2e`. The offline test is skipped against the development server because service workers are intentionally disabled there.

Validation completed in this workspace: 27 simulation/storage/interaction tests and 22 passing production browser tests, with scenarios covering buying, feeding, decoration placement, three independent slots, naming and selling, stable individual colors, baby discoveries and saved family links, step-by-step decoration undo with inventory conservation, PNG download, mobile layout, German language, cross-tab locking, offline restoration, full creative capacity, update notices and accepted-update save restoration, and storage-error handling. A full habitat measured about 60 FPS in headless desktop Chromium; this is not a phone performance measurement.

The requirement-by-requirement completion audit and remaining verification are recorded in [docs/FEATURE_AUDIT.md](docs/FEATURE_AUDIT.md).

Each animal’s saved seed determines its individual shade and subtle size variation. Animals born in the world also keep optional parent IDs (compatible with existing schema-1 saves). A short heart celebration and a baby notice make arrivals discoverable; reopening a save does not replay old birth notices. Decorating supports the last 50 edits of the current editing session, including movement, size, flip, layers, scenery and putting items away. Undoing a purchase puts the item in your collection and does not refund its coins.

Music suspends while the app is hidden and resumes according to the saved sound preference. M ignores repeated/modified shortcuts and typing in fields. Phones with native file sharing first show a prepared postcard so the Share tap has fresh browser activation; cancellation keeps the preview, and Save image remains available if sharing is refused. The shop shows progress toward the next collection unlock. Automated browser progression now exercises all tiers through ordinary buying, growing and selling.

The visual content review covers all 12 animals and 24 decorations. German portrait and landscape layouts support long names; fish positions rescale immediately when rotating. Fullscreen includes explicit unsupported/error feedback, and installation handles dismissed or rejected prompts and detects an already-installed app. Native installation and physical touch/audio/sharing remain device-validation tasks.

Autonomous behavior checks cover rendered feeding, pointer following, resting, continuous above-water jumps and frog mosquito catches. All six habitat scenery styles were visually reviewed and tested for persistence. The final production suite passed with `--workers=1`; use that option in memory-constrained environments. Earlier parallel renderer crashes did not recur in the sequential run.

## HTTP compatibility (v0.1.2)

Core gameplay and browser saves work on ordinary HTTP addresses as well as localhost/HTTPS. Missing `crypto.randomUUID` and Web Locks no longer block creating or opening worlds. The Web Locks fallback uses atomic IndexedDB leases, checks ownership on writes/deletion, and recovers ownership on a same-tab reload. Abandoned leases expire after 30 seconds. Existing save data needs no migration. Installation and offline service workers still require a secure browser context.

To reproduce the plain-HTTP checks, build, then start `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=fishtank.test npm run preview -- --port 5182`. In another terminal run:

```sh
FT_HTTP_TEST=1 FT_BASE_URL=http://fishtank.test:5182 npm run test:e2e -- tests/browser.spec.ts tests/compatibility.spec.ts tests/behaviors.spec.ts tests/decorating.spec.ts tests/progression.spec.ts --workers=1
```

The test configuration maps that hostname to localhost without making it a secure origin; the compatibility test explicitly verifies `isSecureContext === false`.

## Woodland coast overhaul — v0.2.0

Gameplay fills the browser viewport, including phone safe areas. A five-button dock selects Feed, Play, Decorate, Explore or Shop; settings and the field guide live in the hamburger menu. Fish taps show a brief peek, with naming/selling under Details. The shop opens as a compact bottom sheet with spendable coins separated from lifetime unlock earnings. The wallet and shop read the same save balance; purchases recheck funds within the state update to handle rapid taps.

Both habitats offer Small (one screen), Medium (1.6 screens) and Large (2.4 screens) widths, selected from the menu and saved per habitat. Drag with Explore, use its arrow buttons, or focus the canvas and press arrow keys. New decorations appear in the visible area. Existing schema-1 worlds default to Small without migration.

The woodland coast uses original canvas trees, a timber bridge, a fox and a kingfisher above deeper jewel-coloured water. Twelve additional animals bring the catalog to 24, including bettas, discus, zebrafish, rays and moon jellies. New arrivals pop into view as small animals; Creative retains the optional grown-up setting. Reduced motion also disables interface transitions.

The English/German field guide contains 24 illustrated animal entries with observation prompts and six biology/water articles. Articles link to NOAA Fisheries, Monterey Bay Aquarium and the California Academy of Sciences. The guide distinguishes this imaginary mixed habitat from real animal-care needs.

Tickets and acceptance evidence: [FT-201–FT-208](docs/tickets/002-phone-world-overhaul.md). The stage fills the page on HTTP too; hiding the phone browser's own chrome still uses supported fullscreen or installation.


## Living Cove (v0.3.0)

Phone shops are short horizontal shelves; fish naming uses a compact card. These trays leave the exposed water touchable. Pip, an original otter character, offers a dismissible naming/picnic/garden story. Story progress and names stay with each world.

Fish have stable individual coats, silhouettes and tails. Food drops vary in shape, colour, scatter and movement. Appetite, curiosity and reaction delays determine who approaches; care improves only when an animal actually eats. A persistent 24-minute storybook day brings moonlight, stars and changing weather. The woodland includes varied trees, a bridge, flowers, mushrooms and watching animals; bubbles have different origins and lifecycles.

Optional food-chain play is off by default and requires confirmation in Settings. During active play only, some grown fish can eat unnamed, home-born young of another species. Named animals, purchased animals and the last two residents are protected. This is a simplified game mechanic.

An occupied world explains that it is open in another tab or app window on this device and offers **Play here**. This transfers saving permission, fences writes from the old window, and reloads the latest saved state. Normal reloads reclaim their own relinquished lease. All current browsers use the same IndexedDB ownership mechanism, including HTTP without Web Locks.

Feedback tickets: [FT-301–FT-308](docs/tickets/003-living-cove.md).

## Playroom (v0.4.0)

Choose the hand to play, then tap one fish. Its centered card offers drawing, remembered trails, a circle dance, coming closer and bubble play. A selected fish responds even when shy; its halo, activity badge and trail show the current focus. Learned shapes persist across saves, with short practice bouts for three minutes. The first lesson earns a decoration for the current habitat's collection; later lessons improve mood and briefly boost growth.

The main dock uses steady, labeled-for-accessibility icons. Decorating trays hide the editing controls, and contextual play/edit controls hide the camera shortcuts where they would overlap. Pip is available on demand through Menu → How to play → Meet Pip. There is no automatic introductory overlay.

The aquarium sits inside a room with books, wallpaper, a framed drawing and toys. Woodland foxes and birds visit and leave; a beaver chews a branch alongside a regrowing sapling. These are deterministic decorative wildlife cycles. Fish have age-dependent resting and gentle young-fish chasing. Full fish ignore food; up to 200 crumbs settle on the bottom for two minutes, where hungry bottom feeders can eat them.

There are 36 decorations, including 12 original playthings: a pineapple cottage, submarine, slide, bubble hoop, mushroom house, diving helmet, lighthouse, kelp maze, shell swing, whale mailbox, moon observatory and carousel. A **Little helpers** shop category makes snails, crabs, shrimp and frogs easier to find. Snails/crabs unlock immediately; aquarium worlds can also include crabs and shrimp in this imaginary mixed habitat. Seven short procedural sound families vary feeding, play, learning, bubbles, shopping, placing and greetings.

Implementation and verification: [FT-401–FT-408](docs/tickets/004-playroom.md).


## Focus and discovery (v0.5.0)

Fish interactions now focus on one selected animal. The bilingual explorer book includes 24 species profiles with lifespan, social needs, water, food and care notes, accessible directly from a fish card without external links. Five food tools offer flakes, pellets, worms, insects and algae wafers. Snails crawl on the floor and aquarium glass; optional glass wiping and a persistent air-pump switch add aquarium activities.

Postcards open an editable greeting composer and include the world name and capture date/time in both the image and a unique filename. Editing the greeting preserves the original captured scene. The welcome screen uses dark text on light save cards and offers installation immediately, with browser instructions when a native installation prompt is unavailable.

Implementation and verification: [FT-501–FT-507](docs/tickets/005-discovery.md).


## Quiet phone controls (v0.5.1)

A centered bottom dock anchors every tool. Tap Feed to open the food choices immediately above it; choosing a food collapses the row, retains the active food and changes the dock icon. Tap Feed again to change it. Play actions also close their controls when started, while the fish keeps its activity and highlight. Tapping Play reopens its choices.

Worlds open without tutorial paragraphs, automatic helper speech or an expanded food tray. Help and Pip remain available in the menu. Shop/decorating controls replace the current choices, and closing the shop does not unexpectedly reopen food options. Existing worlds remain compatible.

Build, 66 unit tests and 12 targeted browser scenarios passed. Responsive checks cover German at 320×568, 393×851 and 851×393, including aligned trays, 44px food touch targets, retained choices and no horizontal overflow. This is browser emulation, not a physical Pixel test. See [FT-601–FT-604](docs/tickets/006-quiet-phone.md).


## Mobile workbench and longer discovery (v0.6.0)

The lower controls hold habitat icons on the left and coins/animal count on the right, with the menu between them. Camera, fullscreen and sound actions are available in that menu. Fish circles and replayed trails continue until changed or stopped, including while using other tools; their dialogs close on selection. Bubble play places a bubble where you tap, waits for the selected fish to arrive, then floats upward.

Decorating uses a narrow side panel, 0.3×–4× size, rotation, reachable transformed items and an Add another action that copies their appearance. Shovel/eraser brushes add and partially remove saved sand, with stroke undo. Creative shops have large Baby/Grown-up choices. Help contains matching pictures for activity badges and tool icons.

Six premium species have original artwork and bilingual in-app care entries: pearl gourami, Boesemani rainbowfish, black ghost knifefish, regal angelfish, Achilles tang and zebra shark. Late-game prices are 2,000, 8,000 and 24,000 coins. Ordinary repeat-visit simulations reach the final tier around twenty hours of growing and trading; this is not twenty guaranteed hours of hands-on play, and offline growth or strategies change the result. See [balance scenarios](docs/economy-balance.md).

Tickets and validation: [FT-701–FT-708](docs/tickets/007-mobile-workbench.md).


Validation for v0.6.0: production build, 86 unit tests, 56 production browser scenarios across coordinated runs, and 9 real plain-HTTP scenarios passed. Final targeted checks cover help, the species book and the small-screen editor. Native phone installation and physical-device performance still need device testing.

## License

Copyright © 2026 expeter. Released under the [MIT License](LICENSE).

## Publishing

GitHub Pages workflow builds and publishes `dist` from `main`. Set Pages source to GitHub Actions and the custom domain to `fishtank.minizap.online`; enable HTTPS when its certificate is ready. Local `.env` credentials are never part of the site or repository.

## First public release (v1.0.0)

Paid food and active-play pocket money, recently-fed breeding, persistent optional window/shore cleanup, staggered woodland visitors, four rotating original music themes and expanded bilingual species chapters. Homework and environmental mini-jobs are teasers only; see [next-version planning](docs/next-version-minigames.md).

Release validation: 97 unit tests, production build and 61 browser scenarios across full/focused runs. Phone-width English/German book chapters and first-open offline book loading are covered. Physical-device installation/audio/performance still need device testing.

Live release: [fishtank.minizap.online](https://fishtank.minizap.online). GitHub Pages deployment and live HTTPS phone-sized browser smoke test passed: world creation, fullscreen manifest and offline book, no JavaScript errors.

## Version 1.0.1: visible language choice and fresh online launches

German/English flag buttons appear on the start screen and game menu; the choice persists and otherwise follows browser language. The start screen shows the current version. New offline workers activate without forcing a running game to reload. Reopening online fetches fresh HTML; offline launches use the precached matching shell/assets. The previous asset cache remains available for older open tabs. Saves are never cleared by updates. The save/update button also handles an already-active worker and reports network failures separately from save failures.
