# Phone-world overhaul — v0.2.0

- [x] FT-201 Wallet: show spendable balance consistently in HUD/shop; distinguish lifetime unlock earnings; guard rapid purchases; verify buy/sell/reload.
- [x] FT-202 Phone stage: edge-to-edge viewport, safe-area support, no surrounding website chrome; icon dock and hamburger; sheets opened only on demand.
- [x] FT-203 Interaction: persistent Feed/Play/Explore tools, brief fish peek with optional details; compact shop, sound and motion feedback.
- [x] FT-204 Art: original illustrated woodland-coast direction, strong ink contours, saturated jewel water, timber controls; trees, bridge and watching wildlife.
- [x] FT-205 Exploration: saved Small/Medium/Large per-habitat sizes; larger worlds pan with Explore tool and keyboard; bounded camera and position-aware interactions.
- [x] FT-206 Animals: expand from 12 to 24 animals with distinct markings/shapes; babies arrive small with a pop animation.
- [x] FT-207 Field guide: English/German animal and water-learning cards with primary-source links; clearly separate fantasy mixing from real animal care.
- [x] FT-208 Verification: phone portrait/landscape layout, plain-HTTP startup, coin flow, tools, pan/size persistence, guide, shop and existing save compatibility.

Design decision: the sea becomes a sheltered woodland coast, preserving saltwater animals; the aquarium stays a separate habitat. Small fits on screen, Medium spans 1.6 screen widths, Large 2.4. Explore pans without accidental feeding or decorating. Fish details and management remain available by explicit choice.

Status: implemented in v0.2.0.

## Acceptance evidence

| Ticket | Evidence |
| --- | --- |
| FT-201 | Phone flow verifies 100 → 80 after buying → 90 after selling and after reload. A burst of 12 purchase taps spends only the available 100 coins and adds exactly five animals. |
| FT-202 | 390×844 stage equals the viewport height; 844×390 landscape stays within the viewport. Installed manifest prefers fullscreen with standalone fallback. Physical device installation remains a release check. |
| FT-203 | Touch taps preserve the selected tool; fish tap displays a compact peek and no management dialog until Details. Interface, feeding and purchase tones obey mute. |
| FT-204 | Original procedural trees, bridge, fox and kingfisher; saturated water and fish, timber icon dock; catalog and phone screenshots reviewed. |
| FT-205 | Large size persists after save/reload; pointer dragging and keyboard move the view; decorations are placed at the visible view centre. Unit coverage includes all sizes and existing saves without a size field. |
| FT-206 | 24 unique catalog IDs, 12 per habitat, all rendered; distinct new silhouettes/markings. Small arrivals animate into the scene; reduced motion disables the pop. |
| FT-207 | 24 illustrated observation entries, six bilingual biology/water articles, primary-source links and distinction between fantasy habitats and real animal care. |
| FT-208 | 33 unit tests and a fresh complete 27-scenario production run pass. The preceding 16 plain-HTTP scenarios also passed, including the camera-placement check. Offline reload/update protections retained. Full tank measured about 60 FPS in desktop headless Chromium. |

## Review images

- [Woodland coast](../screenshots/v0.2.0-coast.png)
- [Brief fish info](../screenshots/v0.2.0-peek.png)
- [Compact shop](../screenshots/v0.2.0-shop.png)
- [Field guide](../screenshots/v0.2.0-guide.png)

## Compatibility and limits

The habitat key remains `sea` so existing saves keep their animals and decoration ownership. Missing world sizes default to Small. The game fills the viewport on plain HTTP; browser chrome is controlled by the browser and is removed through supported fullscreen or installed-app mode. Automated touch tests emulate phone input; physical Android/iPhone installation, sound output and touch feel are not claimed as verified. Hosting deployment is unchanged.

## Final completion audit — 2026-09-27

Rechecked each requested feedback item against current source, the packaged version/manifest, rendered screenshots and the tests that exercise it. All eight implementation tickets are complete. The current production suite passed 27/27, unit tests passed 33/33, and full-capacity rendering measured 60.6 FPS in desktop Chromium. Physical-device release checks remain explicitly outside these automated claims.
