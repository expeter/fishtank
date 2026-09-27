# Focus, discovery and postcards — v0.5.0

- [x] FT-501: one fish offers play; direct centered fish card; explicit focus always responds; halo, activity badge and learned-path preview.
- [x] FT-502: a complete in-app bilingual species guide with real-care notes, lifespan, groups, environment, diet and facts; direct selected-species access; no outgoing links.
- [x] FT-503: five visually distinct food types with preferences, satiety and surface insects for frogs.
- [x] FT-504: editable postcards with frozen habitat photo, world name, localized capture timestamp and unique filenames; download and native-share paths.
- [x] FT-505: grounded snail movement and glass climbing/cleaning, optional window-cleaning toy, persistent air-pump control.
- [x] FT-506: verify rendered single-fish actions, focused learning, guide coverage, food tools, postcard pixels/metadata, pump persistence and regressions.

- [x] FT-507: readable phone welcome cards and an immediate, dismissible installation invitation with native-prompt or manual-instruction paths.

The user added the guide/food, postcard and snail/pump requests during the single-fish interaction pass; all are part of this release. Physical animal care remains distinguished from fantasy game rules. Source URLs are retained in developer documentation, not as outgoing in-game navigation.

## Acceptance evidence

Production build and 66 unit tests passed. 45 unique production browser scenarios passed across coordinated sequential runs, including three new welcome checks; 7 additional plain-HTTP scenarios passed. Renderer crashes in the broad run required isolated reruns, so this is not a claim of one uninterrupted suite pass. The final welcome CSS change was rebuilt and all three welcome checks passed again.

Phone welcome checks cover German at 320/390px, save-card and installation text contrast of at least 4.5:1, no horizontal overflow, manual installation instructions, native prompt only after a tap, dismissal, and installed-app entry. Audio/native-postcard scenarios also passed against the integrated welcome build.

Reviewed screenshots: [320px welcome](../screenshots/v0.5.0-welcome-320.png), [390px welcome](../screenshots/v0.5.0-welcome-390.png), [centered fish actions](../screenshots/v0.5.0-attention-card.png), [learned trail](../screenshots/v0.5.0-attention-trail.png), [species care](../screenshots/v0.5.0-species-care-book.png), [German food tools](../screenshots/v0.5.0-german-food-types.png), [personal postcard](../screenshots/v0.5.0-personal-postcard.png).

Physical Android/iPhone installation, native sharing/audio and sustained device performance still need real-device validation. Native prompt events in automated tests are simulated.
