import "./book.css";
import { fishDiscovery, fishKnowledge } from "./fishKnowledge";
import { useEffect, useRef, useState } from "react";
import { animals, type Lang } from "./game";
import Artwork from "./Artwork";
const topics = [
  {
    en: "How do fish breathe?",
    de: "Wie atmen Fische?",
    text: "Fish use gills to take oxygen from water. Their fins help them swim and steer. Look for the gill cover behind a fish’s eye.",
    deutsch:
      "Fische nehmen mit ihren Kiemen Sauerstoff aus dem Wasser auf. Flossen helfen beim Schwimmen und Steuern. Suche den Kiemendeckel hinter dem Auge.",
    source: "California Academy of Sciences",
    url: "https://www.calacademy.org/educators/lesson-plans/fish-forms",
  },
  {
    en: "Where river meets sea",
    de: "Wo Fluss und Meer sich treffen",
    text: "An estuary mixes river water with salty seawater. Many young animals find shelter there. Our woodland coast is an imaginary place, inspired by sheltered coastal water.",
    deutsch:
      "In einer Flussmündung mischen sich Süßwasser und salziges Meerwasser. Viele Jungtiere finden dort Schutz. Unsere Waldküste ist ein Fantasieort, inspiriert von geschütztem Küstenwasser.",
    source: "NOAA Fisheries",
    url: "https://www.fisheries.noaa.gov/national/habitat-conservation/estuary-habitat",
  },
  {
    en: "A clownfish’s safe home",
    de: "Das Zuhause des Clownfischs",
    text: "Clownfish live among anemone tentacles. A special mucus layer protects them from the stings. The anemone gets food scraps from its fish visitor.",
    deutsch:
      "Clownfische leben zwischen den Tentakeln von Anemonen. Eine besondere Schleimschicht schützt sie vor Nesselstichen. Die Anemone bekommt Futterreste von ihrem Mitbewohner.",
    source: "Monterey Bay Aquarium",
    url: "https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/clownfish",
  },
  {
    en: "A jelly is not a fish",
    de: "Eine Qualle ist kein Fisch",
    text: "Jellies have no bones or fins. They have no brain either! Their bodies are very different from the fish swimming beside them in this game.",
    deutsch:
      "Quallen haben weder Knochen noch Flossen. Auch ein Gehirn haben sie nicht! Ihr Körper ist ganz anders als der ihrer Fisch-Nachbarn in diesem Spiel.",
    source: "Monterey Bay Aquarium",
    url: "https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/jellies",
  },
  {
    en: "Into the blue",
    de: "Ab in die Tiefe",
    text: "Far below the surface, there is little or no sunlight. Some deep-sea animals use dark colours to hide; others reflect the faint light with silvery skin.",
    deutsch:
      "Weit unter der Oberfläche gibt es kaum oder kein Sonnenlicht. Manche Tiefseetiere tarnen sich mit dunklen Farben, andere spiegeln das schwache Licht mit silbriger Haut.",
    source: "Monterey Bay Aquarium",
    url: "https://www.montereybayaquarium.org/animals-the-ocean/ecosystems/deep-sea",
  },
  {
    en: "A travelling fish",
    de: "Ein Fisch auf Reisen",
    text: "Atlantic salmon can move from rivers to the ocean. As young salmon prepare to leave, their gills and other organs change to cope with saltwater. Not every fish can do this!",
    deutsch:
      "Atlantische Lachse können vom Fluss ins Meer wandern. Vor der Reise verändern sich ihre Kiemen und andere Organe, damit sie mit Salzwasser zurechtkommen. Das kann nicht jeder Fisch!",
    source: "NOAA Fisheries",
    url: "https://www.fisheries.noaa.gov/species/atlantic-salmon",
  },
  {
    en: "Flakes, worms or algae?",
    de: "Flocken, Würmchen oder Algen?",
    text: "Fish have different diets. Flakes and pellets can be balanced staples when chosen for the species. Larvae and small crustaceans are animal foods; algae-based wafers suit animals that need plant-rich food. Bottom feeders need food that reaches them. Our game worms and insects are playful symbols, not a feeding plan.",
    deutsch:
      "Fische fressen unterschiedlich. Passende Flocken und Granulate können Hauptfutter sein. Larven und kleine Krebstiere liefern tierische Nahrung; Algenfutter eignet sich für Tiere mit pflanzenreicher Kost. Bodenbewohner brauchen Futter, das bei ihnen ankommt. Würmchen und Insekten im Spiel sind vereinfachte Symbole, kein Futterplan.",
    source: "Tetra",
    url: "https://blog.tetra.net/de-de/das-richtige-fischfutter/",
  },
  {
    en: "Small portions, clean water",
    de: "Kleine Portionen, sauberes Wasser",
    text: "In a real tank, uneaten food can spoil the water. Match portion size and food to the animal. Ask an adult to check the species profile with you. The game never makes pets ill from leftover crumbs.",
    deutsch:
      "Im echten Aquarium können Futterreste das Wasser belasten. Menge und Futter müssen zum Tier passen. Prüfe das Artenporträt mit Erwachsenen. Im Spiel werden die Tiere von Futterresten nicht krank.",
    source: "OATA",
    url: "https://ornamentalfish.org/what-we-do/advice-information/care-sheets/caresheets-tropical-freshwater-fish/how-to-look-after-barbs/",
  },
  {
    en: "The invisible cleaning team",
    de: "Das unsichtbare Putzteam",
    text: "Fish waste releases ammonia. Helpful microbes on filter material and other surfaces change it first into nitrite, then nitrate. Ammonia and nitrite can harm fish even when water looks clear. A new real aquarium needs time and water tests with an adult; switching on its pump is not the same as having an established ecosystem.",
    deutsch:
      "Fischausscheidungen liefern Ammoniak beziehungsweise Ammonium. Hilfreiche Mikroben auf Filtermaterial und anderen Flächen wandeln es zuerst in Nitrit, dann Nitrat um. Schädliche Stoffe können auch in klarem Wasser stecken. Ein neues echtes Aquarium braucht Zeit und Wassertests mit Erwachsenen; eine laufende Pumpe bedeutet noch kein eingespieltes Ökosystem.",
    source: "Aquarium Co-Op",
    url: "https://www.aquariumcoop.com/blogs/aquarium/nitrogen-cycle",
  },
  {
    en: "A garden under water",
    de: "Ein Garten unter Wasser",
    text: "Living plants offer hiding places and use nutrients as they grow. Their leaves break up sight lines, so shy fish can retreat from busy neighbours. Plants need suitable light and care too. A plastic leaf can be a game decoration, but it does not grow or take up nutrients like a real plant.",
    deutsch:
      "Lebende Pflanzen bieten Verstecke und nutzen beim Wachsen Nährstoffe. Blätter unterbrechen Sichtlinien, sodass scheue Fische lebhaften Nachbarn ausweichen können. Auch Pflanzen brauchen passendes Licht und Pflege. Ein Plastikblatt kann Spieldekoration sein, wächst aber nicht und nimmt keine Nährstoffe wie eine echte Pflanze auf.",
    source: "Aquarium Co-Op",
    url: "https://www.aquariumcoop.com/blogs/aquarium/seasoned-fish-tank",
  },
  {
    en: "Tiny drifters, big food web",
    de: "Winzige Drifter, großes Nahrungsnetz",
    text: "Plankton drift with the water. Plant-like phytoplankton use sunlight to grow; animal zooplankton include tiny crustaceans and some young animals. Many larger creatures depend on them for food. A food web has many connected paths, so changes to tiny organisms can matter to much bigger animals.",
    deutsch:
      "Plankton treibt mit dem Wasser. Pflanzenähnliches Phytoplankton wächst mithilfe von Sonnenlicht; zum tierischen Zooplankton gehören kleine Krebstiere und manche Jungtiere. Viele größere Lebewesen fressen es. Ein Nahrungsnetz hat viele verbundene Wege: Veränderungen bei Winzlingen können deshalb auch große Tiere betreffen.",
    source: "NOAA",
    url: "https://oceanservice.noaa.gov/facts/plankton.html",
  },
  {
    en: "Resting with open eyes",
    de: "Ruhen mit offenen Augen",
    text: "Most fish cannot close eyelids like we do, but they still have quieter resting periods. Some hover; others shelter among plants or rocks. A resting fish is not asking to be poked awake. In the game, sleeping symbols are a friendly clue; real animals need an appropriate daily light and rest routine.",
    deutsch:
      "Die meisten Fische können keine Augenlider wie wir schließen, haben aber trotzdem ruhige Erholungsphasen. Manche schweben, andere suchen Pflanzen oder Felsen auf. Ein ruhender Fisch möchte nicht aufgeweckt werden. Im Spiel helfen Schlafsymbole; echte Tiere brauchen einen passenden täglichen Licht- und Ruherhythmus.",
    source: "NOAA Fisheries",
    url: "https://www.fisheries.noaa.gov/national/outreach-and-education/fun-facts-about-fascinating-fish",
  },
  {
    en: "Different ways to grow up",
    de: "Viele Wege zum Großwerden",
    text: "Guppies give birth to swimming young, while zebrafish scatter eggs. Angelfish can guard eggs; male seahorses carry developing young in a pouch. A moon jelly even has an attached polyp stage before its familiar swimming form. These are different life cycles, not one recipe for breeding every pet.",
    deutsch:
      "Guppys bringen schwimmende Junge zur Welt, Zebrabärblinge verstreuen Eier. Skalare können Eier bewachen; Seepferdchenmännchen tragen Nachwuchs in einer Bauchtasche. Ohrenquallen haben sogar ein festsitzendes Polypenstadium vor der bekannten Schwimmform. Das sind verschiedene Lebenszyklen, kein gemeinsames Zuchtrezept für alle Tiere.",
    source: "Species sources in knowledge-sources.md",
    url: "",
  },
];
const observations: Record<string, [string, string]> = {
  pearl_gourami: [
    "Find the pearl-like spots and long feelers.",
    "Suche die Perlenpunkte und langen Fühler.",
  ],
  rainbowfish: [
    "Which half is blue, and which half is orange?",
    "Welche Hälfte ist blau und welche orange?",
  ],
  ghostknife: [
    "Watch the long fin wave like a ribbon.",
    "Beobachte die lange Flosse: Sie wellt sich wie ein Band.",
  ],
  regal_angelfish: [
    "Count a few of its colourful stripes.",
    "Zähle ein paar seiner bunten Streifen.",
  ],
  achilles_tang: [
    "Can you find the orange patch beside its tail?",
    "Findest du den orangefarbenen Fleck am Schwanz?",
  ],
  zebra_shark: [
    "Watch its long tail; the baby's stripes become spots.",
    "Beobachte den langen Schwanz; aus Baby-Streifen werden Flecken.",
  ],
  guppy: ["Find the fan-shaped tail.", "Finde den fächerförmigen Schwanz."],
  goldfish: ["Follow the orange fins.", "Folge den orangefarbenen Flossen."],
  tetra: ["Spot the bright stripe.", "Entdecke den leuchtenden Streifen."],
  angelfish: [
    "Look at the tall triangular fins.",
    "Schau dir die hohen dreieckigen Flossen an.",
  ],
  snail: [
    "Watch the spiral shell move along the glass.",
    "Beobachte das Spiralhaus an der Scheibe.",
  ],
  frog: [
    "Wait for a mosquito to fly past.",
    "Warte, bis eine Mücke vorbeifliegt.",
  ],
  clownfish: ["Count the pale bands.", "Zähle die hellen Streifen."],
  tang: ["Can you find the yellow tail?", "Findest du den gelben Schwanz?"],
  butterfly: [
    "Find the dark band near the face.",
    "Finde den dunklen Streifen am Kopf.",
  ],
  seahorse: [
    "Look at the curled tail.",
    "Schau dir den eingerollten Schwanz an.",
  ],
  shrimp: ["Look for the long antennae.", "Suche die langen Fühler."],
  crab: ["Count the claws and legs.", "Zähle die Scheren und Beine."],
  betta: [
    "Watch the big flowing tail.",
    "Beobachte den großen wehenden Schwanz.",
  ],
  discus: [
    "Compare its round body with a zebrafish.",
    "Vergleiche den runden Körper mit einem Zebrabärbling.",
  ],
  zebrafish: [
    "Follow the stripes from head to tail.",
    "Folge den Streifen vom Kopf zum Schwanz.",
  ],
  cory: [
    "Look for the whisker-like barbels.",
    "Suche die schnurrhaarartigen Barteln.",
  ],
  swordtail: [
    "Find the long point on the tail.",
    "Finde die lange Spitze am Schwanz.",
  ],
  platy: ["Look at the dark spots.", "Schau dir die dunklen Flecken an."],
  mandarin: [
    "Follow the colourful winding stripes.",
    "Folge den bunten geschwungenen Streifen.",
  ],
  gramma: ["Where does purple change to yellow?", "Wo wird Lila zu Gelb?"],
  firefish: ["Find the tall dorsal fin.", "Finde die hohe Rückenflosse."],
  puffer: [
    "Compare the round shape with a long fish.",
    "Vergleiche die runde Form mit einem langen Fisch.",
  ],
  ray: [
    "Watch the broad fins flap like wings.",
    "Beobachte die breiten Flossen wie Flügel.",
  ],
  jelly: ["Watch the tentacles drift.", "Beobachte die schwebenden Tentakel."],
};
export default function FieldGuide({
  lang,
  initialSpecies,
}: {
  lang: Lang;
  initialSpecies?: string | null;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"animals" | "water">("animals");
  const [selected, setSelected] = useState<string | null>(
    initialSpecies ?? null,
  );
  const [habitat, setHabitat] = useState("all");
  const [topic, setTopic] = useState(0);
  const [chapter, setChapter] = useState<"care" | "biology">("care");
  useEffect(() => setChapter("care"), [selected]);
  const t = (en: string, de: string) => (lang === "de" ? de : en);
  const a = animals.find((a) => a.id === selected);
  const entry = topics[topic];
  useEffect(() => {
    contentRef.current?.closest(".modal")?.scrollTo(0, 0);
  }, [selected, tab, topic, habitat]);
  return (
    <div className="field-guide" ref={contentRef}>
      <h2>{t("The explorer’s field guide", "Das Entdeckerbuch")}</h2>
      <div className="guide-tabs">
        <button
          aria-pressed={tab === "animals"}
          onClick={() => setTab("animals")}
        >
          {t(`${animals.length} animals`, `${animals.length} Tiere`)}
        </button>
        <button aria-pressed={tab === "water"} onClick={() => setTab("water")}>
          {t("Water & biology", "Wasser & Biologie")}
        </button>
      </div>
      {tab === "animals" ? (
        a ? (
          <article className="guide-article">
            <button onClick={() => setSelected(null)}>
              ← {t("All animals", "Alle Tiere")}
            </button>
            <div className="guide-art">
              <Artwork animal={a.id} />
            </div>
            <h3>{a[lang]}</h3>
            <p className="species-scientific">
              {fishKnowledge[a.id]?.scientific}
            </p>
            <p>
              {a.habitat === "sea"
                ? t("Game habitat: woodland coast", "Spielwelt: Waldküste")
                : t("Game habitat: aquarium", "Spielwelt: Aquarium")}
            </p>
            <div
              className="book-chapters"
              role="group"
              aria-label={t("Animal chapters", "Tierkapitel")}
            >
              <button
                aria-pressed={chapter === "care"}
                onClick={() => setChapter("care")}
              >
                <span aria-hidden="true">01</span>
                {t("Care & home", "Pflege & Zuhause")}
              </button>
              <button
                aria-pressed={chapter === "biology"}
                onClick={() => setChapter("biology")}
              >
                <span aria-hidden="true">02</span>
                {t("Life & biology", "Leben & Biologie")}
              </button>
            </div>
            {chapter === "biology" && fishDiscovery[a.id] && (
              <section
                className="book-discovery"
                aria-label={t("Life & biology", "Leben & Biologie")}
              >
                <p className="book-prompt">
                  {t(
                    "Open a question and explore this animal’s real life.",
                    "Öffne eine Frage und entdecke das echte Leben dieses Tieres.",
                  )}
                </p>
                {(
                  [
                    [
                      "native",
                      "Where is its wild home?",
                      "Wo lebt es in der Natur?",
                    ],
                    [
                      "adultSize",
                      "How big does it really get?",
                      "Wie groß wird es wirklich?",
                    ],
                    [
                      "anatomy",
                      "What makes its body special?",
                      "Was ist an seinem Körper besonders?",
                    ],
                    [
                      "lifecycle",
                      "How do its babies grow?",
                      "Wie wachsen seine Jungen auf?",
                    ],
                    [
                      "wildDiet",
                      "What is on its wild menu?",
                      "Was frisst es in der Natur?",
                    ],
                    [
                      "behavior",
                      "How does it spend its day?",
                      "Wie verbringt es seinen Tag?",
                    ],
                    [
                      "mistakes",
                      "What should people watch out for?",
                      "Worauf sollten Menschen achten?",
                    ],
                  ] as const
                ).map(([key, en, de], index) => (
                  <details key={`${a.id}-${key}`} open={key === "native"}>
                    <summary>
                      <span className="book-question-number" aria-hidden="true">
                        {index + 1}
                      </span>
                      {t(en, de)}
                    </summary>
                    <p>{fishDiscovery[a.id][key][lang]}</p>
                  </details>
                ))}
              </section>
            )}
            {chapter === "care" &&
              fishKnowledge[a.id] &&
              (() => {
                const k = fishKnowledge[a.id];
                return (
                  <section className="species-knowledge">
                    <p>{k.overview[lang]}</p>
                    <dl>
                      <dt>{t("Lifespan", "Lebenserwartung")}</dt>
                      <dd>{k.lifespan[lang]}</dd>
                      <dt>{t("Together or alone?", "Gruppe oder einzeln?")}</dt>
                      <dd>{k.social[lang]}</dd>
                    </dl>
                    {(
                      [
                        ["water", "Water & temperature", "Wasser & Temperatur"],
                        ["home", "Space & home", "Platz & Einrichtung"],
                        ["food", "What does it eat?", "Was frisst es?"],
                        ["care", "Everyday care", "Pflege im Alltag"],
                      ] as const
                    ).map(([key, en, de]) => (
                      <details key={key} open={key === "food"}>
                        <summary>{t(en, de)}</summary>
                        <p>{k[key][lang]}</p>
                      </details>
                    ))}
                    <h4>{t("Did you know?", "Schon gewusst?")}</h4>
                    <ul>
                      {k.facts.map((f, i) => (
                        <li key={i}>{f[lang]}</li>
                      ))}
                    </ul>
                  </section>
                );
              })()}
            <strong>
              {t(
                "Look closely in your world",
                "Schau in deiner Welt genau hin",
              )}
            </strong>
            <p>{observations[a.id][lang === "de" ? 1 : 0]}</p>
            <button
              className="outline"
              onClick={() => {
                setTab("water");
                setTopic(a.id === "clownfish" ? 2 : a.id === "jelly" ? 3 : 0);
              }}
            >
              {t("Discover the biology", "Entdecke die Biologie")} →
            </button>
          </article>
        ) : (
          <>
            <div className="guide-habitats">
              {[
                ["all", "All animals", "Alle Tiere"],
                ["aquarium", "Home aquarium", "Zuhause im Aquarium"],
                ["sea", "Coastal world", "Küstenwelt"],
              ].map(([id, en, de]) => (
                <button
                  key={id}
                  aria-pressed={habitat === id}
                  onClick={() => setHabitat(id)}
                >
                  {t(en, de)}
                </button>
              ))}
            </div>
            <div className="guide-grid">
              {animals
                .filter((a) => habitat === "all" || a.habitat === habitat)
                .map((a) => (
                  <button key={a.id} onClick={() => setSelected(a.id)}>
                    <div className="guide-art">
                      <Artwork animal={a.id} />
                    </div>
                    <strong>{a[lang]}</strong>
                  </button>
                ))}
            </div>
          </>
        )
      ) : (
        <>
          <select
            aria-label={t("Learning topic", "Wissensthema")}
            value={topic}
            onChange={(e) => setTopic(Number(e.target.value))}
          >
            {topics.map((item, i) => (
              <option key={item.en} value={i}>
                {item[lang]}
              </option>
            ))}
          </select>
          <article className="guide-article">
            <h3>{entry[lang]}</h3>
            <p>{lang === "de" ? entry.deutsch : entry.text}</p>
          </article>
        </>
      )}
      <p className="guide-note">
        {t(
          "Game time, mixed habitats and tricks are make-believe. These real-animal notes are a starting point: plan a real aquarium with an adult and check the exact species before choosing pets.",
          "Spielzeit, gemischte Welten und Kunststücke sind Fantasie. Die Tierporträts helfen beim Entdecken: Plane ein echtes Aquarium mit Erwachsenen und prüft vor dem Kauf die genaue Art und ihre Bedürfnisse.",
        )}
      </p>
    </div>
  );
}
