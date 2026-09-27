# Shop colour palettes

Reviewed 2026-09-27. `src/fishVariants.ts` is a closed species-specific palette list. The game offers stylised natural colour combinations, not a hue wheel or an exhaustive catalogue of breeding strains. RGB values are artistic approximations. Generic helper/family sprites remain explicitly generic as described in `knowledge-sources.md`; a palette does not establish an exact species identity or husbandry recommendation.

## Multiple choices

- **Guppy:** grey/olive ground with orange, blue-iridescent or yellow ornaments and dark spots. These are simplified wild colour patterns, not named domestic strains or all-over solid-colour fish. [Primary pigment study](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0085647); [field population study](https://pmc.ncbi.nlm.nih.gov/articles/PMC4749237/).
- **Goldfish:** olive and gold, both observed in wild/established populations. Goldfish themselves have a domestication history; this does not assert that ornamental breeds are ancestral wild forms. [USGS species profile](https://nas.er.usgs.gov/queries/GreatLakes/FactSheet.aspx?Species_ID=508).
- **Discus:** brown with blue markings and blue/brown. Wild discus taxonomy is disputed; the game uses the existing genus-level identity and does not present the choices as separate subspecies. [University of Florida IFAS discus account](https://ask.ifas.ufl.edu/publication/FA166).
- **Seahorse:** pale yellow with dark spots, or dark. Modelled on *Hippocampus kuda*, whose colour can change; a shop colour is held stable in the game rather than simulating physiological colour change. [University of Michigan ADW account](https://animaldiversity.org/accounts/Hippocampus_kuda/).

- **Clownfish:** orange/white and the naturally occurring black/white Darwin form of *Amphiprion ocellaris*. [Australian Museum species account](https://australian.museum/learn/animals/fishes/western-clown-anemonefish-amphiprion-ocellaris-cuvier-1830/).

## Single conservative palettes

All other shop animals have one fixed palette, retaining their species-identifying marks instead of generating random contrasting marks. No fluorescent engineered danios, designer clownfish or solid fancy betta colours are offered.

- Wild betta: muted brown with blue-green iridescence and reddish fins. [ADW](https://animaldiversity.org/accounts/Betta_splendens/), [SEAFDEC wild-betta review](https://repository.seafdec.org/bitstream/handle/20.500.12066/5522/SP17-2.pdf?isAllowed=y&sequence=1).
- Swordtail: greenish body and reddish-brown lateral stripe. [FishBase species diagnosis](https://www.fishbase.net.br/summary/3231).
- Angelfish: silver with dark vertical bands. [ADW species photographs](https://animaldiversity.org/accounts/Pterophyllum_scalare/pictures/).
- Marine ray sprite: sandy body and blue spots, based on the bluespotted fantail ray. [Australian Museum](https://australian.museum/learn/animals/fishes/bluespotted-fantail-ray-taeniura-lymma-forsskal-1775/).
- Clownfish: orange/white. [Monterey Bay Aquarium](https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/clownfish).
- Other fixed palettes use the natural species appearances and identification material listed in [the existing research ledger](knowledge-sources.md): neon tetra blue/red, blue tang blue/yellow, butterflyfish yellow/white, zebrafish pale gold/blue stripes, bronze cory, olive platy, mandarinfish blue/orange, royal gramma purple/yellow, firefish white/red, sandy spotted marine puffer, translucent moon jelly, pearl gourami beige/pearl, Boesemani blue/gold, black ghost black/white, regal angelfish golden/blue bands, Achilles tang dark/orange, zebra shark sand/brown with age-dependent stripes/spots. Generic snail, frog, shrimp and crab receive muted brown/olive/translucent palettes, without invented alternative colour morphs.

## Persistence and testing

Fish save an optional species-validated `variant` ID. Newly created animals use a deterministic natural default; buying passes the selected ID explicitly. Body colour and marking palette do not vary with random behaviour seeds. Preview and aquarium share `drawFish`. Existing fish without a variant keep their legacy appearance unchanged. Prices, unlocks and animal limits remain enforced by `buyFish`. Source links stay outside the children's UI.
