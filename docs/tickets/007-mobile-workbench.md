# Mobile workbench and longer discovery — v0.6.0

- [x] FT-701: remove assignment expiry; close play controls on action; tap-placed bubbles wait for the chosen fish and rise; retain assigned circle/path while other tools are used.
- [x] FT-702: move status/habitat/menu controls below the scene; clear permanent forest obstructions; secondary camera/fullscreen/sound actions in menu.
- [x] FT-703: fixed slot sizes small/medium/huge; 24 shared fish/helper places per habitat; preserve old residents on migration.
- [x] FT-704: large creative-age buttons, side decorating panel, expanded scale/rotation, repeated-item placement and transformed hit testing.
- [x] FT-705: local sand add/remove brushes, bounded save data, per-stroke undo and terrain-aware bottom residents.
- [x] FT-706: illustrated bilingual help matching the actual fish badges and tools.
- [x] FT-707: six premium species with individual artwork and complete in-app care entries; three extra economy tiers, measured roughly-20h scenarios and breeding safeguards.
- [x] FT-708: integrated build, unit/browser checks, art and responsive screenshot review.

The target progression duration is a scenario estimate for growing/trading across sessions, not a forced timer or a promise of twenty hours of active screen time. See [balance methodology](../economy-balance.md). Physical-phone performance, native installation and OS sharing still require device validation.

## Verification

Production build and 86 unit tests pass. All 56 production browser scenarios were verified across runs: the broad final run passed 55; its empty-water shelf check had tapped a randomly positioned fish, so the test now taps clear water and passes. The final panel-scroll changes passed 13 focused checks. Nine additional real plain-HTTP scenarios passed for save compatibility, postcards, slot sizes, capacity, sand, help and premium care entries. Final help spacing was rebuilt and its narrow-phone check passed.

Phone review covers 320×568, 393×851 and landscape 851×393. The habitat reserves a lower control strip, keeping both the forest and sand visible. Fish cards sit above it. Rotation hit testing and transformation bounds have unit coverage. Circle/path browser checks run past the former eleven-second cutoff and continue after switching to food; bubble taps bypass fish dialogs and visibly move the fish upward.

The new-fish atlas exposed portrait clipping; species-aware framing fixes it. All six silhouettes now pass transparent-border and German-label overflow checks. Screenshots: [small coast](../screenshots/v0.6.0-workbench-slot-0.png), [huge coast](../screenshots/v0.6.0-workbench-slot-2.png), [side editor](../screenshots/v0.6.0-workbench-editor.png), [sand brush](../screenshots/v0.6.0-workbench-sand.png), [six new species](../screenshots/v0.6.0-late-six-atlas.png), [illustrated help](../screenshots/v0.6.0-illustrated-help.png).
