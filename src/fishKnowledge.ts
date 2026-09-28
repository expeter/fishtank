import { extraFishKnowledge, extraFishDiscovery } from "./extraFish";
/** Child-readable real-world care notes. Research and species choices: docs/knowledge-sources.md. */
export interface KnowledgeText {
  en: string;
  de: string;
}
export interface FishKnowledge {
  scientific: string;
  overview: KnowledgeText;
  lifespan: KnowledgeText;
  social: KnowledgeText;
  water: KnowledgeText;
  home: KnowledgeText;
  food: KnowledgeText;
  care: KnowledgeText;
  facts: KnowledgeText[];
}
const text = (en: string, de: string): KnowledgeText => ({ en, de });
const profile = (
  scientific: string,
  rows: [string, string][],
): FishKnowledge => ({
  scientific,
  overview: text(...rows[0]),
  lifespan: text(...rows[1]),
  social: text(...rows[2]),
  water: text(...rows[3]),
  home: text(...rows[4]),
  food: text(...rows[5]),
  care: text(...rows[6]),
  facts: rows.slice(7).map((row) => text(...row)),
});
export const fishKnowledge: Record<string, FishKnowledge> = {
  ...extraFishKnowledge,
  pearl_gourami: profile("Trichopodus leerii", [
    [
      "A Southeast Asian freshwater fish with pearly spots.",
      "Ein südostasiatischer Süßwasserfisch mit Perlenpunkten.",
    ],
    [
      "A pet for several years; good care matters throughout its life.",
      "Ein Tier für mehrere Jahre; gute Pflege bleibt lebenslang wichtig.",
    ],
    [
      "Choose peaceful neighbours; watch for territorial males.",
      "Ruhige Nachbarn wählen; Männchen können Reviere verteidigen.",
    ],
    [
      "Freshwater around 24–28 °C, gentle flow and access to surface air.",
      "Süßwasser bei etwa 24–28 °C, sanfte Strömung und Zugang zur Luft an der Oberfläche.",
    ],
    [
      "A planted aquarium of about 115 litres or larger, with hiding places.",
      "Ein bepflanztes Aquarium ab etwa 115 Litern mit Verstecken.",
    ],
    [
      "Varied omnivore food: suitable dry food and small frozen foods.",
      "Abwechslungsreiche Allesfresserkost: geeignetes Trockenfutter und kleines Frostfutter.",
    ],
    [
      "Leave breathing space below the lid; avoid fin-nipping neighbours.",
      "Luftraum unter dem Deckel lassen; keine flossenknabbernden Nachbarn.",
    ],
    [
      "Gouramis can breathe air using a labyrinth organ.",
      "Fadenfische können mit einem Labyrinthorgan Luft atmen.",
    ],
  ]),
  rainbowfish: profile("Melanotaenia boesemani", [
    [
      "An Indonesian rainbowfish whose adults glow blue and orange.",
      "Ein indonesischer Regenbogenfisch, der erwachsen blau und orange leuchtet.",
    ],
    [
      "Often around 5–8 years with suitable care.",
      "Bei passender Pflege oft ungefähr 5–8 Jahre.",
    ],
    [
      "Keep six or more together, with similarly sized peaceful swimmers.",
      "Mindestens sechs zusammen halten, mit ähnlich großen friedlichen Schwimmern.",
    ],
    [
      "Freshwater around 24–28 °C; pH 6–8, preferably with minerals.",
      "Süßwasser bei etwa 24–28 °C; pH 6–8, gern mineralhaltig.",
    ],
    [
      "Adults reach about 8–10 cm. A 120 cm long planted tank gives swimming room.",
      "Erwachsen etwa 8–10 cm. Ein 120 cm langes bepflanztes Becken bietet Schwimmraum.",
    ],
    [
      "Small omnivore foods, varied with suitable frozen or live foods.",
      "Kleines Allesfresserfutter, ergänzt mit geeignetem Frost- oder Lebendfutter.",
    ],
    [
      "Use a lid. Tiny shrimp and baby fish may be eaten.",
      "Einen Deckel verwenden. Kleine Garnelen und Jungfische können gefressen werden.",
    ],
    [
      "Young fish develop their bright colours gradually.",
      "Jungfische entwickeln ihre leuchtenden Farben erst nach und nach.",
    ],
  ]),
  ghostknife: profile("Apteronotus albifrons", [
    [
      "A nocturnal South American fish with a waving ribbon fin.",
      "Ein nachtaktiver südamerikanischer Fisch mit einer gewellten Bandflosse.",
    ],
    ["Can live for more than ten years.", "Kann älter als zehn Jahre werden."],
    [
      "Usually keep one. It can eat small fish and dislikes other electric fish.",
      "Meist einzeln halten. Er frisst kleine Fische und duldet andere elektrische Fische schlecht.",
    ],
    [
      "Freshwater around 24–28 °C and pH 6.8–7.8.",
      "Süßwasser bei etwa 24–28 °C und pH 6,8–7,8.",
    ],
    [
      "Around 35–45 cm: an adult needs a very large tank, roughly 450–680 litres.",
      "Etwa 35–45 cm: Erwachsene brauchen ein sehr großes Becken, ungefähr 450–680 Liter.",
    ],
    [
      "Meaty foods such as worms, frozen crustaceans and suitable pellets.",
      "Tierisches Futter wie Würmer, gefrorene Krebstiere und geeignete Pellets.",
    ],
    [
      "Provide dim light and roomy shelters. Check that shy fish get enough food.",
      "Gedämpftes Licht und geräumige Verstecke bieten. Auf ausreichend Futter für scheue Tiere achten.",
    ],
    [
      "A weak electric field helps it find its way in darkness.",
      "Ein schwaches elektrisches Feld hilft bei der Orientierung im Dunkeln.",
    ],
  ]),
  regal_angelfish: profile("Pygoplites diacanthus", [
    [
      "A reef fish with striking blue-edged yellow and pale stripes.",
      "Ein Rifffisch mit auffälligen blau gesäumten gelben und hellen Streifen.",
    ],
    [
      "A long-term commitment; lifespan depends strongly on successful specialist care.",
      "Eine langfristige Verantwortung; das Alter hängt stark von erfolgreicher Fachpflege ab.",
    ],
    [
      "Usually one, without other angelfish or pushy neighbours.",
      "Meist einzeln, ohne andere Kaiserfische oder aufdringliche Nachbarn.",
    ],
    [
      "Seawater around 23–27 °C; pH 8.1–8.4.",
      "Meerwasser bei etwa 23–27 °C; pH 8,1–8,4.",
    ],
    [
      "Can reach 25 cm; needs a large established marine aquarium with rock shelters.",
      "Wird bis 25 cm groß; braucht ein großes eingefahrenes Meerwasserbecken mit Felsverstecken.",
    ],
    [
      "Specialist sponge-feeder food plus varied marine foods.",
      "Spezialfutter für Schwammfresser und abwechslungsreiches Meerwassertierfutter.",
    ],
    [
      "For experienced keepers: reluctant feeding is a serious challenge. May nip corals.",
      "Für Erfahrene: Futterverweigerung ist ein großes Problem. Kann Korallen anknabbern.",
    ],
    [
      "Wild regal angelfish eat sponges and tunicates.",
      "Wilde Pfauenkaiserfische fressen Schwämme und Manteltiere.",
    ],
  ]),
  achilles_tang: profile("Acanthurus achilles", [
    [
      "A Pacific surgeonfish with an orange patch beside its tail.",
      "Ein pazifischer Doktorfisch mit einem orangefarbenen Fleck an der Schwanzwurzel.",
    ],
    [
      "Plan for years of care, not a short-lived decoration.",
      "Viele Jahre Pflege einplanen, keine kurzlebige Dekoration.",
    ],
    [
      "Can defend its space against other tangs; compatibility needs expert planning.",
      "Kann sein Revier gegen andere Doktorfische verteidigen; Vergesellschaftung fachkundig planen.",
    ],
    [
      "Seawater around 22–26 °C, pH 8.1–8.4, with strong water movement.",
      "Meerwasser bei etwa 22–26 °C, pH 8,1–8,4 und kräftiger Strömung.",
    ],
    [
      "Needs a very large mature marine tank with plenty of swimming room.",
      "Braucht ein sehr großes eingefahrenes Meerwasserbecken mit viel Schwimmraum.",
    ],
    [
      "Algae-rich food and varied suitable marine foods.",
      "Algenreiches Futter und abwechslungsreiches geeignetes Meerwasserfutter.",
    ],
    [
      "An expert-care species; stable, oxygen-rich water and reliable feeding matter.",
      "Eine Art für Fachkundige; stabiles sauerstoffreiches Wasser und sichere Futteraufnahme sind wichtig.",
    ],
    [
      "Surgeonfish have sharp defensive structures near their tail.",
      "Doktorfische besitzen scharfe Abwehrstrukturen nahe dem Schwanz.",
    ],
  ]),
  zebra_shark: profile("Stegostoma tigrinum", [
    [
      "A tropical sea shark whose baby stripes become adult spots.",
      "Ein tropischer Meereshai: Aus Baby-Streifen werden später Flecken.",
    ],
    [
      "Some in public aquariums have lived for more than twenty years.",
      "Einige wurden in Schauaquarien älter als zwanzig Jahre.",
    ],
    [
      "Professional teams plan companions; small animals may become prey.",
      "Fachteams planen die Mitbewohner; kleine Tiere können Beute werden.",
    ],
    [
      "Tropical seawater maintained by specialist life-support systems.",
      "Tropisches Meerwasser mit fachkundig betreuten Versorgungssystemen.",
    ],
    [
      "Can exceed two metres. A public-aquarium animal, never a home-tank pet.",
      "Kann über zwei Meter lang werden. Ein Tier für Schauaquarien, niemals fürs Heimaquarium.",
    ],
    [
      "Eats molluscs, crustaceans and small fish.",
      "Frisst Weichtiere, Krebstiere und kleine Fische.",
    ],
    [
      "Our tiny game shark is make-believe. Real sharks need enormous space and expert care.",
      "Unser winziger Spielhai ist Fantasie. Echte Haie brauchen enorm viel Platz und Fachpflege.",
    ],
    [
      "It often searches for food at night and has an unusually long tail.",
      "Er sucht oft nachts nach Futter und hat einen ungewöhnlich langen Schwanz.",
    ],
  ]),

  guppy: profile("Poecilia reticulata", [
    [
      "A small, lively fish from South America, bred in many colours.",
      "Ein kleiner, lebhafter Fisch aus Südamerika mit vielen gezüchteten Farben.",
    ],
    [
      "Usually about 2–3 years; temperature and care affect lifespan.",
      "Meist etwa 2–3 Jahre; Temperatur und Pflege beeinflussen das Alter.",
    ],
    [
      "Keep a group. Mixed groups need more females than males and a plan for babies.",
      "In einer Gruppe halten. Gemischte Gruppen brauchen mehr Weibchen als Männchen und einen Plan für Nachwuchs.",
    ],
    [
      "Fresh water, around 24–26 °C; mineral-rich rather than very soft.",
      "Süßwasser, etwa 24–26 °C; eher mineralreich statt sehr weich.",
    ],
    [
      "Adults reach about 5 cm. Give them plants, hiding places and open swimming space.",
      "Erwachsene werden etwa 5 cm lang. Pflanzen, Verstecke und freie Schwimmflächen anbieten.",
    ],
    [
      "Small complete food, with varied tiny animal and plant foods.",
      "Kleines Alleinfutter, ergänzt durch abwechslungsreiche tierische und pflanzliche Kost.",
    ],
    [
      "Feed little portions. Protect tiny babies from strong filter intakes.",
      "Kleine Portionen füttern. Winzige Babys vor starkem Filteransog schützen.",
    ],
    [
      "Guppies give birth to swimming babies instead of laying eggs.",
      "Guppys bringen schwimmende Junge zur Welt, statt Eier abzulegen.",
    ],
  ]),
  goldfish: profile("Carassius auratus", [
    [
      "A carp relative that grows much larger than a shop baby suggests.",
      "Ein Karpfenverwandter, der viel größer wird als das Jungtier im Laden.",
    ],
    [
      "Often 10–15 years, sometimes 20 or more with good care.",
      "Oft 10–15 Jahre, bei guter Pflege manchmal 20 oder mehr.",
    ],
    [
      "Social fish; choose suitable goldfish companions with similar swimming abilities.",
      "Gesellige Fische; passende Goldfisch-Partner mit ähnlichem Schwimmvermögen wählen.",
    ],
    [
      "Cooler fresh water; the right temperature depends on the breed.",
      "Kühleres Süßwasser; die passende Temperatur hängt von der Zuchtform ab.",
    ],
    [
      "A very spacious filtered tank; common long-bodied goldfish often suit ponds better.",
      "Ein sehr geräumiges Filteraquarium; normale langgestreckte Goldfische passen oft besser in einen Teich.",
    ],
    [
      "Goldfish complete food plus suitable plant foods in modest portions.",
      "Goldfisch-Alleinfutter und geeignete Pflanzenkost in kleinen Portionen.",
    ],
    [
      "Never a small bowl. Their waste makes filtration and water changes especially important.",
      "Kein kleines Goldfischglas. Ihre Ausscheidungen machen Filter und Wasserwechsel besonders wichtig.",
    ],
    [
      "A tiny baby is not a promise that the adult stays small.",
      "Ein winziges Jungtier bedeutet nicht, dass der erwachsene Fisch klein bleibt.",
    ],
  ]),
  tetra: profile("Paracheirodon innesi", [
    [
      "The neon tetra has a shining blue stripe and a partly red belly.",
      "Der Neonsalmler trägt einen leuchtenden blauen Streifen und einen teilweise roten Bauch.",
    ],
    [
      "Several years; around 4–5 is a useful care-planning range, not a guarantee.",
      "Mehrere Jahre; etwa 4–5 sind ein Planungswert, keine Garantie.",
    ],
    [
      "A shoal of its own species, ideally ten or more; never a lonely display fish.",
      "Eine Gruppe der eigenen Art, möglichst zehn oder mehr; kein einzelner Schaufisch.",
    ],
    [
      "Fresh water, roughly 22–25 °C; usually soft to moderately soft.",
      "Süßwasser, ungefähr 22–25 °C; meist weich bis mäßig weich.",
    ],
    [
      "Around 4 cm as adults; an established planted aquarium with shade and swimming room.",
      "Erwachsen etwa 4 cm; ein eingefahrenes Pflanzenaquarium mit Schatten und Schwimmraum.",
    ],
    [
      "Very small flakes, micro-pellets and tiny frozen or live foods.",
      "Sehr kleine Flocken, Mikrogranulat und winziges Frost- oder Lebendfutter.",
    ],
    [
      "Large fish may eat neons. Add them only after the filter has matured.",
      "Große Fische können Neons fressen. Erst nach dem Einfahren des Filters einsetzen.",
    ],
    [
      "Neon, cardinal and green neon tetras are different species.",
      "Neonsalmler, Roter Neon und Blauer Neon sind verschiedene Arten.",
    ],
  ]),
  angelfish: profile("Pterophyllum scalare", [
    [
      "A tall South American cichlid with fins shaped like sails.",
      "Ein hoher südamerikanischer Buntbarsch mit segelförmigen Flossen.",
    ],
    [
      "About 8–10 years under good conditions.",
      "Bei guten Bedingungen etwa 8–10 Jahre.",
    ],
    [
      "Youngsters can grow up in a group; adult pairs defend territories.",
      "Jungtiere können in einer Gruppe aufwachsen; erwachsene Paare verteidigen Reviere.",
    ],
    [
      "Warm fresh water, around 25–28 °C; stable conditions matter.",
      "Warmes Süßwasser, etwa 25–28 °C; gleichbleibende Werte sind wichtig.",
    ],
    [
      "A large, tall aquarium with plants and space between territories.",
      "Ein großes, hohes Aquarium mit Pflanzen und Platz zwischen Revieren.",
    ],
    [
      "Varied suitable pellets and small frozen or live animal foods.",
      "Abwechslungsreiches passendes Granulat und kleines tierisches Frost- oder Lebendfutter.",
    ],
    [
      "Tiny fish and shrimp can become food. Avoid fin-nipping companions.",
      "Winzige Fische und Garnelen können Futter werden. Flossenzupfer als Mitbewohner vermeiden.",
    ],
    [
      "Parents may guard eggs laid on a broad leaf.",
      "Eltern können Eier bewachen, die sie auf ein breites Blatt gelegt haben.",
    ],
  ]),
  snail: profile("Freshwater aquarium snails / Süßwasserschnecken", [
    [
      "Our window snail represents several real freshwater snail species.",
      "Unsere Scheibenschnecke steht für mehrere echte Süßwasserschneckenarten.",
    ],
    [
      "Species differ: many small aquarium snails live around 1–3 years.",
      "Je nach Art verschieden: Viele kleine Aquarienschnecken leben etwa 1–3 Jahre.",
    ],
    [
      "No fish-like shoal needed; several can share space when food is sufficient.",
      "Kein Fischschwarm nötig; mehrere können bei genügend Futter zusammenleben.",
    ],
    [
      "Fresh water suited to the species; minerals help build a healthy shell.",
      "Zur Art passendes Süßwasser; Mineralien helfen beim Aufbau eines gesunden Hauses.",
    ],
    [
      "An established aquarium with surfaces to graze and safe filter openings.",
      "Ein eingefahrenes Aquarium mit Flächen zum Abweiden und sicheren Filteröffnungen.",
    ],
    [
      "Algae and biofilm, plus suitable supplementary food when grazing is scarce.",
      "Algen und Aufwuchs; bei wenig Nahrung zusätzlich geeignetes Schneckenfutter.",
    ],
    [
      "Snails are animals, not cleaning machines. Check the exact species before buying.",
      "Schnecken sind Tiere, keine Putzmaschinen. Vor dem Kauf die genaue Art bestimmen.",
    ],
    [
      "A rasping tongue called a radula scrapes food from surfaces.",
      "Eine Raspelzunge, die Radula, schabt Nahrung von Oberflächen.",
    ],
  ]),
  frog: profile("Pond-frog inspiration / Vorbild: Teichfrösche", [
    [
      "Our lily-pad frog is a storybook pond visitor, not an aquarium species.",
      "Unser Seerosenfrosch ist ein märchenhafter Teichgast, keine Aquarienart.",
    ],
    [
      "For example, a common frog may live about 5–10 years.",
      "Ein Grasfrosch kann zum Beispiel etwa 5–10 Jahre alt werden.",
    ],
    [
      "Wild frogs choose their own space; do not collect them as fish-tank pets.",
      "Wildfrösche wählen ihren Platz selbst; nicht als Aquarientiere einsammeln.",
    ],
    [
      "A natural freshwater pond with safe access to land; no salt water.",
      "Ein naturnaher Süßwasserteich mit sicherem Landzugang; kein Salzwasser.",
    ],
    [
      "A wildlife-friendly garden with shelter and a gently sloping pond edge.",
      "Ein tierfreundlicher Garten mit Verstecken und flach auslaufendem Teichufer.",
    ],
    [
      "Adult pond frogs catch small animals such as insects and worms.",
      "Erwachsene Teichfrösche fangen kleine Tiere wie Insekten und Würmer.",
    ],
    [
      "African dwarf frogs need very different aquarium care; they are not lily-pad frogs.",
      "Zwergkrallenfrösche brauchen ganz andere Aquarienpflege; sie sind keine Seerosenfrösche.",
    ],
    [
      "Frogs are amphibians. Tadpoles change shape as they grow.",
      "Frösche sind Amphibien. Kaulquappen verändern beim Wachsen ihre Gestalt.",
    ],
  ]),
  betta: profile("Betta splendens", [
    [
      "A colourful labyrinth fish that can also breathe air at the surface.",
      "Ein farbiger Labyrinthfisch, der auch Luft an der Oberfläche atmen kann.",
    ],
    [
      "Commonly about 2–4 years, depending on breeding and care.",
      "Häufig etwa 2–4 Jahre, abhängig von Zucht und Pflege.",
    ],
    [
      "Keep one male betta, never two males together. A quiet individual home is simplest.",
      "Ein Männchen halten, niemals zwei zusammen. Ein ruhiges Einzelzuhause ist am einfachsten.",
    ],
    [
      "Warm fresh water around 25–27 °C, with very gentle flow.",
      "Warmes Süßwasser um 25–27 °C mit sehr sanfter Strömung.",
    ],
    [
      "A heated, filtered, planted aquarium with resting leaves near the surface.",
      "Ein beheiztes, gefiltertes Pflanzenaquarium mit Ruheblättern nahe der Oberfläche.",
    ],
    [
      "Suitable betta food and small animal foods; not a plant-only diet.",
      "Geeignetes Kampffischfutter und kleine Futtertiere; keine rein pflanzliche Kost.",
    ],
    [
      "No tiny cup or vase. Leave access to air and avoid sharp decorations.",
      "Kein winziger Becher und keine Vase. Luftzugang lassen und scharfe Dekoration vermeiden.",
    ],
    [
      "A male can build a nest of bubbles for eggs.",
      "Ein Männchen kann für Eier ein Nest aus Luftblasen bauen.",
    ],
  ]),
  discus: profile("Symphysodon species / Arten", [
    [
      "A disc-shaped Amazon cichlid whose care needs experience.",
      "Ein scheibenförmiger Amazonas-Buntbarsch, dessen Pflege Erfahrung braucht.",
    ],
    [
      "Often around 8 years; well-kept individuals can reach 10–12.",
      "Oft etwa 8 Jahre; gut gepflegte Tiere können 10–12 erreichen.",
    ],
    [
      "A compatible group in a spacious aquarium; watch for bullying.",
      "Eine verträgliche Gruppe in einem geräumigen Aquarium; auf Mobbing achten.",
    ],
    [
      "Very warm fresh water, often 28–30 °C; ask about the breeding strain.",
      "Sehr warmes Süßwasser, häufig 28–30 °C; nach den Bedürfnissen der Zuchtlinie fragen.",
    ],
    [
      "Adults reach about 13–18 cm. They need a large, calm aquarium with excellent filtration.",
      "Erwachsene erreichen etwa 13–18 cm. Sie brauchen ein großes, ruhiges Aquarium mit guter Filterung.",
    ],
    [
      "Varied discus food in appropriate portions; check that shy fish eat too.",
      "Abwechslungsreiches Diskusfutter in passenden Portionen; auch scheue Tiere müssen fressen.",
    ],
    [
      "Tank mates must tolerate the warmth and must not steal all the food.",
      "Mitbewohner müssen die Wärme vertragen und dürfen nicht alles Futter wegnehmen.",
    ],
    [
      "Young discus feed on a special secretion on their parents' skin.",
      "Junge Diskusfische ernähren sich von einem besonderen Sekret auf der Haut ihrer Eltern.",
    ],
  ]),
  zebrafish: profile("Danio rerio", [
    [
      "A quick little striped fish from South Asia.",
      "Ein flinker kleiner Streifenfisch aus Südasien.",
    ],
    [
      "About 3–5 years is common in well-kept aquariums.",
      "Etwa 3–5 Jahre sind in gut gepflegten Aquarien üblich.",
    ],
    [
      "Keep at least six together, preferably a larger group.",
      "Mindestens sechs zusammen halten, besser eine größere Gruppe.",
    ],
    [
      "Fresh water around 21–25 °C; not a very hot discus tank.",
      "Süßwasser um 21–25 °C; kein sehr warmes Diskusbecken.",
    ],
    [
      "Adults are roughly 5 cm. A long aquarium needs open swimming space, plants and a lid.",
      "Erwachsene sind ungefähr 5 cm lang. Ein langes Becken braucht freie Schwimmstrecken, Pflanzen und Deckel.",
    ],
    [
      "Small varied flakes, granules and tiny animal foods.",
      "Kleine abwechslungsreiche Flocken, Granulate und winzige Futtertiere.",
    ],
    [
      "Their lively swimming may disturb very slow or shy neighbours.",
      "Ihr lebhaftes Schwimmen kann sehr langsame oder scheue Nachbarn stören.",
    ],
    [
      "They scatter eggs; adults may eat them if they find them.",
      "Sie verstreuen Eier; Erwachsene können gefundene Eier fressen.",
    ],
  ]),
  cory: profile("Corydoras and related genera / verwandte Gattungen", [
    [
      "Our cory represents peaceful armoured catfish that explore the bottom.",
      "Unser Panzerwels steht für friedliche Bodenforscher mit gepanzertem Körper.",
    ],
    [
      "Many live several years; bronze cory varieties can reach around 6–8.",
      "Viele leben mehrere Jahre; Metallpanzerwelse können etwa 6–8 Jahre erreichen.",
    ],
    [
      "Keep a group of at least six of the same species.",
      "Mindestens sechs Tiere derselben Art als Gruppe halten.",
    ],
    [
      "Fresh water; temperature differs by species, so match the exact cory.",
      "Süßwasser; die Temperatur unterscheidet sich je nach Panzerwelsart.",
    ],
    [
      "Common aquarium species span roughly 2.5–7.5 cm. Offer clean fine sand and sheltered resting places.",
      "Häufige Aquarienarten werden ungefähr 2,5–7,5 cm lang. Feinen, sauberen Sand und geschützte Ruheplätze anbieten.",
    ],
    [
      "Sinking complete food and suitable small animal foods.",
      "Sinkendes Alleinfutter und passende kleine Futtertiere.",
    ],
    [
      "They are not waste eaters. Make sure their own food reaches the floor.",
      "Sie sind keine Abfallfresser. Ihr eigenes Futter muss am Boden ankommen.",
    ],
    [
      "Their little mouth barbels help them investigate the ground.",
      "Ihre kleinen Barteln am Maul helfen ihnen, den Boden zu untersuchen.",
    ],
  ]),
  swordtail: profile("Xiphophorus hellerii", [
    [
      "An active Central American livebearer; males often carry a tail sword.",
      "Ein aktiver mittelamerikanischer Lebendgebärender; Männchen tragen oft ein Schwanzschwert.",
    ],
    [
      "Several years; plan a long-term home, not a short holiday project.",
      "Mehrere Jahre; ein dauerhaftes Zuhause planen, kein kurzes Ferienprojekt.",
    ],
    [
      "Keep a suitable group with more females; males can chase one another.",
      "Eine passende Gruppe mit mehr Weibchen halten; Männchen können sich jagen.",
    ],
    [
      "Fresh water around 22–27 °C, preferably mineral-rich.",
      "Süßwasser um 22–27 °C, möglichst mineralreich.",
    ],
    [
      "Can reach about 13 cm. A long, spacious aquarium needs plants and a secure cover.",
      "Kann etwa 13 cm erreichen. Ein langes, geräumiges Becken braucht Pflanzen und eine sichere Abdeckung.",
    ],
    [
      "Mixed complete food including plant ingredients, plus small animal foods.",
      "Gemischtes Alleinfutter mit Pflanzenanteilen, ergänzt durch kleine Futtertiere.",
    ],
    [
      "Adults grow much bigger than guppies and may outcompete shy fish.",
      "Erwachsene werden deutlich größer als Guppys und können scheuen Fischen Futter wegnehmen.",
    ],
    [
      "The tail sword is a fin extension, not a weapon.",
      "Das Schwanzschwert ist eine Flossenverlängerung, keine Waffe.",
    ],
  ]),
  platy: profile("Xiphophorus maculatus", [
    [
      "A small, sturdy livebearer from Central America, available in many colours.",
      "Ein kleiner, kräftiger Lebendgebärender aus Mittelamerika mit vielen Farbformen.",
    ],
    [
      "About 3–5 years with suitable care.",
      "Bei passender Pflege etwa 3–5 Jahre.",
    ],
    [
      "A loose social group; mixed groups need more females than males.",
      "Eine lockere soziale Gruppe; bei gemischten Gruppen mehr Weibchen als Männchen.",
    ],
    [
      "Fresh water around 22–26 °C; prefers minerals rather than very soft water.",
      "Süßwasser um 22–26 °C; lieber mineralreich als sehr weich.",
    ],
    [
      "Adults reach about 6 cm. Provide plant shelter and an open middle area for swimming.",
      "Erwachsene werden etwa 6 cm lang. Pflanzen als Rückzug und eine freie Mitte zum Schwimmen anbieten.",
    ],
    [
      "Varied complete food with some plant ingredients and small animal foods.",
      "Abwechslungsreiches Alleinfutter mit Pflanzenanteilen und kleinen Futtertieren.",
    ],
    [
      "Think ahead about babies; plants help young fish hide from adults.",
      "Nachwuchs einplanen; Pflanzen helfen Jungfischen, sich vor Erwachsenen zu verstecken.",
    ],
    [
      "A platy's babies are already free-swimming when they are born.",
      "Platybabys können direkt nach der Geburt frei schwimmen.",
    ],
  ]),
  shrimp: profile("Example / Beispiel: Neocaridina davidi", [
    [
      "Freshwater dwarf shrimp are popular aquarium neighbours. Sea shrimp are different species.",
      "Süßwasser-Zwerggarnelen sind beliebte Aquariennachbarn. Meeresgarnelen sind andere Arten.",
    ],
    [
      "Neocaridina often live about 18–36 months.",
      "Neocaridina leben oft etwa 18–36 Monate.",
    ],
    [
      "A group with many hiding places; fish may eat their tiny babies.",
      "Eine Gruppe mit vielen Verstecken; Fische können die winzigen Babys fressen.",
    ],
    [
      "Fresh water around normal room temperature; avoid sudden changes and overheating.",
      "Süßwasser etwa bei normaler Zimmertemperatur; plötzliche Wechsel und Überhitzung vermeiden.",
    ],
    [
      "A mature planted tank with moss and a shrimp-safe filter intake.",
      "Ein eingefahrenes Pflanzenaquarium mit Moos und garnelensicherem Filteransog.",
    ],
    [
      "Graze biofilm and algae; supplement sparingly with suitable shrimp food.",
      "Weiden Aufwuchs und Algen ab; sparsam mit geeignetem Garnelenfutter ergänzen.",
    ],
    [
      "Our game allows both habitats. Never put real freshwater shrimp in seawater.",
      "Unser Spiel erlaubt beide Welten. Echte Süßwassergarnelen niemals in Meerwasser setzen.",
    ],
    [
      "They shed their old shell to grow, then need a safe hiding place.",
      "Zum Wachsen streifen sie ihre alte Hülle ab und brauchen dann ein sicheres Versteck.",
    ],
  ]),
  crab: profile("Example / Beispiel: Geosesarma dennerle", [
    [
      "The game crab is imaginary. A real vampire crab is mainly a land animal.",
      "Die Spielkrabbe ist erfunden. Eine echte Vampirkrabbe lebt hauptsächlich an Land.",
    ],
    [
      "Vampire crabs often live about 2–3 years; other crabs differ.",
      "Vampirkrabben leben oft etwa 2–3 Jahre; andere Krabben unterscheiden sich.",
    ],
    [
      "A carefully planned group with separate shelters; males may quarrel.",
      "Eine sorgfältig geplante Gruppe mit getrennten Verstecken; Männchen können streiten.",
    ],
    [
      "A warm, humid land-and-freshwater enclosure, around 24–26 °C.",
      "Ein warmes, feuchtes Land-Süßwasser-Gehege, etwa 24–26 °C.",
    ],
    [
      "A secure paludarium with plenty of land, plants and easy water exits.",
      "Ein sicheres Paludarium mit viel Land, Pflanzen und einfachen Ausstiegen aus dem Wasser.",
    ],
    [
      "An appropriate varied omnivore diet, including small animal foods.",
      "Geeignete abwechslungsreiche Allesfresserkost, auch mit kleinen Futtertieren.",
    ],
    [
      "Not a fish-tank cleaner. Marine crabs need seawater; choose the exact species first.",
      "Kein Aquarienputzer. Meereskrabben brauchen Salzwasser; zuerst die genaue Art bestimmen.",
    ],
    [
      "A paludarium is a home with both a land area and water.",
      "Ein Paludarium ist ein Zuhause mit einem Landteil und Wasser.",
    ],
  ]),
  clownfish: profile("Amphiprion ocellaris", [
    [
      "A reef fish from the Indo-Pacific with bright bands.",
      "Ein Rifffisch aus dem Indopazifik mit auffälligen Bändern.",
    ],
    [
      "A long-term companion; lifespan depends strongly on care and conditions.",
      "Ein langjähriger Begleiter; das Alter hängt stark von Pflege und Bedingungen ab.",
    ],
    [
      "A compatible pair can work; do not crowd different clownfish together.",
      "Ein verträgliches Paar kann zusammenleben; verschiedene Clownfische nicht dicht zusammensetzen.",
    ],
    [
      "Warm seawater with carefully measured, stable salt content.",
      "Warmes Meerwasser mit sorgfältig gemessenem, gleichbleibendem Salzgehalt.",
    ],
    [
      "A properly matured marine aquarium with hiding places and territory.",
      "Ein gut eingefahrenes Meerwasseraquarium mit Verstecken und einem eigenen Revier.",
    ],
    [
      "Varied small marine foods, including suitable pellets and frozen foods.",
      "Abwechslungsreiches kleines Meerwasserfutter, auch passendes Granulat und Frostfutter.",
    ],
    [
      "Captive-bred fish are available. They do not need an anemone to live in an aquarium.",
      "Nachzuchten sind erhältlich. Im Aquarium brauchen sie zum Leben keine Anemone.",
    ],
    [
      "A pair can guard its eggs on a solid surface.",
      "Ein Paar kann seine Eier auf einer festen Fläche bewachen.",
    ],
  ]),
  tang: profile("Paracanthurus hepatus", [
    [
      "The blue tang grows into a strong reef swimmer, about 25–30 cm long.",
      "Der Paletten-Doktorfisch wird ein kräftiger Riffschwimmer von etwa 25–30 cm Länge.",
    ],
    [
      "Can live beyond five years; plan for many years of care.",
      "Kann älter als fünf Jahre werden; viele Pflegejahre einplanen.",
    ],
    [
      "May quarrel with other tangs, especially without enough room and shelter.",
      "Kann mit anderen Doktorfischen streiten, besonders bei wenig Platz und Verstecken.",
    ],
    [
      "Seawater, around 24–26 °C, with stable water quality.",
      "Meerwasser um 24–26 °C mit gleichbleibender Wasserqualität.",
    ],
    [
      "A very large, long marine aquarium; the tiny shop fish will grow.",
      "Ein sehr großes, langes Meerwasseraquarium; das kleine Ladentier wächst noch.",
    ],
    [
      "Marine algae such as nori, plus varied suitable marine foods.",
      "Meeresalgen wie Nori und abwechslungsreiches geeignetes Meerwasserfutter.",
    ],
    [
      "Its adult swimming needs matter more than its size when purchased.",
      "Sein Platzbedarf als Erwachsener ist wichtiger als seine Größe beim Kauf.",
    ],
    [
      "A sharp spine near the tail helps defend it.",
      "Ein scharfer Dorn nahe der Schwanzflosse hilft bei der Verteidigung.",
    ],
  ]),
  butterfly: profile("Chaetodontidae", [
    [
      "Butterflyfish are a whole family of colourful reef fishes.",
      "Falterfische sind eine ganze Familie farbiger Rifffische.",
    ],
    [
      "Many years are possible; exact lifespan depends on the species.",
      "Viele Jahre sind möglich; das genaue Alter hängt von der Art ab.",
    ],
    [
      "Some species live in pairs, others alone or in groups. Identify the species first.",
      "Manche Arten leben paarweise, andere allein oder in Gruppen. Zuerst die Art bestimmen.",
    ],
    [
      "Warm seawater, commonly around 24–26 °C for aquarium species.",
      "Warmes Meerwasser, bei Aquarienarten häufig etwa 24–26 °C.",
    ],
    [
      "A large, mature marine tank with rock shelters and swimming room.",
      "Ein großes, eingefahrenes Meerwasserbecken mit Felsverstecken und Schwimmraum.",
    ],
    [
      "Species-specific: many eat small invertebrates; some depend on coral polyps.",
      "Artspezifisch: Viele fressen kleine Wirbellose; manche brauchen Korallenpolypen.",
    ],
    [
      "Specialist care. Some species are unsuitable for normal home aquariums.",
      "Pflege für Fachkundige. Manche Arten eignen sich nicht für normale Heimaquarien.",
    ],
    [
      "A narrow snout can reach food hidden in reef cracks.",
      "Eine schmale Schnauze kann Futter in Riffspalten erreichen.",
    ],
  ]),
  seahorse: profile("Hippocampus species / Arten", [
    [
      "A real fish with a gripping tail and a tiny, tube-shaped mouth.",
      "Ein echter Fisch mit Greifschwanz und winzigem röhrenförmigem Maul.",
    ],
    [
      "Species vary; keeping them is a commitment for several years.",
      "Je nach Art verschieden; ihre Haltung ist eine Aufgabe für mehrere Jahre.",
    ],
    [
      "Compatible seahorses in a carefully planned species tank with calm company.",
      "Verträgliche Seepferdchen in einem sorgfältig geplanten Artbecken mit ruhiger Gesellschaft.",
    ],
    [
      "Seawater; the right temperature depends on whether the species is tropical or temperate.",
      "Meerwasser; die Temperatur hängt davon ab, ob die Art tropisch oder gemäßigt lebt.",
    ],
    [
      "A tall specialist tank with safe tail-holds and protected equipment.",
      "Ein hohes Spezialbecken mit sicheren Halteplätzen für den Schwanz und geschützter Technik.",
    ],
    [
      "Appropriately sized tiny crustaceans; trained captive-bred animals may accept frozen mysis.",
      "Passend kleine Krebstiere; daran gewöhnte Nachzuchten nehmen auch gefrorene Mysis.",
    ],
    [
      "Slow feeders need their own food. Fast fish can take it all away.",
      "Langsame Fresser brauchen ihr eigenes Futter. Schnelle Fische können alles wegnehmen.",
    ],
    [
      "The male carries developing eggs in a brood pouch.",
      "Das Männchen trägt die sich entwickelnden Eier in einer Bruttasche.",
    ],
  ]),
  mandarin: profile("Synchiropus splendidus", [
    [
      "A brilliantly patterned dragonet that searches the reef floor for tiny prey.",
      "Ein prächtig gemusterter Leierfisch, der am Riffboden winzige Beute sucht.",
    ],
    [
      "Can live many years when its specialist feeding needs are met.",
      "Kann viele Jahre leben, wenn sein besonderer Futterbedarf erfüllt wird.",
    ],
    [
      "Usually one; two males can fight. A compatible pair needs enough space and food.",
      "Meist einzeln; zwei Männchen können kämpfen. Ein passendes Paar braucht genug Platz und Futter.",
    ],
    [
      "Seawater around 24–26 °C with stable conditions.",
      "Meerwasser um 24–26 °C mit gleichbleibenden Bedingungen.",
    ],
    [
      "A mature marine aquarium with rockwork supporting many tiny crustaceans.",
      "Ein lange eingefahrenes Meerwasserbecken mit Gestein und vielen winzigen Krebstieren.",
    ],
    [
      "Mainly tiny crustaceans such as copepods; ordinary flakes may not be accepted.",
      "Vor allem winzige Krebstiere wie Ruderfußkrebse; normale Flocken werden oft nicht angenommen.",
    ],
    [
      "A colourful tank alone is not enough: food supply needs expert planning.",
      "Ein buntes Becken reicht nicht: Der Futtervorrat muss fachkundig geplant werden.",
    ],
    [
      "Despite a common nickname, a mandarin is not a goby.",
      "Trotz mancher Handelsnamen ist ein Mandarinfisch keine Grundel.",
    ],
  ]),
  gramma: profile("Gramma loreto", [
    [
      "A purple-and-yellow reef fish from the Caribbean.",
      "Ein violett-gelber Rifffisch aus der Karibik.",
    ],
    [
      "Plan for several years; individual lifespan varies with husbandry.",
      "Mehrere Jahre einplanen; das individuelle Alter hängt von der Haltung ab.",
    ],
    [
      "Usually one per aquarium; it defends its cave from other grammas.",
      "Meist ein Tier pro Aquarium; es verteidigt seine Höhle gegen andere Feenbarsche.",
    ],
    [
      "Warm seawater with stable salt content, around 23–26 °C.",
      "Warmes Meerwasser mit gleichbleibendem Salzgehalt, etwa 23–26 °C.",
    ],
    [
      "A marine tank with many rocky caves and somewhat shaded areas.",
      "Ein Meerwasserbecken mit vielen Felshöhlen und etwas beschatteten Bereichen.",
    ],
    [
      "Small meaty marine foods such as mysis and brine shrimp.",
      "Kleines tierisches Meerwasserfutter wie Mysis und Artemia.",
    ],
    [
      "Peaceful neighbours of suitable size; give it a retreat of its own.",
      "Friedliche Nachbarn passender Größe; einen eigenen Rückzugsort anbieten.",
    ],
    [
      "Its body looks like two colours joined in the middle.",
      "Sein Körper sieht aus wie zwei in der Mitte zusammengesetzte Farben.",
    ],
  ]),
  firefish: profile("Nemateleotris magnifica", [
    [
      "A shy dartfish that hovers above a safe reef crevice.",
      "Ein scheuer Grundelartiger, der über einer sicheren Riffspalte schwebt.",
    ],
    [
      "Can live for several years in a stable, established aquarium.",
      "Kann in einem stabilen, eingefahrenen Aquarium mehrere Jahre leben.",
    ],
    [
      "One or a compatible pair; do not assume a random group will get along.",
      "Ein Tier oder ein verträgliches Paar; eine beliebige Gruppe verträgt sich nicht automatisch.",
    ],
    [
      "Seawater around 24–26 °C, with gentle to moderate movement.",
      "Meerwasser um 24–26 °C mit sanfter bis mäßiger Bewegung.",
    ],
    [
      "A mature marine tank with crevices and a secure lid.",
      "Ein eingefahrenes Meerwasserbecken mit Spalten und sicherem Deckel.",
    ],
    [
      "Tiny animal foods that drift through the water, including suitable frozen food.",
      "Winzige tierische Nahrung, die im Wasser treibt, auch passendes Frostfutter.",
    ],
    [
      "Avoid boisterous neighbours. A frightened firefish can jump.",
      "Stürmische Nachbarn vermeiden. Ein erschreckter Feuerfisch kann springen.",
    ],
    [
      "Its tall first dorsal fin looks like a little flag.",
      "Seine hohe erste Rückenflosse sieht wie eine kleine Fahne aus.",
    ],
  ]),
  puffer: profile("Marine pufferfish / Meereskugelfische", [
    [
      "Our puffer represents marine species; freshwater puffers have different needs.",
      "Unser Kugelfisch steht für Meeresarten; Süßwasserkugelfische haben andere Bedürfnisse.",
    ],
    [
      "Many years are possible; lifespan and adult size depend on the exact species.",
      "Viele Jahre sind möglich; Alter und Endgröße hängen von der genauen Art ab.",
    ],
    [
      "Often territorial. Do not assume it can share with other puffers or small animals.",
      "Oft revierbildend. Nicht einfach mit anderen Kugelfischen oder kleinen Tieren vergesellschaften.",
    ],
    [
      "Marine species need seawater, often around 24–26 °C.",
      "Meeresarten brauchen Salzwasser, häufig etwa 24–26 °C.",
    ],
    [
      "A species-appropriate marine aquarium with shelter and ample swimming space.",
      "Ein artgerechtes Meerwasserbecken mit Rückzug und reichlich Schwimmraum.",
    ],
    [
      "Suitable animal foods; some species need hard-shelled foods for their growing teeth.",
      "Passende tierische Kost; manche Arten brauchen hartschaliges Futter für nachwachsende Zähne.",
    ],
    [
      "Never frighten a real puffer into inflating. It is a stress response.",
      "Echte Kugelfische niemals zum Aufblasen erschrecken. Das ist eine Stressreaktion.",
    ],
    [
      "Its beak-like teeth can crush hard prey.",
      "Seine schnabelartigen Zähne können harte Beute zerdrücken.",
    ],
  ]),
  ray: profile("Marine ray inspiration / Vorbild: Meeresrochen", [
    [
      "Our spotted ray is a miniature fantasy visitor inspired by ocean rays.",
      "Unser Fleckenrochen ist ein kleiner Fantasiegast nach dem Vorbild von Meeresrochen.",
    ],
    [
      "Ray species have very different lifespans; a generic game ray has no exact real age range.",
      "Rochenarten werden sehr unterschiedlich alt; für den allgemeinen Spielrochen gibt es keine genaue echte Altersspanne.",
    ],
    [
      "Social behaviour varies by species; compatible groups need enormous space.",
      "Das Sozialverhalten ist artspezifisch; verträgliche Gruppen brauchen enorm viel Platz.",
    ],
    [
      "Ocean rays need seawater. Freshwater stingrays are different animals.",
      "Meeresrochen brauchen Salzwasser. Süßwasserstechrochen sind andere Tiere.",
    ],
    [
      "Large ocean rays belong in specialist public aquariums, not ordinary home fish tanks.",
      "Große Meeresrochen gehören in spezialisierte Schauaquarien, nicht in normale Heimaquarien.",
    ],
    [
      "Many eat bottom animals such as shellfish, crustaceans and worms.",
      "Viele fressen Bodentiere wie Muscheln, Krebstiere und Würmer.",
    ],
    [
      "Learn by watching from a distance; real rays are not hand-held pets.",
      "Aus Abstand beobachten und lernen; echte Rochen sind keine Tiere zum Anfassen.",
    ],
    [
      "Their wing-like fins help them move through water.",
      "Ihre flügelartigen Flossen helfen ihnen, sich durch das Wasser zu bewegen.",
    ],
  ]),
  jelly: profile("Aurelia species / Arten", [
    [
      "Moon jellies are drifting invertebrates, not fish.",
      "Ohrenquallen sind treibende Wirbellose, keine Fische.",
    ],
    [
      "The floating stage is only part of a life cycle; age depends on species and conditions.",
      "Die schwimmende Form ist nur ein Teil des Lebenszyklus; das Alter hängt von Art und Bedingungen ab.",
    ],
    [
      "A specialist jelly system, not a mixed fish aquarium.",
      "Ein spezielles Quallenbecken, kein gemischtes Fischaquarium.",
    ],
    [
      "Seawater with the temperature and salinity matched to the exact Aurelia species.",
      "Meerwasser mit Temperatur und Salzgehalt passend zur genauen Aurelia-Art.",
    ],
    [
      "A smooth, specially flowing tank keeps delicate bodies away from corners and intakes.",
      "Ein glattes Spezialbecken mit geeigneter Strömung hält empfindliche Körper von Ecken und Ansaugstellen fern.",
    ],
    [
      "Tiny planktonic animals; aquarium keepers use carefully prepared small foods.",
      "Winzige Planktontiere; Fachleute verwenden sorgfältig vorbereitetes kleines Futter.",
    ],
    [
      "Ordinary fish pellets and a normal rectangular tank are not enough.",
      "Normales Fischgranulat und ein gewöhnliches rechteckiges Becken reichen nicht aus.",
    ],
    [
      "A settled polyp can produce young swimming jellies.",
      "Ein festsitzender Polyp kann junge schwimmende Quallen hervorbringen.",
    ],
  ]),
};

