# Three common freshwater additions

Reviewed 2026-09-28. These are original bilingual summaries, not copied care sheets. Palette values are hand-chosen illustrations of documented natural colour families, not colourimetric measurements. No arbitrary rainbow morphs, balloon bodies, long-fin strains or albino varieties are offered. Real aquarium stocking is separate from the fictional shared game habitat.

## Molly — Poecilia sphenops

- [US Fish and Wildlife Service ecological summary](https://www.fws.gov/sites/default/files/documents/Ecological-Risk-Screening-Summary-Mexican-Molly.pdf), especially PDF page 6: wild dull silver, dark dots and yellow fin edges; short-finned body, grazing mouth and livebearing biology. Supports the single silver/freckled palette. This government synthesis explicitly notes identification/range uncertainties within the molly group; the entry therefore avoids a sweeping precise range claim.
- [Tetra's own care profile](https://blog.tetra.net/en-en/black-molly-poecilia-sphenops/): the black form is cultivated; approximately 6–10 cm, up to five years, 100 L, harder water and pH 7.2–8.2. Although this page discusses black mollies, the entry uses only basic species husbandry, not its cultivated palette.
- [Aquarium Co-Op's husbandry guide](https://www.aquariumcoop.com/blogs/aquarium/molly-fish-care): 24–27 °C, mineral-rich water, mixed-sex ratio, varied plant-rich diet, food competition and distinctions between species/hybrids. The page's anecdotal disease explanations are not repeated.

## Harlequin rasbora — Trigonostigma heteromorpha

- [Aquarium Co-Op's own care guide](https://www.aquariumcoop.com/blogs/aquarium/rasbora-hets-and-espei-rasboras-great-for-planted-aquariums): pinkish-brown/copper body, black wedge, distinction from the orange lambchop rasbora, groups of at least six, small omnivore foods and timid schooling behaviour. Supports one copper-and-black palette.
- [Seriously Fish species account](https://www.seriouslyfish.com/species/trigonostigma-heteromorpha/): 45 mm standard length, 60 × 30 cm aquarium base, forest-stream habitat, 21–28 °C and soft-to-moderately-hard water, leaf-underside egg deposition and no parental care. The in-app 22–27 °C is a conservative interval within this published range. Natural-history/discovery text primarily draws on this account; base social/food and palette text uses Aquarium Co-Op. No unsupported exact lifespan is supplied.

## Cherry barb — Puntius titteya

- [Aquarium Co-Op's own husbandry guide](https://www.aquariumcoop.com/blogs/aquarium/cherry-barb): red males, tan-red females, shared dark side stripe, 5 cm, groups of six or more, female-biased mixed groups, 22–27 °C, small varied omnivore foods and egg predation. Supports red and warm-brown natural palettes. Labels describe colour and do not assign the game's animal a biological sex.
- [Seriously Fish species account](https://www.seriouslyfish.com/species/puntius-titteya/): Sri Lankan shaded stream habitats, planted accommodation, 60 × 30 cm aquarium base, adaptable captive fish at pH 6–8, anatomy/sexual colour differences and egg-scattering reproduction. Natural-history/discovery paragraphs draw primarily on this account; base care and palette facts primarily use Aquarium Co-Op. No unsupported precise lifespan is supplied.

The English and German care/discovery summaries jointly remain within the combined source budgets per species, with no single page used for more than 200 derived words. Shared generic advice (plan long-term care, avoid unsuitable neighbours, game tanks are fictional) is independently written guidance.

## Integration

`src/extraFish.ts` has only type imports. Exports:

- `extraFishDefinitions`: `molly` tier 2, `harlequin` tier 2, `cherry_barb` tier 1; all aquarium.
- `extraFishVariants`: stable palette IDs `silver`, `copper`, and `cherry`/`tan`.
- `extraFishKnowledge`: complete English/German base-care profiles.
- `extraFishDiscovery`: complete English/German seven-question biology chapters.

Merge these into the four existing registries, add FieldGuide observation prompts, and add species-specific drawing branches for a short-finned molly, a broad rear black wedge, and a horizontal cherry-barb stripe. Rendering should retain the selected palette rather than assigning random hue shifts. No version or deployment changes are part of this module.
