# Living cove — feedback pass v0.3.0

- [x] FT-301: recover an occupied save with clear information and an explicit Play here action; prevent old tabs from overwriting the transferred world.
- [x] FT-302: replace obstructive panels with compact nonmodal phone trays; keep water tappable; make fish naming immediate and friendly.
- [x] FT-303: add Pip the otter and a gentle persistent story about naming, feeding and making a home, with dismissible short prompts.
- [x] FT-304: individual feeding decisions, varied scatter/food shapes and actual per-fish eating rather than whole-tank feeding.
- [x] FT-305: stronger individual fish variations and cute character details.
- [x] FT-306: opt-in predator behavior, off by default, with clear consequences, no offline losses and no graphic effects.
- [x] FT-307: day/night and weather, varied bubbles, richer non-repeating woodland scenery and wildlife.
- [x] FT-308: verify smartphone layouts, play beneath trays, save recovery across tabs, naming and story persistence, feeding variability and opt-in ecology.

User explicitly authorized parallel agents for this pass. Work is split by ownership: save recovery; fish life; living scenery; root integration/interface/story and verification.

## Implementation notes

The save owner is an IndexedDB lease on all origins. Explicit transfer fences old-tab writes; a document-specific relinquishment hint permits immediate reload. Existing save schema remains readable and new story/ecology fields are optional.

Shops and friend cards are nonmodal trays. Pip stays out of decorating/exploration controls. Animal appearance, food choices, weather and bubbles are deterministic where persistence matters, with individually varying reactions. Food-chain play is checked only during active foreground play, never offline catch-up.

The release remains a browser game with full-viewport play; installed mode and supported fullscreen hide browser chrome. Physical iPhone/Android touch feel, audio and installation still require device checks.

## Acceptance evidence

- **FT-301:** two browser transfer scenarios cover immediate reload, explicit takeover, fenced old-tab writes, purchases surviving reload, and transfer back; four storage-lock unit tests cover fencing/expiry.
- **FT-302/303:** phone shelf test measures height <=300px and sends a real touch through uncovered water; naming-card test names Bubbles, advances Pip to the picnic chapter, and reopens the saved name. Pip disappears during decorating/exploring, and his animated artwork has a stationary button.
- **FT-304/305:** deterministic unit coverage verifies varied food, delayed individual responses, five stable coat styles and changing proportions. Rendered browser checks verify approaching food, actual eating, saved hunger changes and touch selection.
- **FT-306:** default-off setting, confirmation, persistence and switching off pass browser checks. Unit tests exercise events plus protection for named/purchased animals, same-species fry, small populations and offline periods.
- **FT-307:** environment tests cover persistent time/weather and changing bubble lifecycles. All six scenery styles pass browser checks. Phone day/night captures were inspected.
- **FT-308:** production build and 44 unit tests pass. Browser scenarios were verified in coordinated single-worker runs; initial failures exposed Pip interaction bugs and obsolete feeding assertions, which were fixed. Some renderer crashes in the larger run required isolated reruns; they are not counted as successful checks.

Review images: [shop](../screenshots/v0.3.0-shop.png), [naming](../screenshots/v0.3.0-naming.png), [fish peek](../screenshots/v0.3.0-peek.png), [woodland day](../screenshots/v0.3.0-coast-day.png), [woodland night](../screenshots/v0.3.0-coast-night.png).

Final validation: **44 unit tests, 32 unique production browser scenarios across coordinated runs, and 3 additional real non-secure HTTP compatibility/recovery scenarios passed.** Production build passed.