/** Deeper chapters add natural history without turning the opening card into a wall of text. */
export interface FishDiscovery {
  native: KnowledgeText;
  adultSize: KnowledgeText;
  anatomy: KnowledgeText;
  lifecycle: KnowledgeText;
  wildDiet: KnowledgeText;
  behavior: KnowledgeText;
  mistakes: KnowledgeText;
}
const discovery = (rows: [string, string][]): FishDiscovery => ({
  native: text(...rows[0]),
  adultSize: text(...rows[1]),
  anatomy: text(...rows[2]),
  lifecycle: text(...rows[3]),
  wildDiet: text(...rows[4]),
  behavior: text(...rows[5]),
  mistakes: text(...rows[6]),
});
export const fishDiscovery: Record<string, FishDiscovery> = {
  ...extraFishDiscovery,
  guppy: discovery([
    [
      "Wild guppies come from northeastern South America and nearby Caribbean islands. Aquarium colours were developed through many generations of breeding.",
      "Wildguppys stammen aus dem nordöstlichen Südamerika und von nahen Karibikinseln. Aquarienfarben entstanden durch viele Zuchtgenerationen.",
    ],
    [
      "Usually a few centimetres long, around 3–6 cm. Females are generally larger; a flowing tail makes some males look bigger.",
      "Meist wenige Zentimeter, etwa 3–6 cm. Weibchen sind gewöhnlich größer; eine lange Schwanzflosse lässt manche Männchen größer wirken.",
    ],
    [
      "The fan tail helps steer. A male has a narrow modified anal fin; the female’s anal fin is fan-shaped.",
      "Der Fächerschwanz hilft beim Steuern. Männchen haben eine schmale umgebildete Afterflosse; bei Weibchen ist sie fächerförmig.",
    ],
    [
      "Guppies give birth to swimming young. Adults may eat babies, so dense plant cover matters in a breeding aquarium.",
      "Guppys bringen schwimmende Junge zur Welt. Erwachsene können Babys fressen; dichter Pflanzenbewuchs ist im Zuchtbecken deshalb wichtig.",
    ],
    [
      "They pick at tiny animals, algae and other edible particles. A guppy’s small mouth needs appropriately small food.",
      "Sie zupfen winzige Tiere, Algen und andere essbare Teilchen auf. Zum kleinen Guppymaul gehört entsprechend kleines Futter.",
    ],
    [
      "Males display their colours to females. Following another fish can be courtship, not a game of friendship.",
      "Männchen zeigen Weibchen ihre Farben. Hinterherschwimmen kann Balz sein und ist nicht immer ein Freundschaftsspiel.",
    ],
    [
      "Constant begging does not mean constant hunger. Plan homes for babies before breeding, and never release guppies outdoors.",
      "Betteln bedeutet nicht dauernden Hunger. Plane vor der Zucht Plätze für die Jungen und setze Guppys niemals draußen aus.",
    ],
  ]),
  goldfish: discovery([
    [
      "Goldfish descend from East Asian freshwater fish. People in China bred the ornamental forms long before modern aquariums existed.",
      "Goldfische stammen von ostasiatischen Süßwasserfischen ab. In China züchteten Menschen Schmuckformen lange vor den heutigen Aquarien.",
    ],
    [
      "Adult size depends on the breed; many reach 20 cm or more. A small shop youngster is not its final size.",
      "Die Endgröße hängt von der Zuchtform ab; viele erreichen 20 cm oder mehr. Ein kleines Jungtier bleibt nicht so klein.",
    ],
    [
      "The lateral line senses water movement. Paired fins steer and brake; body shape can differ greatly between fancy breeds.",
      "Die Seitenlinie spürt Wasserbewegungen. Paarige Flossen steuern und bremsen; die Körperform unterscheidet sich stark zwischen Zuchtformen.",
    ],
    [
      "Sticky eggs attach to plants. The adults do not guard them and may eat eggs or fry.",
      "Klebrige Eier haften an Pflanzen. Die Eltern bewachen sie nicht und können Eier oder Jungfische fressen.",
    ],
    [
      "Goldfish search plants and the bottom for small invertebrates and plant material. They are varied feeders, not just algae eaters.",
      "Goldfische suchen zwischen Pflanzen und am Boden nach kleinen Wirbellosen und Pflanzenkost. Sie fressen vielfältig, nicht nur Algen.",
    ],
    [
      "They investigate their surroundings and can learn familiar feeding routines. Their memory is not limited to a few seconds.",
      "Sie erkunden ihre Umgebung und können Fütterungsabläufe lernen. Ihr Gedächtnis ist nicht auf wenige Sekunden begrenzt.",
    ],
    [
      "A bowl is not a suitable lifelong home. Match companions to swimming ability, and allow for substantial adult waste and space needs.",
      "Eine Kugel ist kein geeignetes Zuhause fürs Leben. Nachbarn müssen zum Schwimmvermögen passen; Platz und Filterleistung müssen für Erwachsene reichen.",
    ],
  ]),
  tetra: discovery([
    [
      "Neon tetras live in shaded South American freshwater streams. Fallen leaves and overhanging plants can make these places surprisingly dim.",
      "Neonsalmler leben in beschatteten südamerikanischen Süßwasserbächen. Laub und überhängende Pflanzen können diese Lebensräume erstaunlich dunkel machen.",
    ],
    [
      "About 3–4 cm as adults. The similarly named cardinal tetra is a different species with different needs.",
      "Ausgewachsen etwa 3–4 cm. Der ähnlich aussehende Rote Neon ist eine andere Art mit anderen Bedürfnissen.",
    ],
    [
      "A bright blue stripe reflects light along the side. The red marking covers the rear part of this species’ body.",
      "Ein leuchtend blauer Streifen reflektiert Licht an der Seite. Die rote Zeichnung liegt bei dieser Art am hinteren Körperteil.",
    ],
    [
      "They scatter tiny eggs rather than give birth. Eggs and newly hatched fry require more specialised conditions than adult fish.",
      "Sie verstreuen winzige Eier, statt lebende Junge zu gebären. Eier und frisch geschlüpfte Larven brauchen speziellere Bedingungen als Erwachsene.",
    ],
    [
      "Tiny insects, larvae and other small food particles fit their mouths. Large pellets can leave a neon unable to eat.",
      "Winzige Insekten, Larven und kleine Futterteilchen passen ins Maul. Große Körner kann ein Neon womöglich nicht fressen.",
    ],
    [
      "A group offers reassurance. They may spread out in a calm aquarium and gather more closely when alarmed.",
      "Eine Gruppe gibt Sicherheit. Im ruhigen Aquarium verteilen sie sich und rücken bei einer Störung enger zusammen.",
    ],
    [
      "Do not keep a lone neon as a decoration. Choose a settled, stable aquarium and avoid companions large enough to swallow it.",
      "Halte keinen einzelnen Neon als Schmuck. Wähle ein eingefahrenes, stabiles Aquarium ohne Nachbarn, die ihn verschlucken könnten.",
    ],
  ]),
  angelfish: discovery([
    [
      "Freshwater angelfish belong to South America’s Amazon region. Their tall shape fits among submerged roots and vegetation.",
      "Süßwasserskalare gehören zur Amazonasregion Südamerikas. Ihre hohe Gestalt passt zwischen untergetauchte Wurzeln und Pflanzen.",
    ],
    [
      "Body length and fin height are different measurements. Adults need a tall aquarium; their fins can make them much taller than long.",
      "Körperlänge und Flossenhöhe sind verschiedene Maße. Erwachsene brauchen ein hohes Aquarium und können mit Flossen höher als lang sein.",
    ],
    [
      "The body is flattened from side to side. Long pelvic fins trail below; these are fins, not legs or whiskers.",
      "Der Körper ist seitlich abgeflacht. Lange Bauchflossen hängen darunter; das sind Flossen, keine Beine oder Barteln.",
    ],
    [
      "A pair cleans a leaf or another upright surface before laying eggs. Parents may guard and fan the clutch.",
      "Ein Paar putzt vor der Eiablage ein Blatt oder eine andere aufrechte Fläche. Eltern können das Gelege bewachen und befächeln.",
    ],
    [
      "Small aquatic animals are important food. A peaceful-looking adult may still regard a tiny fish as prey.",
      "Kleine Wassertiere sind wichtige Nahrung. Auch ein friedlich wirkender erwachsener Skalar kann einen winzigen Fisch als Beute betrachten.",
    ],
    [
      "Youngsters can live together, but breeding adults defend space. A pair’s territory changes the behaviour of the whole aquarium.",
      "Jungtiere können zusammenleben; brütende Erwachsene verteidigen Raum. Das Revier eines Paares verändert das Verhalten im ganzen Becken.",
    ],
    [
      "Do not judge space by a small youngster. Avoid fin-nipping neighbours and provide escape routes around breeding territories.",
      "Beurteile den Platz nicht nach einem kleinen Jungtier. Vermeide Flossenknabberer und schaffe Ausweichwege um Brutreviere.",
    ],
  ]),
  snail: discovery([
    [
      "Our window snail stands for several freshwater species. Ramshorn, bladder and nerite snails have different origins and breeding needs.",
      "Unsere Scheibenschnecke steht für mehrere Süßwasserarten. Posthorn-, Blasen- und Rennschnecken haben unterschiedliche Herkunft und Fortpflanzung.",
    ],
    [
      "Check the exact species: common aquarium snails range from tiny dots to several centimetres of shell.",
      "Prüfe die genaue Art: Häufige Aquarienschnecken reichen vom winzigen Punkt bis zu mehreren Zentimetern Gehäuse.",
    ],
    [
      "A muscular foot glides over surfaces. A rasping mouth called a radula scrapes food; the shell protects the soft body.",
      "Ein muskulöser Fuß gleitet über Flächen. Eine Raspelzunge namens Radula schabt Nahrung; das Gehäuse schützt den weichen Körper.",
    ],
    [
      "Some lay jelly-like egg clusters underwater. Others have very different eggs or larvae; not every snail multiplies in freshwater.",
      "Manche legen gallertige Eipakete unter Wasser. Andere haben ganz andere Eier oder Larven; nicht jede Schnecke vermehrt sich im Süßwasser.",
    ],
    [
      "Biofilm, algae and decaying plant material feed many snails. Different species also need different supplementary foods.",
      "Aufwuchs, Algen und abgestorbene Pflanzenteile ernähren viele Schnecken. Unterschiedliche Arten brauchen auch unterschiedliches Zusatzfutter.",
    ],
    [
      "They explore with their feelers and graze slowly. Seeing one on the glass is normal; it is following a food-covered surface.",
      "Sie erkunden mit ihren Fühlern und weiden langsam. Auf der Scheibe folgen sie ganz normal einer bewachsenen Futterfläche.",
    ],
    [
      "A snail is not a substitute for cleaning. Identify it before choosing companions, food or any aquarium treatment.",
      "Eine Schnecke ersetzt die Reinigung nicht. Bestimme ihre Art, bevor du Nachbarn, Futter oder Mittel fürs Aquarium auswählst.",
    ],
  ]),
  frog: discovery([
    [
      "The game’s frog resembles a European pond visitor. Common frogs use ponds for breeding and damp places on land for shelter.",
      "Unser Spielfrosch ähnelt einem europäischen Teichbesucher. Grasfrösche nutzen Teiche zur Fortpflanzung und feuchte Landplätze als Versteck.",
    ],
    [
      "A common frog can approach 10 cm in body length. It is not the tiny African dwarf frog sold for aquariums.",
      "Ein Grasfrosch kann etwa 10 cm Körperlänge erreichen. Er ist nicht der kleine Zwergkrallenfrosch aus dem Aquarienhandel.",
    ],
    [
      "Long hind legs power jumps. Moist skin is important for breathing; adult frogs also use lungs.",
      "Lange Hinterbeine treiben Sprünge an. Feuchte Haut ist für die Atmung wichtig; erwachsene Frösche nutzen auch Lungen.",
    ],
    [
      "Eggs in jelly become tadpoles. Legs develop, the tail shrinks and a froglet leaves the water: this change is metamorphosis.",
      "Aus Eiern im Gallertballen werden Kaulquappen. Beine wachsen, der Schwanz schrumpft: Diese Verwandlung zum Jungfrosch heißt Metamorphose.",
    ],
    [
      "Adults eat moving invertebrates such as insects, worms and slugs. Their diet differs from that of young tadpoles.",
      "Erwachsene fressen bewegliche Wirbellose wie Insekten, Würmer und Schnecken. Ihre Nahrung unterscheidet sich von der junger Kaulquappen.",
    ],
    [
      "Frogs often shelter by day and forage in damp conditions. They return to breeding water rather than living permanently on a lily pad.",
      "Frösche verstecken sich oft tagsüber und suchen bei Feuchtigkeit Nahrung. Sie kehren zum Laichgewässer zurück, wohnen aber nicht ständig auf Seerosen.",
    ],
    [
      "Leave wild frogs and spawn where they belong. A common frog needs land and water, not an ordinary fish tank.",
      "Lass wilde Frösche und Laich in ihrem Lebensraum. Ein Grasfrosch braucht Land und Wasser, kein gewöhnliches Fischbecken.",
    ],
  ]),
  betta: discovery([
    [
      "Wild Betta splendens comes from mainland Southeast Asia, including shallow, vegetated freshwater habitats. Fancy aquarium strains look different.",
      "Wilde Betta splendens stammen aus dem südostasiatischen Festland, auch aus flachen, bewachsenen Süßgewässern. Aquarienzuchtformen sehen anders aus.",
    ],
    [
      "Roughly 6–7 cm long, depending on strain and how the fins are measured. Long fins do not mean a stronger swimmer.",
      "Etwa 6–7 cm lang, je nach Zuchtform und Messung der Flossen. Lange Flossen bedeuten nicht mehr Schwimmkraft.",
    ],
    [
      "A labyrinth organ lets a betta breathe surface air as well as use gills. Easy access to the surface is essential.",
      "Ein Labyrinthorgan lässt den Kampffisch neben der Kiemenatmung Luft an der Oberfläche holen. Der Weg dorthin muss frei bleiben.",
    ],
    [
      "Males build bubble nests. Eggs are placed among the bubbles, and the male tends them; breeding requires a careful separate plan.",
      "Männchen bauen Schaumnester. Eier kommen zwischen die Bläschen und werden betreut; eine Zucht braucht eine sorgfältige eigene Planung.",
    ],
    [
      "Insects and other small animals are natural prey. Betta food should match this animal-based diet, not consist of plant roots.",
      "Insekten und andere kleine Tiere sind natürliche Beute. Passendes Futter berücksichtigt diese tierische Kost; Pflanzenwurzeln ersetzen es nicht.",
    ],
    [
      "Males display spread fins to rivals. Repeated mirror challenges are stressful, even though a brief display can look beautiful.",
      "Männchen spreizen vor Rivalen ihre Flossen. Ständige Spiegelreize bedeuten Stress, auch wenn eine kurze Drohgebärde schön aussieht.",
    ],
    [
      "Air breathing does not make a cold vase suitable. Provide warm filtered water, resting leaves and gentle flow.",
      "Luftatmung macht eine kalte Vase nicht geeignet. Sorge für warmes gefiltertes Wasser, Ruheblätter und sanfte Strömung.",
    ],
  ]),
  discus: discovery([
    [
      "Discus come from the Amazon basin, where submerged branches and sheltered areas provide cover. Aquarium strains may differ from wild populations.",
      "Diskusfische stammen aus dem Amazonasbecken. Untergetauchte Äste und ruhige Bereiche bieten Deckung; Zuchtformen können von Wildbeständen abweichen.",
    ],
    [
      "Adults are broad, plate-shaped fish, often around 15–20 cm. A group needs space for every grown individual.",
      "Erwachsene sind breite, scheibenförmige Fische, oft etwa 15–20 cm groß. Eine Gruppe braucht Platz für jedes ausgewachsene Tier.",
    ],
    [
      "A thin side profile lets the round body slip between cover. Body colour and dark bars can change with condition and mood.",
      "Von vorn wirkt der runde Körper schmal und passt zwischen Deckungen. Farbe und dunkle Streifen können sich mit Zustand und Stimmung ändern.",
    ],
    [
      "Parents guard eggs on a cleaned surface. Young fry feed on a nutritious skin secretion produced by their parents.",
      "Eltern bewachen Eier auf einer geputzten Fläche. Junge Larven ernähren sich von einem nahrhaften Hautsekret ihrer Eltern.",
    ],
    [
      "They take small aquatic animals and other available food. A real aquarium diet must be varied and suited to the strain.",
      "Sie fressen kleine Wassertiere und weitere verfügbare Nahrung. Im echten Aquarium muss die Kost abwechslungsreich und zur Zuchtform passend sein.",
    ],
    [
      "Groups develop a pecking order. Watch whether shy individuals actually reach food instead of assuming the whole group has eaten.",
      "Gruppen entwickeln eine Rangordnung. Beobachte, ob scheue Tiere wirklich ans Futter kommen, statt die ganze Gruppe für satt zu halten.",
    ],
    [
      "Mixing fish only because they share bright colours can fail. Discus warmth and feeding needs do not suit every community fish.",
      "Fische nur nach schönen Farben zu mischen kann scheitern. Wärme- und Futterbedarf von Diskusfischen passen nicht zu jedem Gesellschaftsfisch.",
    ],
  ]),
  zebrafish: discovery([
    [
      "Zebrafish are native to South Asian waters, including India, Bangladesh and Nepal. They often occupy shallow, slow freshwater edges.",
      "Zebrabärblinge stammen aus südasiatischen Gewässern, unter anderem in Indien, Bangladesch und Nepal. Oft bewohnen sie flache, ruhige Uferbereiche.",
    ],
    [
      "Usually about 4–5 cm in aquariums. Their small size does not remove the need for a long swimming space.",
      "Im Aquarium meist etwa 4–5 cm. Trotz ihrer geringen Größe brauchen sie eine lange Schwimmstrecke.",
    ],
    [
      "Dark and pale stripes run lengthwise. The streamlined body and upward-angled mouth suit quick swimming and picking food near the surface.",
      "Dunkle und helle Streifen verlaufen längs. Stromlinienkörper und leicht nach oben gerichtetes Maul passen zum schnellen Schwimmen und Fressen oben.",
    ],
    [
      "They scatter eggs among fine plants or other cover. Adults do not guard the eggs and may eat them.",
      "Sie verstreuen Eier zwischen feinen Pflanzen oder anderer Deckung. Erwachsene bewachen die Eier nicht und können sie fressen.",
    ],
    [
      "Small insects, crustaceans and other tiny foods are part of their diet. Food must be small enough for rapid little bites.",
      "Kleine Insekten, Krebstiere und andere winzige Nahrung gehören zur Kost. Futter muss für kleine, schnelle Bissen passen.",
    ],
    [
      "They are active daytime shoaling fish. Individuals still have social relationships; a shoal is not a perfectly synchronised machine.",
      "Sie sind tagaktive Gruppenfische. Einzelne Tiere haben dennoch soziale Beziehungen; ein Schwarm ist keine perfekt gleichgeschaltete Maschine.",
    ],
    [
      "Keep a suitable group and a secure lid. Slow, long-finned neighbours may not enjoy their constant busy swimming.",
      "Halte eine passende Gruppe unter einem sicheren Deckel. Langsame Nachbarn mit langen Flossen mögen die ständige Betriebsamkeit oft nicht.",
    ],
  ]),
  cory: discovery([
    [
      "Cory catfish come from South American freshwater habitats. Many species share this name, so check which one you are planning for.",
      "Panzerwelse stammen aus südamerikanischen Süßgewässern. Viele Arten tragen diesen Namen; prüfe deshalb, welche du wirklich halten möchtest.",
    ],
    [
      "Dwarf species stay much smaller than the familiar larger cories. Species identity matters more than the size of a shop youngster.",
      "Zwergarten bleiben viel kleiner als bekannte größere Panzerwelse. Die Art ist wichtiger als die Größe eines Jungtiers im Laden.",
    ],
    [
      "Protective body plates give them their armoured appearance. Sensitive barbels around the mouth help them find food on the bottom.",
      "Körperplatten bilden ihren Panzer. Empfindliche Barteln um das Maul helfen, Futter am Boden aufzuspüren.",
    ],
    [
      "Many cories attach eggs to leaves, glass or other surfaces. Eggs are not guarded like a cichlid’s nest.",
      "Viele Panzerwelse heften Eier an Blätter, Glas oder andere Flächen. Sie bewachen kein Nest wie manche Buntbarsche.",
    ],
    [
      "They search for small invertebrates and edible particles. They need their own sinking food; fish waste is not a meal.",
      "Sie suchen kleine Wirbellose und essbare Teilchen. Sie brauchen eigenes sinkendes Futter; Fischkot ist keine Mahlzeit.",
    ],
    [
      "Cories explore in groups and can dash up to gulp air. A brief surface visit can be normal for these fish.",
      "Panzerwelse erkunden in Gruppen und können zum Luftschnappen hochschießen. Ein kurzer Oberflächenbesuch kann bei ihnen normal sein.",
    ],
    [
      "Avoid sharp, dirty substrate and relying on leftovers alone. Check that sinking food reaches the group before other fish take it.",
      "Vermeide scharfen, schmutzigen Bodengrund und reine Restefütterung. Prüfe, ob das Futter die Gruppe vor anderen Fischen erreicht.",
    ],
  ]),
  swordtail: discovery([
    [
      "Wild green swordtails come from Central American freshwater. Many colourful shop forms have a long history of selective breeding.",
      "Wilde Grüne Schwertträger stammen aus mittelamerikanischem Süßwasser. Viele bunte Handelsformen haben eine lange Zuchtgeschichte.",
    ],
    [
      "Larger than a platy: adults may exceed 10 cm. The male’s sword adds length but is not the whole body.",
      "Größer als ein Platy: Erwachsene können über 10 cm erreichen. Das Schwert verlängert den Schwanz, gehört aber nicht zum Rumpf.",
    ],
    [
      "The male’s sword is an extension of the lower tail fin. It is a display feature, not a stabbing weapon.",
      "Das Schwert des Männchens verlängert die untere Schwanzflosse. Es ist ein Schau-Merkmal, keine Stichwaffe.",
    ],
    [
      "Females give birth to live fry. A breeding plan must include room for youngsters and plant cover away from hungry adults.",
      "Weibchen bringen lebende Jungfische zur Welt. Zur Zuchtplanung gehören Platz für Nachwuchs und Pflanzenverstecke vor hungrigen Erwachsenen.",
    ],
    [
      "They take small animals as well as plant material. Offer a varied diet rather than treating them as strict meat eaters.",
      "Sie fressen kleine Tiere und Pflanzenkost. Biete Abwechslung, statt sie als reine Fleischfresser zu behandeln.",
    ],
    [
      "Males display and compete. Dense planting and swimming room help fish move away instead of being trapped in a corner.",
      "Männchen zeigen sich und konkurrieren. Pflanzen und Schwimmraum helfen beim Ausweichen, statt Tiere in einer Ecke festzusetzen.",
    ],
    [
      "They can jump, so cover the tank. Do not assume a short-tailed youngster will stay platy-sized forever.",
      "Sie können springen; das Becken braucht einen Deckel. Ein kurzschwänziges Jungtier bleibt nicht automatisch für immer platy-klein.",
    ],
  ]),
  platy: discovery([
    [
      "Platies trace their origins to Central American freshwater. Most aquarium colours are domesticated forms rather than a map of wild colours.",
      "Platys stammen ursprünglich aus mittelamerikanischem Süßwasser. Die meisten Aquarienfarben sind Zuchtformen, kein Abbild der natürlichen Farbverteilung.",
    ],
    [
      "Common platies are roughly 5–7 cm long. Females tend to be fuller-bodied than males.",
      "Häufige Platys werden ungefähr 5–7 cm lang. Weibchen sind meist kräftiger gebaut als Männchen.",
    ],
    [
      "A compact body and fan tail distinguish them from long swordtails. A male’s modified anal fin is used in reproduction.",
      "Kompakter Körper und Fächerschwanz unterscheiden sie von langen Schwertträgern. Die umgebildete Afterflosse des Männchens dient der Fortpflanzung.",
    ],
    [
      "They are livebearers. Babies are small independent swimmers, but adults may still eat them if there is little cover.",
      "Sie sind lebendgebärend. Babys schwimmen selbstständig, können ohne genügend Deckung aber von Erwachsenen gefressen werden.",
    ],
    [
      "Small animals and plant material both belong on the menu. Grazing does not mean that algae alone provide a complete diet.",
      "Kleine Tiere und Pflanzenkost gehören auf den Speiseplan. Algenzupfen bedeutet nicht, dass Algen allein eine vollständige Ernährung bieten.",
    ],
    [
      "These sociable fish investigate the middle and upper water. Males may follow females persistently; watch for animals needing a break.",
      "Diese geselligen Fische erkunden mittlere und obere Wasserschichten. Männchen können Weibchen hartnäckig folgen; achte auf Ruhebedürftige.",
    ],
    [
      "Plan population growth before keeping mixed sexes. Do not keep adding food just because the group rushes to the front glass.",
      "Plane den Nachwuchs vor gemischtgeschlechtlicher Haltung. Gib nicht dauernd Futter nach, nur weil die Gruppe zur Frontscheibe kommt.",
    ],
  ]),
  shrimp: discovery([
    [
      "The freshwater example is Neocaridina davidi from East Asia. Marine cleaner shrimps are different animals, despite sharing our game’s sprite.",
      "Das Süßwasserbeispiel ist Neocaridina davidi aus Ostasien. Meeresputzergarnelen sind andere Tiere, auch wenn sie dieselbe Spielfigur teilen.",
    ],
    [
      "Cherry shrimp grow to only a few centimetres. A tiny shrimp still needs mature surfaces to graze and safe filter openings.",
      "Zwerggarnelen werden nur wenige Zentimeter lang. Auch ein kleines Tier braucht bewachsene Weideflächen und sichere Filteröffnungen.",
    ],
    [
      "Their hard covering is an exoskeleton. They shed it to grow; long antennae explore while small legs pick up food.",
      "Ihre harte Hülle ist ein Außenskelett. Zum Wachsen wird sie abgestreift; lange Fühler erkunden und kleine Beine sammeln Futter.",
    ],
    [
      "A female cherry shrimp carries eggs beneath her abdomen. The hatchlings look like miniature shrimp rather than free-drifting marine larvae.",
      "Ein Zwerggarnelenweibchen trägt Eier unter dem Hinterleib. Die Jungen ähneln winzigen Garnelen statt frei treibenden Meereslarven.",
    ],
    [
      "They graze microbial films and tiny edible material on plants and wood. This living surface coating is more than visible algae.",
      "Sie weiden Mikrobenfilme und winzige Nahrung auf Pflanzen und Holz ab. Dieser lebendige Belag ist mehr als sichtbare Algen.",
    ],
    [
      "Freshly moulted shrimp hide while their new covering hardens. An empty translucent shell is not necessarily a dead shrimp.",
      "Frisch gehäutete Garnelen verstecken sich, während die neue Hülle härtet. Eine leere durchsichtige Haut ist nicht unbedingt ein totes Tier.",
    ],
    [
      "Sudden water changes and hungry fish can be dangerous. Check treatment labels with an adult; products safe for fish may harm invertebrates.",
      "Plötzliche Wasseränderungen und hungrige Fische können gefährlich sein. Prüfe Mittel mit Erwachsenen; Fischverträglichkeit bedeutet nicht Garnelenverträglichkeit.",
    ],
  ]),
  crab: discovery([
    [
      "Our freshwater example is a vampire crab from Java. It belongs beside tropical streams, not permanently beneath the water.",
      "Unser Süßwasserbeispiel ist eine Vampirkrabbe aus Java. Sie gehört an tropische Bachufer und nicht ständig unter Wasser.",
    ],
    [
      "Its body is only a few centimetres across. Measure the shell separately from the wider span of the legs.",
      "Ihr Körper ist nur wenige Zentimeter breit. Miss den Panzer getrennt von der größeren Spannweite der Beine.",
    ],
    [
      "A crab has a broad shell, jointed legs and claws. Eyes on stalks can look around while the body stays sheltered.",
      "Eine Krabbe hat einen breiten Panzer, Gelenkbeine und Scheren. Stielaugen blicken umher, während der Körper im Versteck bleibt.",
    ],
    [
      "Geosesarma females carry eggs until tiny crabs emerge. Marine crabs often have a different life cycle with drifting larvae.",
      "Geosesarma-Weibchen tragen Eier, bis winzige Krabben erscheinen. Meereskrabben haben oft einen anderen Lebenszyklus mit treibenden Larven.",
    ],
    [
      "Vampire crabs take small animals and plant material. A mixed diet differs from simply scavenging whatever fish leave behind.",
      "Vampirkrabben fressen kleine Tiere und Pflanzenkost. Eine gemischte Ernährung ist mehr als nur das Aufsammeln von Fischresten.",
    ],
    [
      "They shelter among roots and leaf litter. After moulting, a crab needs a quiet refuge while its new shell becomes firm.",
      "Sie suchen Schutz zwischen Wurzeln und Laub. Nach der Häutung brauchen sie Ruhe, bis der neue Panzer fest wird.",
    ],
    [
      "Provide the correct land-and-water habitat for the exact species. A game crab sharing fish water is fantasy, not a housing guide.",
      "Biete den passenden Land-Wasser-Lebensraum für die genaue Art. Eine Spielkrabbe im Fischwasser ist Fantasie, keine Haltungsvorlage.",
    ],
  ]),
  clownfish: discovery([
    [
      "Ocellaris clownfish live on tropical Indo-Pacific reefs. Their close relationship with host anemones shapes their natural home.",
      "Falsche Clownfische leben an tropischen indopazifischen Riffen. Die enge Beziehung zu Wirtsanemonen prägt ihr natürliches Zuhause.",
    ],
    [
      "Adults are roughly hand-sized or smaller, around 8–11 cm. The female in a pair is normally larger.",
      "Erwachsene werden ungefähr 8–11 cm lang. In einem Paar ist das Weibchen gewöhnlich größer.",
    ],
    [
      "A protective mucus coating helps them live among anemone tentacles. An anemone is itself an animal, not a plant.",
      "Eine schützende Schleimschicht hilft zwischen Anemonententakeln. Die Anemone ist selbst ein Tier und keine Pflanze.",
    ],
    [
      "Eggs are attached to a cleaned surface near the home. The male tends the clutch; tiny larvae need specialist rearing food.",
      "Eier haften auf einer geputzten Fläche beim Zuhause. Das Männchen pflegt das Gelege; winzige Larven brauchen spezielles Aufzuchtfutter.",
    ],
    [
      "They catch tiny drifting animals and also take algae. Food carried past their anemone lets them stay near its protection.",
      "Sie fangen winzige treibende Tiere und fressen auch Algen. Vorbeitreibende Nahrung erlaubt ihnen, nahe am Schutz der Anemone zu bleiben.",
    ],
    [
      "A group has a size-based hierarchy. The dominant female and breeding male are not simply interchangeable companions.",
      "Eine Gruppe hat eine größenabhängige Rangordnung. Das dominante Weibchen und das Zuchtmännchen sind keine beliebig austauschbaren Partner.",
    ],
    [
      "Captive-bred clownfish do not require an anemone to thrive. Anemones need demanding care; never add one just as a toy.",
      "Nachgezüchtete Clownfische brauchen nicht zwingend eine Anemone. Anemonen sind anspruchsvoll; setze keine bloß als Spielzeug ein.",
    ],
  ]),
  tang: discovery([
    [
      "This is the Pacific blue tang, Paracanthurus hepatus, from Indo-Pacific reefs. The Atlantic blue tang is a different species.",
      "Gemeint ist Paracanthurus hepatus von indopazifischen Riffen. Der Atlantische Blaue Doktorfisch ist eine andere Art.",
    ],
    [
      "It can reach about 30 cm. A tiny blue youngster eventually needs a very large swimming area.",
      "Er kann ungefähr 30 cm erreichen. Ein winziges blaues Jungtier braucht später eine sehr große Schwimmfläche.",
    ],
    [
      "A dark palette-like marking crosses its blue side. Surgeonfish have defensive spines near the tail; avoid handling them casually.",
      "Eine dunkle palettenartige Zeichnung liegt auf der blauen Seite. Doktorfische besitzen Abwehrdornen am Schwanz und sollten nicht sorglos angefasst werden.",
    ],
    [
      "Eggs and larvae drift in the water. Raising this species in captivity required years of specialised aquaculture research.",
      "Eier und Larven treiben im Wasser. Die erfolgreiche Nachzucht dieser Art erforderte jahrelange spezialisierte Aquakulturforschung.",
    ],
    [
      "Small drifting animals and algae contribute to its diet. A varied marine feeding plan is needed, not only lettuce.",
      "Kleine treibende Tiere und Algen gehören zur Nahrung. Nötig ist ein abwechslungsreicher Meeresspeiseplan, nicht nur Salat.",
    ],
    [
      "It can tuck itself into reef crevices when alarmed. Hiding is a request for security, not a reason to chase it out.",
      "Bei Gefahr kann es sich in Riffspalten zurückziehen. Verstecken zeigt Schutzbedarf; scheuche es nicht heraus.",
    ],
    [
      "Do not buy one for a small tank because a baby fits today. Plan adult size, long-term space and compatible marine neighbours.",
      "Kaufe keines fürs kleine Becken, nur weil das Baby heute hineinpasst. Plane Endgröße, dauerhaften Platz und passende Meeresnachbarn.",
    ],
  ]),
  butterfly: discovery([
    [
      "Butterflyfishes are a large family of mostly tropical reef fishes. Our drawing represents the family rather than one exact species.",
      "Falterfische sind eine große Familie meist tropischer Rifffische. Unsere Zeichnung steht für die Familie, nicht für genau eine Art.",
    ],
    [
      "Many are hand-sized; species differ considerably. Identify the scientific name before relying on any adult-size or care figure.",
      "Viele sind handgroß, doch Arten unterscheiden sich stark. Prüfe den wissenschaftlichen Namen vor jeder Größen- oder Pflegeangabe.",
    ],
    [
      "A flattened body turns between reef structures. Some species have long snouts for reaching food in narrow crevices.",
      "Ein abgeflachter Körper wendet zwischen Riffstrukturen. Manche Arten haben lange Schnauzen, um Nahrung aus schmalen Spalten zu holen.",
    ],
    [
      "They lay eggs; marine larvae look unlike the familiar adult fish. Breeding a home pair is not an easy beginner project.",
      "Sie legen Eier; Meereslarven sehen anders aus als die bekannten Erwachsenen. Ein Paar zu vermehren ist kein einfaches Anfängerprojekt.",
    ],
    [
      "Some eat small invertebrates; others depend heavily on coral polyps. Different butterflyfish cannot all live on the same menu.",
      "Manche fressen kleine Wirbellose, andere sind stark auf Korallenpolypen angewiesen. Nicht jeder Falterfisch verträgt denselben Speiseplan.",
    ],
    [
      "Many patrol particular feeding areas, sometimes in pairs. Their narrow snouts probe rather than shovel food from the bottom.",
      "Viele patrouillieren bestimmte Futtergebiete, manchmal paarweise. Ihre schmalen Schnauzen suchen gezielt, statt Bodenfutter aufzuschaufeln.",
    ],
    [
      "Do not assume a pretty reef fish is coral-safe. Specialist coral feeders may be unsuitable for an ordinary home aquarium.",
      "Ein schöner Rifffisch ist nicht automatisch korallensicher. Spezialisierte Korallenfresser können für ein gewöhnliches Heimaquarium ungeeignet sein.",
    ],
  ]),
  seahorse: discovery([
    [
      "Seahorses live in many coastal habitats, including seagrass and reefs. A species from cool water needs different care from a tropical one.",
      "Seepferdchen leben in Küstenräumen wie Seegraswiesen und Riffen. Kaltwasserarten brauchen andere Pflege als tropische Arten.",
    ],
    [
      "Species range from tiny to much taller animals. Upright swimming and courtship mean height matters as well as tank length.",
      "Die Arten reichen von winzig bis deutlich größer. Aufrechtes Schwimmen und Balz machen neben der Beckenlänge auch die Höhe wichtig.",
    ],
    [
      "Bony plates protect the body. A grasping tail anchors to safe supports, and the tube-shaped mouth sucks in small prey.",
      "Knochenplatten schützen den Körper. Ein Greifschwanz hält an sicheren Stützen; das Röhrenmaul saugt kleine Beute ein.",
    ],
    [
      "The female transfers eggs into the male’s brood pouch. He carries the developing young and releases miniature seahorses.",
      "Das Weibchen übergibt Eier in die Bruttasche des Männchens. Es trägt die Jungen aus und entlässt kleine Seepferdchen.",
    ],
    [
      "Tiny crustaceans are important prey. Captive-bred individuals accustomed to suitable frozen food still need patient, attentive feeding.",
      "Winzige Krebstiere sind wichtige Beute. Nachzuchten, die passendes Frostfutter kennen, brauchen trotzdem geduldige und aufmerksame Fütterung.",
    ],
    [
      "They often wait while gripping a perch, then make a quick feeding strike. Slow cruising does not mean they cannot hunt.",
      "Oft warten sie festgeklammert an einer Stütze und schnappen dann schnell zu. Langsames Schwimmen bedeutet nicht, dass sie nicht jagen.",
    ],
    [
      "Fast feeders can take their meals first. Avoid unsuitable stinging hitching posts and never pull a gripping seahorse free by force.",
      "Schnelle Fresser können ihnen Mahlzeiten wegnehmen. Vermeide ungeeignete nesselnde Haltepunkte und ziehe festhaltende Seepferdchen niemals gewaltsam los.",
    ],
  ]),
  mandarin: discovery([
    [
      "Mandarinfish live in sheltered western Pacific reef areas. Rubble and living surfaces hold the small prey they search for.",
      "Mandarinfische leben in geschützten Riffbereichen des westlichen Pazifiks. Geröll und bewachsene Flächen beherbergen ihre winzigen Beutetiere.",
    ],
    [
      "A small dragonet, around 6–8 cm. Small body size does not make its feeding requirements simple.",
      "Ein kleiner Leierfisch von etwa 6–8 cm. Eine geringe Körpergröße macht seinen Futterbedarf nicht einfach.",
    ],
    [
      "The colourful body has a protective mucus covering. Broad fins let it make careful little movements close to the reef.",
      "Der bunte Körper trägt eine schützende Schleimhülle. Breite Flossen erlauben vorsichtige kleine Bewegungen dicht am Riff.",
    ],
    [
      "During courtship a pair rises from the reef and releases eggs into the water. The tiny larvae need specialised rearing.",
      "Bei der Balz steigt ein Paar vom Riff auf und gibt Eier ins Wasser ab. Die winzigen Larven brauchen spezialisierte Aufzucht.",
    ],
    [
      "They pick small crustaceans such as copepods from surfaces throughout the day. A mature prey supply matters greatly.",
      "Sie picken tagsüber kleine Krebstiere wie Ruderfußkrebse von Oberflächen. Ein gut entwickeltes Beuteangebot ist besonders wichtig.",
    ],
    [
      "Foraging can look like a slow walk between rocks. Males can be territorial despite the fish’s gentle-looking appearance.",
      "Die Futtersuche wirkt wie ein langsamer Spaziergang zwischen Steinen. Männchen können trotz des sanften Aussehens Reviere verteidigen.",
    ],
    [
      "Never assume every specimen accepts dry pellets. Confirm reliable feeding before purchase; an attractive new empty tank may offer too little food.",
      "Nimm nicht an, dass jedes Tier Trockenfutter frisst. Prüfe sichere Futteraufnahme; ein hübsches neues leeres Becken kann zu wenig Nahrung bieten.",
    ],
  ]),
  gramma: discovery([
    [
      "Royal grammas inhabit tropical western Atlantic reefs. Caves, ledges and overhangs provide the sheltered spots they favour.",
      "Königsfeenbarsche bewohnen tropische westatlantische Riffe. Höhlen, Vorsprünge und Überhänge bieten ihre bevorzugten Schutzplätze.",
    ],
    [
      "Around 8 cm at the upper end. A small body can still defend a sizeable personal resting place.",
      "Am oberen Ende ungefähr 8 cm. Auch ein kleiner Körper kann einen ansehnlichen persönlichen Ruheplatz verteidigen.",
    ],
    [
      "The body changes sharply from purple to yellow. Similar-looking dottybacks are different fish, so colours alone do not identify behaviour.",
      "Der Körper wechselt deutlich von Violett zu Gelb. Ähnliche Zwergbarsche sind andere Fische; Farben allein verraten kein Verhalten.",
    ],
    [
      "A male gathers material into a cave nest. After eggs are laid, he stays nearby and guards the clutch.",
      "Ein Männchen sammelt Material in einem Höhlennest. Nach der Eiablage bleibt es dort und bewacht das Gelege.",
    ],
    [
      "Small drifting animal foods suit its mouth. In an aquarium, offer appropriately sized marine foods near its sheltered feeding area.",
      "Kleine treibende Tiernahrung passt ins Maul. Im Aquarium gehören passende Meeresfuttergrößen nahe an seinen geschützten Fressbereich.",
    ],
    [
      "It may swim tilted or upside down under a ledge. Its belly facing the shelter can be perfectly normal.",
      "Unter einem Vorsprung kann es schräg oder kopfüber schwimmen. Den Bauch zur Deckung zu richten kann völlig normal sein.",
    ],
    [
      "Keep hiding places stable and cover escape gaps. Do not combine lookalike territorial species simply because their colours match.",
      "Sichere Verstecke und verschließe Fluchtspalten. Setze ähnliche revierbildende Arten nicht bloß wegen passender Farben zusammen.",
    ],
  ]),
  firefish: discovery([
    [
      "Firefish hover above Indo-Pacific reef slopes. A nearby crevice or burrow gives them somewhere to dart when threatened.",
      "Feuergrundeln schweben über indopazifischen Riffhängen. Eine nahe Spalte oder Höhle bietet einen Rückzugsort bei Gefahr.",
    ],
    [
      "About 8–9 cm at full size. Leave open hovering space alongside secure rocky shelter.",
      "Ausgewachsen ungefähr 8–9 cm. Lass neben sicherer Felsdeckung freien Raum zum Schweben.",
    ],
    [
      "The long first dorsal fin stands like a flag. The pale front and fiery rear give this dartfish its common name.",
      "Die lange erste Rückenflosse steht wie eine Fahne. Die helle Vorderseite und das feurige Hinterteil geben ihr den Namen.",
    ],
    [
      "This species lays eggs rather than live young. Breeding and raising tiny marine larvae is a specialist task.",
      "Diese Art legt Eier statt lebender Jungtiere. Fortpflanzung und Aufzucht winziger Meereslarven sind eine Aufgabe für Fachleute.",
    ],
    [
      "It catches small drifting plankton while hovering. Food should pass where it feeds, not only settle behind rocks.",
      "Beim Schweben fängt sie kleines treibendes Plankton. Futter sollte dort vorbeiziehen, statt nur hinter Steinen zu landen.",
    ],
    [
      "A sudden movement can send it straight into its refuge. Quiet neighbours help a shy fish spend more time in view.",
      "Eine plötzliche Bewegung lässt sie sofort ins Versteck flitzen. Ruhige Nachbarn helfen, dass ein scheues Tier öfter sichtbar bleibt.",
    ],
    [
      "A tight lid matters because startled firefish jump. A random pair is not automatically compatible; avoid crowding similar individuals.",
      "Ein dichter Deckel ist wichtig, denn erschreckte Feuergrundeln springen. Zwei zufällige Tiere sind nicht automatisch ein verträgliches Paar.",
    ],
  ]),
  puffer: discovery([
    [
      "Our puffer represents marine species. Other puffers live in freshwater or brackish water; those homes cannot be swapped freely.",
      "Unser Kugelfisch steht für Meeresarten. Andere leben im Süß- oder Brackwasser; diese Lebensräume sind nicht beliebig austauschbar.",
    ],
    [
      "Adult sizes vary enormously between species. Ask for an exact scientific identity before choosing a tank or companions.",
      "Endgrößen unterscheiden sich enorm zwischen den Arten. Frage vor der Becken- und Nachbarwahl nach der genauen wissenschaftlichen Art.",
    ],
    [
      "Fused teeth form a beak for biting food. Inflation is a defensive response, not a trick to trigger for entertainment.",
      "Verwachsene Zähne bilden einen Schnabel zum Zubeißen. Aufblasen ist eine Abwehrreaktion, kein Kunststück zur Unterhaltung.",
    ],
    [
      "Puffers lay eggs, but spawning and parental behaviour differ by species. A single simple breeding rule would be misleading.",
      "Kugelfische legen Eier, doch Laich- und Elternverhalten unterscheiden sich je nach Art. Eine einzige einfache Zuchtregel wäre irreführend.",
    ],
    [
      "Many marine puffers crush or bite invertebrates. Their diet and tooth-wear needs require a species-specific feeding plan.",
      "Viele Meereskugelfische zerbeißen Wirbellose. Ernährung und Zahnabnutzung brauchen einen auf die Art abgestimmten Futterplan.",
    ],
    [
      "Small fins allow careful hovering and turning. Curious investigation can include biting, so tankmates need thoughtful selection.",
      "Kleine Flossen ermöglichen genaues Schweben und Wenden. Neugieriges Prüfen kann Beißen einschließen; Nachbarn müssen gut gewählt sein.",
    ],
    [
      "Never frighten one into puffing up or lift it for a demonstration. Do not treat freshwater and marine puffer care as identical.",
      "Erschrecke keines absichtlich zum Aufblasen und hebe es nicht zur Vorführung heraus. Süß- und Meeresarten brauchen unterschiedliche Pflege.",
    ],
  ]),
  ray: discovery([
    [
      "Our spotted ray is a miniature fantasy inspired by marine rays. Real spotted eagle rays use warm coastal waters and reefs.",
      "Unser Fleckenrochen ist eine kleine Fantasiefigur nach Meeresvorbildern. Echte Gefleckte Adlerrochen nutzen warme Küstengewässer und Riffe.",
    ],
    [
      "Real marine rays can span more than a metre across the fins. The little game version is not their real adult size.",
      "Echte Meeresrochen können über einen Meter Flossenspannweite erreichen. Die kleine Spielfigur zeigt nicht ihre wirkliche Endgröße.",
    ],
    [
      "Wing-like pectoral fins make the body disc. Gills sit underneath; openings behind the eyes help draw in water.",
      "Flügelartige Brustflossen bilden die Körperscheibe. Kiemen liegen unten; Öffnungen hinter den Augen helfen beim Ansaugen von Wasser.",
    ],
    [
      "Spotted eagle rays give birth to live young. Other ray relatives may lay egg cases, so identify the group first.",
      "Gefleckte Adlerrochen bringen lebende Junge zur Welt. Andere Rochenverwandte legen Eikapseln; bestimme daher zuerst die Gruppe.",
    ],
    [
      "Crushing tooth plates help eagle rays eat shelled prey. Their real menu includes bottom animals rather than fish flakes alone.",
      "Breite Zahnplatten helfen Adlerrochen beim Knacken harter Beute. Auf ihrem echten Speiseplan stehen Bodentiere statt bloßer Fischflocken.",
    ],
    [
      "Their broad fins beat through the water like wings. Feeding searches may involve probing the sandy bottom.",
      "Ihre breiten Flossen schlagen wie Flügel durchs Wasser. Bei der Futtersuche können sie den Sandboden durchstöbern.",
    ],
    [
      "A real marine ray belongs in expert, very large facilities. Never choose one for a normal home tank because the game makes it small.",
      "Ein echter Meeresrochen braucht fachkundige, sehr große Anlagen. Wähle keinen fürs Heimaquarium, nur weil er im Spiel klein bleibt.",
    ],
  ]),
  jelly: discovery([
    [
      "Moon jellies occur in coastal seas around the world, but Aurelia contains several species. Exact origin affects temperature needs.",
      "Ohrenquallen kommen in Küstenmeeren weltweit vor, doch Aurelia umfasst mehrere Arten. Die genaue Herkunft bestimmt den Temperaturbedarf mit.",
    ],
    [
      "Measure the bell across, not like a fish from nose to tail. Species and conditions produce very different adult bell sizes.",
      "Miss den Schirm quer, nicht wie einen Fisch vom Kopf zum Schwanz. Art und Bedingungen führen zu unterschiedlichen erwachsenen Schirmgrößen.",
    ],
    [
      "The transparent bell has no bones or brain like a fish’s. A nerve network coordinates movement; stinging cells help catch prey.",
      "Der durchsichtige Schirm hat weder Knochen noch ein Fischgehirn. Ein Nervennetz koordiniert Bewegung; Nesselzellen helfen beim Beutefang.",
    ],
    [
      "A larva settles into a small polyp. Polyps can release young swimming jellies, which grow into the familiar medusa stage.",
      "Eine Larve setzt sich als kleiner Polyp fest. Polypen können junge schwimmende Quallen abgeben, die zur bekannten Meduse heranwachsen.",
    ],
    [
      "Tiny drifting animals stick to food-catching surfaces and move toward the mouth. Ordinary large fish pellets do not meet these needs.",
      "Winzige treibende Tiere haften an Fangflächen und gelangen zum Mund. Gewöhnliches großes Fischgranulat deckt diesen Bedarf nicht.",
    ],
    [
      "Pulsing moves a jelly, but currents strongly affect where it travels. A jelly cannot steer around obstacles like a fish.",
      "Pulsieren bewegt eine Qualle, doch Strömungen bestimmen ihren Weg stark mit. Sie kann Hindernisse nicht wie ein Fisch umschwimmen.",
    ],
    [
      "Exposed pump intakes and sharp corners can injure soft bodies. Real jelly systems need specialised flow and careful food management.",
      "Offene Pumpenansaugungen und scharfe Ecken können weiche Körper verletzen. Echte Quallenanlagen brauchen besondere Strömung und sorgfältige Fütterung.",
    ],
  ]),

  pearl_gourami: discovery([
    [
      "Pearl gouramis come from Southeast Asian fresh waters with vegetation and sheltered margins. Their spotted pattern blends into broken light among plants.",
      "Mosaikfadenfische stammen aus südostasiatischen Süßgewässern mit Pflanzen und geschützten Ufern. Ihr Punktmuster passt zum gefleckten Licht zwischen Pflanzen.",
    ],
    [
      "Adults reach roughly 12 cm. A tiny youngster in a shop still needs a home planned for its full-grown body and companions.",
      "Erwachsene erreichen ungefähr 12 cm. Ein winziges Jungtier im Laden braucht trotzdem ein Zuhause für seine spätere Körpergröße und passende Mitbewohner.",
    ],
    [
      "Threadlike pelvic fins help explore nearby objects. A labyrinth organ lets the fish also take oxygen from air at the surface.",
      "Fadenförmige Bauchflossen helfen beim Erkunden naher Gegenstände. Mit einem Labyrinthorgan kann der Fisch zusätzlich Luftsauerstoff an der Oberfläche aufnehmen.",
    ],
    [
      "The male builds a floating bubble nest and tends the eggs. Tiny young need suitable microscopic food; a bubble nest alone does not guarantee babies.",
      "Das Männchen baut ein schwimmendes Schaumnest und betreut die Eier. Winzige Junge brauchen passendes Kleinstfutter; ein Schaumnest allein garantiert keinen Nachwuchs.",
    ],
    [
      "Small aquatic animals and plant material both contribute to the diet. A varied menu matters more than repeating one favourite treat.",
      "Kleine Wassertiere und pflanzliche Nahrung gehören zum Speiseplan. Abwechslung ist wichtiger, als immer denselben Lieblingshappen zu geben.",
    ],
    [
      "These usually gentle fish appreciate planted retreats. Males may defend nesting space, so calm behaviour today does not remove the need for escape routes.",
      "Diese meist sanften Fische mögen bepflanzte Rückzugsorte. Männchen können einen Nestbereich verteidigen; auch bei friedlichen Tieren bleiben Ausweichplätze wichtig.",
    ],
    [
      "Do not block access to the surface or choose fin-nipping neighbours. Strong, relentless current can make resting and nest building difficult.",
      "Versperre nicht den Weg zur Oberfläche und wähle keine flossenknabbernden Nachbarn. Ständige starke Strömung erschwert Ruhen und Nestbau.",
    ],
  ]),
  rainbowfish: discovery([
    [
      "Boesemani rainbowfish come from the Ayamaru lake region of New Guinea. Their wild home is far more specific than simply 'any tropical river'.",
      "Boesemans Regenbogenfische stammen aus der Ayamaru-Seenregion Neuguineas. Ihre natürliche Heimat ist viel genauer begrenzt als einfach irgendein Tropenfluss.",
    ],
    [
      "Adults are usually around 8–10 cm in aquariums. Young fish are less colourful, so their famous two-tone appearance develops as they grow.",
      "Erwachsene sind im Aquarium meist etwa 8–10 cm lang. Jungfische sind blasser; die berühmte zweifarbige Zeichnung entwickelt sich beim Wachsen.",
    ],
    [
      "Look for a deep, flattened body and two separate dorsal fins. Mature males show the strongest blue front and warm orange rear.",
      "Achte auf den hohen, seitlich abgeflachten Körper und zwei getrennte Rückenflossen. Erwachsene Männchen zeigen die kräftigste blaue Vorder- und orange Hinterhälfte.",
    ],
    [
      "Pairs release small batches of eggs among fine plants. The eggs develop outside the parents; tiny hatchlings need much smaller food than adults.",
      "Paare geben kleine Portionen Eier zwischen feinen Pflanzen ab. Die Eier entwickeln sich außerhalb der Eltern; frisch geschlüpfte Junge brauchen viel kleineres Futter.",
    ],
    [
      "Small invertebrates and other available food make a varied menu. In aquariums, suitable small prepared foods can be combined with other appropriate foods.",
      "Kleine Wirbellose und weitere verfügbare Nahrung ergeben einen abwechslungsreichen Speiseplan. Im Aquarium lassen sich passende kleine Fertigfutter mit geeignetem Zusatzfutter verbinden.",
    ],
    [
      "A group swims actively through open water. During courtship males display and shimmer; space lets other fish move away from an insistent admirer.",
      "Eine Gruppe schwimmt lebhaft im freien Wasser. Bei der Balz präsentieren sich die Männchen schillernd; Platz ermöglicht anderen Fischen, auf Abstand zu gehen.",
    ],
    [
      "A colourful photograph does not show swimming-space needs. Avoid cramped tanks and keeping just one; plan an adult-sized group and open swimming lanes.",
      "Ein buntes Foto zeigt den Platzbedarf beim Schwimmen nicht. Vermeide enge Becken und Einzelhaltung; plane eine erwachsene Gruppe und freie Schwimmbahnen.",
    ],
  ]),
  ghostknife: discovery([
    [
      "Black ghost knifefish inhabit South American fresh waters. Shelter and dim periods are important parts of their world, not signs that a fish is boring.",
      "Weißstirn-Messerfische bewohnen südamerikanische Süßgewässer. Verstecke und dunklere Zeiten gehören zu ihrer Welt und bedeuten nicht, dass ein Fisch langweilig ist.",
    ],
    [
      "An adult can become roughly 35–45 cm long. Its long flexible body needs a very large aquarium even when a youngster fits in your palm.",
      "Ein erwachsenes Tier kann ungefähr 35–45 cm lang werden. Sein langer beweglicher Körper braucht ein sehr großes Aquarium, auch wenn ein Jungtier auf die Hand passt.",
    ],
    [
      "A long underside fin ripples like a ribbon. Weak electrical signals help it sense nearby objects; this is not a dangerous electric-eel shock.",
      "Eine lange Flosse an der Unterseite wellt sich wie ein Band. Schwache elektrische Signale helfen beim Ertasten der Umgebung; das ist kein gefährlicher Zitteraal-Schlag.",
    ],
    [
      "This is an egg-laying fish, but successful breeding is a specialist task. The game's quick babies should not be taken as a real breeding guide.",
      "Dieser Fisch legt Eier, doch erfolgreiche Nachzucht ist eine Aufgabe für Fachkundige. Die schnellen Spielbabys sind keine Anleitung zur echten Zucht.",
    ],
    [
      "It searches for animal prey, including small aquatic invertebrates. Very small fish and shrimp can become food rather than safe tank companions.",
      "Er sucht tierische Beute, darunter kleine wirbellose Wassertiere. Sehr kleine Fische und Garnelen können zu Futter statt zu sicheren Mitbewohnern werden.",
    ],
    [
      "Often most active in dim light, it can glide forwards or backwards. Offer secure shelters and watch whether it actually reaches food.",
      "Oft ist er bei schwachem Licht am aktivsten und gleitet vorwärts wie rückwärts. Sichere Verstecke sind wichtig; beobachte, ob er wirklich ans Futter kommt.",
    ],
    [
      "Do not buy this fish for a small community tank or pair it with bite-sized pets. Never remove hiding places just to see it more often.",
      "Kaufe ihn nicht für ein kleines Gesellschaftsbecken oder zusammen mit mundgerechten Tieren. Entferne Verstecke niemals nur, um ihn öfter zu sehen.",
    ],
  ]),
  regal_angelfish: discovery([
    [
      "Regal angelfish inhabit Indo-Pacific coral reefs, including the Red Sea. Crevices and sheltered reef structure provide places to retreat and search for food.",
      "Pfauenkaiserfische bewohnen Korallenriffe des Indopazifiks einschließlich des Roten Meeres. Spalten und geschützte Riffstrukturen bieten Rückzug und Nahrung.",
    ],
    [
      "Adults can reach about 25 cm. Their tall body and need for established reef structure make them very different from a tiny beginner pet.",
      "Erwachsene können etwa 25 cm erreichen. Ihr hoher Körper und ihr Bedarf an gewachsenen Riffstrukturen unterscheiden sie deutlich von einem kleinen Anfängertier.",
    ],
    [
      "Alternating pale and warm-coloured bands cross the body. Fish from different regions can show different chest colours, even within the same species.",
      "Helle und warmfarbige Bänder ziehen über den Körper. Tiere verschiedener Herkunft können unterschiedliche Brustfarben zeigen, obwohl sie zur selben Art gehören.",
    ],
    [
      "Like other marine angelfishes, they begin life as eggs and very small larvae. Raising marine larvae requires different food and conditions from adult care.",
      "Wie andere Meereskaiserfische beginnen sie als Eier und sehr kleine Larven. Die Aufzucht von Meereslarven braucht anderes Futter und andere Bedingungen als erwachsene Tiere.",
    ],
    [
      "Sponges and tunicates are important natural foods. A fish that investigates offered food is not necessarily eating enough to stay healthy.",
      "Schwämme und Manteltiere sind wichtige natürliche Nahrung. Ein Fisch, der angebotenes Futter untersucht, frisst deshalb noch nicht unbedingt genug.",
    ],
    [
      "A shy newcomer may retreat when boisterous fish rush past. Quiet surroundings and suitable feeding opportunities matter more than forcing it into view.",
      "Ein scheuer Neuankömmling kann sich vor stürmischen Fischen zurückziehen. Ruhe und passende Futtergelegenheiten sind wichtiger, als ihn ins Blickfeld zu drängen.",
    ],
    [
      "This is a demanding specialist, not a first marine fish. Do not assume it will accept ordinary flakes or leave every living coral alone.",
      "Dies ist ein anspruchsvoller Spezialist, kein erster Meerwasserfisch. Er nimmt nicht automatisch gewöhnliche Flocken an und lässt nicht unbedingt jede Koralle in Ruhe.",
    ],
  ]),
  achilles_tang: discovery([
    [
      "Achilles tangs live around Pacific islands and reefs, including Hawaii. Wave-washed shallows supply moving, oxygen-rich water and surfaces for grazing.",
      "Achilles-Doktorfische leben an pazifischen Inseln und Riffen, auch bei Hawaii. Wellenbewegtes Flachwasser liefert sauerstoffreiches Wasser und Flächen zum Abweiden.",
    ],
    [
      "An adult can approach 25 cm. Body length alone understates the space needed by a powerful, continuously active reef swimmer.",
      "Ein erwachsenes Tier kann etwa 25 cm erreichen. Die Körperlänge allein zeigt nicht, wie viel Platz ein kräftiger, ständig aktiver Riffschwimmer benötigt.",
    ],
    [
      "The orange patch draws attention to the tail base. Surgeonfishes have sharp defensive spines there, so the pretty marking is near a real defence.",
      "Der orange Fleck fällt an der Schwanzwurzel auf. Doktorfische tragen dort scharfe Abwehrdornen: Die hübsche Zeichnung liegt bei einer echten Verteidigung.",
    ],
    [
      "Eggs and larvae develop in open water before young fish settle into reef life. That drifting childhood differs greatly from the grazing adult stage.",
      "Eier und Larven entwickeln sich im freien Wasser, bevor Jungfische zum Riffleben wechseln. Diese treibende Kindheit unterscheidet sich stark vom grasenden Erwachsenenleben.",
    ],
    [
      "Much feeding involves grazing algae from reef surfaces. A real aquarium needs a suitable plant-rich feeding plan rather than only rich animal treats.",
      "Bei der Nahrungssuche weiden sie häufig Algen von Riffflächen ab. Im echten Aquarium brauchen sie geeignete pflanzenreiche Kost statt nur tierischer Leckerbissen.",
    ],
    [
      "They swim strongly and can defend feeding space against other tangs. A large area does not automatically make every combination of neighbours peaceful.",
      "Sie schwimmen kräftig und können Futterplätze gegen andere Doktorfische verteidigen. Viel Platz macht nicht jede Kombination von Nachbarn automatisch friedlich.",
    ],
    [
      "Weak circulation, cramped space and unsuitable companions are serious problems. Keep this expert-care species out of a beginner shopping list.",
      "Schwache Wasserbewegung, Enge und ungeeignete Mitbewohner sind ernste Probleme. Diese Art für Fachkundige gehört nicht auf eine Anfänger-Einkaufsliste.",
    ],
  ]),
  zebra_shark: discovery([
    [
      "Zebra sharks inhabit warm Indo-Pacific coastal waters and reefs. Sandy resting areas and nearby feeding grounds form part of their bottom-living world.",
      "Zebrahaie bewohnen warme Küstengewässer und Riffe des Indopazifiks. Sandige Ruheflächen und benachbarte Futtergebiete gehören zu ihrer bodennahen Welt.",
    ],
    [
      "Adults grow well over two metres. The extra-long tail is a large part of that length, but the whole animal still needs immense space.",
      "Erwachsene werden deutlich über zwei Meter lang. Der besonders lange Schwanz macht einen großen Teil aus; trotzdem braucht das ganze Tier gewaltig viel Platz.",
    ],
    [
      "Young zebra sharks wear stripes; adults develop spots. Small feelers near the mouth help investigate food, and the long tail helps drive swimming.",
      "Junge Zebrahaie tragen Streifen, Erwachsene entwickeln Flecken. Kleine Barteln am Maul helfen bei der Nahrungssuche; der lange Schwanz treibt das Schwimmen an.",
    ],
    [
      "Females lay tough egg cases. Young sharks develop inside before hatching; breeding and raising this species takes professional facilities and expertise.",
      "Weibchen legen feste Eikapseln. Junge Haie entwickeln sich darin bis zum Schlupf; Zucht und Aufzucht brauchen professionelle Anlagen und Fachwissen.",
    ],
    [
      "Their diet includes bottom-dwelling shellfish and other small animals. A shark is not automatically a hunter of large, fast-swimming fish.",
      "Sie fressen unter anderem bodenlebende Krebs- und Weichtiere sowie andere kleine Tiere. Nicht jeder Hai jagt automatisch große, schnell schwimmende Fische.",
    ],
    [
      "Often resting by day, they search for food more actively at night. Resting on the bottom is normal for this species, not an invitation to disturb it.",
      "Häufig ruhen sie tagsüber und suchen nachts aktiver nach Futter. Ruhe am Boden ist für diese Art normal und kein Anlass, sie zu stören.",
    ],
    [
      "A zebra shark is not a home-aquarium pet. Enjoy the small game character, then discover real sharks through responsible public-aquarium learning.",
      "Ein Zebrahai ist kein Tier fürs Heimaquarium. Genieße die kleine Spielfigur und entdecke echte Haie in den Lernangeboten verantwortungsvoller öffentlicher Aquarien.",
    ],
  ]),
};
