/** Original natural-colour additions. Research ledger: docs/new-fish-sources.md. */
import type { FishVariant } from "./fishVariants";
import type {
  FishKnowledge,
  FishDiscovery,
  KnowledgeText,
} from "./fishKnowledge";

export const extraFishDefinitions = [
  {
    id: "molly",
    en: "Molly",
    de: "Molly",
    habitat: "aquarium" as const,
    tier: 2,
    color: "#a7aaa0",
  },
  {
    id: "harlequin",
    en: "Harlequin rasbora",
    de: "Keilfleckbärbling",
    habitat: "aquarium" as const,
    tier: 2,
    color: "#cdad99",
  },
  {
    id: "cherry_barb",
    en: "Cherry barb",
    de: "Kirschbarbe",
    habitat: "aquarium" as const,
    tier: 1,
    color: "#b95442",
  },
];
export const extraFishVariants: Readonly<
  Record<string, readonly FishVariant[]>
> = {
  molly: [
    {
      id: "silver",
      en: "Wild silver",
      de: "Wildes Silber",
      color: "#a7aaa0",
      accent: "#555d51",
      fin: "#c3b55f",
      pattern: "freckles",
    },
  ],
  harlequin: [
    {
      id: "copper",
      en: "Copper & black",
      de: "Kupfer & Schwarz",
      color: "#cdad99",
      accent: "#343535",
      fin: "#b97e62",
      pattern: "plain",
    },
  ],
  cherry_barb: [
    {
      id: "cherry",
      en: "Cherry red",
      de: "Kirschrot",
      color: "#b95442",
      accent: "#4e3b30",
      fin: "#b66551",
      pattern: "plain",
    },
    {
      id: "tan",
      en: "Warm brown",
      de: "Warmes Braun",
      color: "#b39a76",
      accent: "#594431",
      fin: "#c09b73",
      pattern: "plain",
    },
  ],
};
const text = (en: string, de: string): KnowledgeText => ({ en, de });
export const extraFishKnowledge: Record<string, FishKnowledge> = {
  molly: {
    scientific: "Poecilia sphenops",
    overview: text(
      "A lively livebearer. Our silver molly represents natural colours rather than fancy balloon or lyretail forms.",
      "Ein lebhafter Lebendgebärender. Unser silberner Molly zeigt natürliche Farben statt Ballon- oder Lyra-Zuchtformen.",
    ),
    lifespan: text(
      "Can reach around five years with suitable care.",
      "Kann bei passender Pflege etwa fünf Jahre alt werden.",
    ),
    social: text(
      "Keep a group; mixed groups need two or three females per male.",
      "In einer Gruppe halten; bei gemischten Gruppen zwei bis drei Weibchen je Männchen.",
    ),
    water: text(
      "Hard, mineral-rich freshwater, around 24–27 °C; pH about 7.2–8.2.",
      "Hartes, mineralreiches Süßwasser bei etwa 24–27 °C; pH ungefähr 7,2–8,2.",
    ),
    home: text(
      "Plan at least about 100 litres, plants and open swimming space. Larger molly species need more.",
      "Mindestens etwa 100 Liter, Pflanzen und freien Schwimmraum einplanen. Größere Mollyarten brauchen mehr.",
    ),
    food: text(
      "Balanced omnivore food with plenty of plant material, plus small suitable animal foods.",
      "Ausgewogenes Allesfresserfutter mit viel Pflanzenanteil, ergänzt durch kleines geeignetes tierisches Futter.",
    ),
    care: text(
      "Check your tap-water hardness and plan for babies. Do not add salt without checking every tankmate’s needs.",
      "Prüfe die Wasserhärte und plane Nachwuchs ein. Gib nicht ohne Prüfung aller Mitbewohner Salz hinzu.",
    ),
    facts: [
      text(
        "The young are born swimming instead of hatching from eggs laid on plants.",
        "Die Jungen werden schwimmend geboren statt aus an Pflanzen abgelegten Eiern zu schlüpfen.",
      ),
    ],
  },
  harlequin: {
    scientific: "Trigonostigma heteromorpha",
    overview: text(
      "A copper-pink schooling fish with a bold black wedge near its tail.",
      "Ein kupferrosa Schwarmfisch mit einem auffälligen schwarzen Keil nahe dem Schwanz.",
    ),
    lifespan: text(
      "Plan for several years of care, not a short-term decoration.",
      "Plane mehrere Jahre Pflege ein, keine kurzlebige Dekoration.",
    ),
    social: text(
      "Keep at least six, preferably a larger group, with small peaceful neighbours.",
      "Mindestens sechs, besser eine größere Gruppe, mit kleinen friedlichen Nachbarn halten.",
    ),
    water: text(
      "Warm freshwater around 22–27 °C; soft to moderately hard water suits them.",
      "Warmes Süßwasser bei etwa 22–27 °C; weich bis mittelhart ist passend.",
    ),
    home: text(
      "About 4–5 cm as adults. Choose a planted tank at least 60 cm long with swimming room.",
      "Erwachsen etwa 4–5 cm. Wähle ein mindestens 60 cm langes bepflanztes Becken mit Schwimmraum.",
    ),
    food: text(
      "Small flakes or pellets, varied with tiny frozen or live foods.",
      "Kleine Flocken oder Granulate, ergänzt durch winziges Frost- oder Lebendfutter.",
    ),
    care: text(
      "Keep water stable and avoid large predators. Never replace the group with one lonely fish.",
      "Halte das Wasser stabil und vermeide große Räuber. Ersetze die Gruppe nie durch einen einsamen Fisch.",
    ),
    facts: [
      text(
        "Unlike many relatives, it attaches its eggs beneath broad plant leaves.",
        "Anders als viele Verwandte befestigt es seine Eier unter breiten Pflanzenblättern.",
      ),
    ],
  },
  cherry_barb: {
    scientific: "Puntius titteya",
    overview: text(
      "A peaceful Sri Lankan barb: males are redder, while females are usually warm brown.",
      "Eine friedliche Barbe aus Sri Lanka: Männchen sind röter, Weibchen meist warmbraun.",
    ),
    lifespan: text(
      "A commitment for several years; healthy water and suitable food matter throughout.",
      "Eine Verantwortung für mehrere Jahre; gesundes Wasser und passendes Futter bleiben wichtig.",
    ),
    social: text(
      "Keep six or more. Mixed groups should include more females than males.",
      "Mindestens sechs halten. Gemischte Gruppen sollten mehr Weibchen als Männchen enthalten.",
    ),
    water: text(
      "Freshwater around 22–27 °C; farm-raised fish tolerate roughly pH 6–8.",
      "Süßwasser bei etwa 22–27 °C; Nachzuchten vertragen ungefähr pH 6–8.",
    ),
    home: text(
      "Around 5 cm long. A planted tank at least 60 cm long offers shelter and swimming room.",
      "Etwa 5 cm lang. Ein mindestens 60 cm langes bepflanztes Becken bietet Schutz und Schwimmraum.",
    ),
    food: text(
      "Small varied omnivore foods, including plant matter and tiny invertebrate foods.",
      "Kleines abwechslungsreiches Allesfresserfutter, einschließlich Pflanzenkost und kleiner Wirbellosen-Nahrung.",
    ),
    care: text(
      "Choose calm neighbours and provide cover. Adults may eat eggs and baby shrimp.",
      "Wähle ruhige Nachbarn und biete Deckung. Erwachsene können Eier und Garnelenbabys fressen.",
    ),
    facts: [
      text(
        "Both natural colour forms have a dark stripe along the side.",
        "Beide natürlichen Farbformen tragen einen dunklen Seitenstreifen.",
      ),
    ],
  },
};
export const extraFishDiscovery: Record<string, FishDiscovery> = {
  molly: {
    native: text(
      "This entry uses the short-finned molly as its example. Aquarium mollies also include other species and hybrids.",
      "Dieses Porträt nutzt den Spitzmaulkärpfling als Beispiel. Aquarienmollys umfassen auch andere Arten und Hybriden.",
    ),
    adultSize: text(
      "Common short-finned mollies often reach 6–10 cm; ask which species your fish really is.",
      "Gewöhnliche kurzflossige Mollys erreichen oft 6–10 cm; frage nach der genauen Art.",
    ),
    anatomy: text(
      "A male’s modified anal fin helps identify it. Colour alone does not reliably identify sex.",
      "Die umgebildete Afterflosse hilft beim Erkennen eines Männchens. Farbe allein bestimmt das Geschlecht nicht sicher.",
    ),
    lifecycle: text(
      "Females bear live young. A mixed group can quickly produce more fish than a home tank can hold.",
      "Weibchen bringen lebende Junge zur Welt. Eine gemischte Gruppe kann schnell mehr Nachwuchs bekommen, als ins Becken passt.",
    ),
    wildDiet: text(
      "Mollies graze plant growth and also take small animal foods. Algae alone are not a complete aquarium diet.",
      "Mollys weiden Pflanzenaufwuchs ab und nehmen auch kleine tierische Nahrung auf. Algen allein sind kein vollständiges Aquarienfutter.",
    ),
    behavior: text(
      "Watch the mouth nibble at surfaces. Busy feeding can leave slower companions with too little food.",
      "Beobachte das Maul beim Abweiden. Eifrige Fresser können langsameren Mitbewohnern zu wenig Futter lassen.",
    ),
    mistakes: text(
      "Soft water and unsuitable companions cause problems. The game’s shared tank is not a real stocking plan.",
      "Weiches Wasser und unpassende Nachbarn bereiten Probleme. Das gemeinsame Spielbecken ist kein echter Besatzplan.",
    ),
  },
  harlequin: {
    native: text(
      "Its ancestors come from Southeast Asian freshwater habitats, including shaded forest waters.",
      "Seine Vorfahren stammen aus südostasiatischen Süßwassergebieten, darunter beschattete Waldgewässer.",
    ),
    adultSize: text(
      "Even a small fish needs a whole group and enough space to turn and swim together.",
      "Auch ein kleiner Fisch braucht eine ganze Gruppe und genug Platz zum gemeinsamen Wenden und Schwimmen.",
    ),
    anatomy: text(
      "Look for the deep body and broad dark wedge. Related lambchop rasboras have a slimmer dark mark.",
      "Achte auf den hohen Körper und den breiten dunklen Keil. Verwandte Espes Keilfleckbärblinge haben einen schmaleren Fleck.",
    ),
    lifecycle: text(
      "A pair turns under a leaf to lay and fertilise eggs. Adults do not raise their young.",
      "Ein Paar dreht sich unter ein Blatt, um Eier abzulegen und zu befruchten. Erwachsene ziehen die Jungen nicht auf.",
    ),
    wildDiet: text(
      "Small invertebrates supply much of its natural food. Food pieces must fit its little mouth.",
      "Kleine Wirbellose liefern viel seiner natürlichen Nahrung. Futterstücke müssen ins kleine Maul passen.",
    ),
    behavior: text(
      "A group explores together and may gather more closely when startled. Approach the glass calmly.",
      "Eine Gruppe erkundet gemeinsam und rückt bei Schreck enger zusammen. Nähere dich der Scheibe ruhig.",
    ),
    mistakes: text(
      "Do not buy one as a companion for large predators. Keeping only a few removes the security of a group.",
      "Kaufe keines als Begleiter großer Räuber. Bei zu wenigen fehlt die Sicherheit einer Gruppe.",
    ),
  },
  cherry_barb: {
    native: text(
      "Its wild home is Sri Lanka, where shaded streams contain fallen leaves and branches.",
      "Seine wilde Heimat ist Sri Lanka, wo beschattete Bäche gefallenes Laub und Äste enthalten.",
    ),
    adultSize: text(
      "A five-centimetre fish still needs group space; size alone does not decide how many fit in a tank.",
      "Auch ein fünf Zentimeter langer Fisch braucht Gruppenraum; die Körperlänge allein bestimmt nicht den Besatz.",
    ),
    anatomy: text(
      "The side stripe stays visible on red and brown fish. Natural colour varies with sex and condition.",
      "Der Seitenstreifen bleibt bei roten und braunen Tieren sichtbar. Natürliche Farbe hängt von Geschlecht und Zustand ab.",
    ),
    lifecycle: text(
      "Eggs fall among plants and other surfaces. Adults may eat eggs, so real breeding needs protected nursery space.",
      "Eier gelangen zwischen Pflanzen und auf andere Flächen. Erwachsene können sie fressen; echte Zucht braucht geschützten Nachwuchsraum.",
    ),
    wildDiet: text(
      "Tiny insects, worms, crustaceans and some algae make a varied menu.",
      "Winzige Insekten, Würmer, Krebstiere und etwas Algen bilden einen abwechslungsreichen Speiseplan.",
    ),
    behavior: text(
      "Brief chasing can occur during courtship, but persistent bullying means the group needs attention.",
      "Kurzes Jagen kann zur Balz gehören, doch anhaltendes Mobbing verlangt Aufmerksamkeit.",
    ),
    mistakes: text(
      "Avoid choosing only bright red fish without checking sexes. Quiet companions and hiding places matter more than colour.",
      "Wähle nicht nur leuchtend rote Tiere ohne Geschlechtsprüfung. Ruhige Nachbarn und Verstecke sind wichtiger als Farbe.",
    ),
  },
};
