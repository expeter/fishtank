# Playroom — v0.4.0

- [x] FT-401: drawn trails learned by willing nearby fish, persistent memories and replay.
- [x] FT-402: circle dance, gathering, bubble play and selectable playmates.
- [x] FT-403: indoor aquarium room; visiting woodland wildlife and beaver/regrowing sapling.
- [x] FT-404: icon-only localized dock, contextual controls without overlapping trays; introductory helper only.
- [x] FT-405: 12 new original animated decorations, visible helpers category, early snails/crabs and aquarium crustaceans.
- [x] FT-406: satiety, settled food, bottom feeding, gentle young-fish chasing and older resting.
- [x] FT-407: varied contextual sounds with reliable mute.
- [x] FT-408: persistent-save validation, phone/German layouts, new interactions and regression checks.

Learning and social behavior are playful game mechanics, not claims about all real species. The woodland coast is an imaginary estuary. Existing schema-1 saves remain valid; trail memory is optional and bounded to 96 normalized points.


## Review and acceptance evidence

- Paths are bounded to96points, meaningful gestures only; willing nearby fish learn, selected groups exclude other fish, and memory survives reopening. Short three-minute practice bouts avoid continuous mechanical loops. Replay works after the practice period. First lesson earns one saved decoration gift.
- Group games, German icon dock,36-item catalog, accessible aquarium helpers and one-tray-at-a-time editing pass phone browser checks. Buttons retain localized accessible labels and titles despite hidden visual text.
- Satiety, settled-food eligibility, social chasing/resting, group targets, path interpolation and malformed-save rejection are unit-tested. Existing saves without memories or gift state remain valid.
- Seven procedural sound families respect mute; active voices and queued phrases are stopped when muted.
- Rendered room, trails, bubble play and all12new toys were visually inspected. The beaver/fox/bird visits are decorative deterministic cycles, not an independent ecology simulation.

Screenshots: [indoor German phone](../screenshots/v0.4.0-german-room.png), [learned trail](../screenshots/v0.4.0-trail.png), [bubble game](../screenshots/v0.4.0-bubbles.png), [all new toys](../screenshots/v0.4.0-toys.png).

Physical phone installation, native audio and sustained device performance remain device-validation tasks. These checks use desktop Chromium with phone viewports and touch input.

Final checks: production build, **54 unit tests**, **36 unique production browser scenarios across coordinated runs**, and **4 additional non-secure HTTP tests** passed. Final editor-position CSS was checked with three focused phone/German-layout tests. The editor sits below the header and leaves the selected floor item visible.

Final layouts: [editing](../screenshots/v0.4.0-decor-edit.png), [scenery shelf](../screenshots/v0.4.0-decor-shelf.png).
