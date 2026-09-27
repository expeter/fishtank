import type { ReactNode } from "react";
import {
  BookOpen,
  Camera,
  Coins,
  Eraser,
  Fish,
  Hand,
  Leaf,
  Maximize,
  Menu,
  Move,
  RotateCcw,
  RotateCw,
  Settings,
  Shell,
  ShoppingBag,
  Shovel,
  Sparkles,
  Volume2,
  Waves,
  Wind,
  X,
} from "lucide-react";
import FoodIcon from "./FoodIcon";
import type { Lang } from "./game";
import "./help-guide.css";

type BadgeKind =
  "draw" | "replay" | "circle" | "bubbles" | "invite" | "selected";
/** These paths mirror the little canvas signs above a fish, rather than a second icon vocabulary. */
function FishSign({ kind }: { kind: BadgeKind }) {
  if (kind === "selected")
    return (
      <svg viewBox="0 0 42 36" aria-hidden="true">
        <ellipse
          cx="21"
          cy="20"
          rx="18"
          ry="12"
          fill="none"
          stroke="#e9b72e"
          strokeWidth="3"
        />
        <path d="M11 20 5 14v12z" fill="#dc8741" />
        <ellipse cx="23" cy="20" rx="11" ry="7" fill="#f7b54e" />
        <circle cx="28" cy="18" r="2" fill="#193e48" />
        <circle cx="28.6" cy="17.4" r=".6" fill="white" />
      </svg>
    );
  return (
    <svg viewBox="-16 -16 32 32" aria-hidden="true">
      <circle
        r="12"
        fill={kind === "invite" ? "#fff9db" : "#ffe578"}
        stroke="#173c46"
        strokeWidth="2"
      />
      {kind === "circle" ? (
        <circle r="6" fill="none" stroke="#173c46" strokeWidth="2" />
      ) : kind === "bubbles" ? (
        <g fill="none" stroke="#173c46" strokeWidth="2">
          <circle cx="-3" cy="3" r="3" />
          <circle cx="3" cy="-3" r="4" />
        </g>
      ) : kind === "draw" ? (
        <path
          d="m-5 5 9-10 3 3-10 9Z"
          fill="none"
          stroke="#173c46"
          strokeWidth="2"
        />
      ) : kind === "invite" ? (
        <text
          x="0"
          y="6"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontWeight="bold"
          fontSize="17"
          fill="#173c46"
        >
          ?
        </text>
      ) : (
        <path d="m-4-6 10 6-10 6Z" fill="#173c46" />
      )}
    </svg>
  );
}
interface HelpItem {
  icon: ReactNode;
  title: string;
  text: string;
}
export default function HelpGuide({ lang }: { lang: Lang }) {
  const t = (en: string, de: string) => (lang === "de" ? de : en);
  const sections: { title: string; icon: ReactNode; items: HelpItem[] }[] = [
    {
      title: t("Signs above a fish", "Zeichen über einem Fisch"),
      icon: <Fish />,
      items: [
        {
          icon: <FishSign kind="invite" />,
          title: t("Want to play?", "Lust zu spielen?"),
          text: t(
            "A question mark is a little invitation. Tap this fish to choose a game.",
            "Das Fragezeichen ist eine Einladung. Tippe diesen Fisch an und wähle ein Spiel.",
          ),
        },
        {
          icon: <FishSign kind="selected" />,
          title: t("Your playmate", "Dein Spielfreund"),
          text: t(
            "The golden ring marks your chosen fish. Only this friend follows your game.",
            "Der goldene Ring zeigt deinen gewählten Fisch. Nur dieser Freund macht beim Spiel mit.",
          ),
        },
        {
          icon: <FishSign kind="draw" />,
          title: t("Pencil: draw a trail", "Stift: Spur zeichnen"),
          text: t(
            "Hold your finger on the water and draw a slow path. Your friend can learn it!",
            "Halte den Finger aufs Wasser und zeichne langsam eine Spur. Dein Freund kann sie lernen!",
          ),
        },
        {
          icon: <FishSign kind="replay" />,
          title: t("Following a path", "Einer Spur folgen"),
          text: t(
            "The triangle means your fish is following a path or gathering. Replay repeats a learned trail.",
            "Das Dreieck zeigt: Dein Fisch folgt einer Spur oder kommt herbei. Wiederholen spielt eine gelernte Spur ab.",
          ),
        },
        {
          icon: <FishSign kind="circle" />,
          title: t("Circle dance", "Kreistanz"),
          text: t(
            "Your friend keeps swimming a little circle until you choose another game or Finish playing.",
            "Dein Freund schwimmt weiter im Kreis, bis du ein anderes Spiel oder Spielen beenden wählst.",
          ),
        },
        {
          icon: <FishSign kind="bubbles" />,
          title: t("Bubble game", "Blasenspiel"),
          text: t(
            "Tap the water to place a bubble. Your fish swims to it, then follows it upward. Tap elsewhere to move it.",
            "Tippe ins Wasser für eine Blase. Dein Fisch schwimmt hin und folgt ihr nach oben. Ein neuer Tipp versetzt sie.",
          ),
        },
      ],
    },
    {
      title: t("The little tool dock", "Deine Werkzeugleiste"),
      icon: <Hand />,
      items: [
        {
          icon: <FoodIcon kind="flakes" />,
          title: t("Feed", "Füttern"),
          text: t(
            "Choose food, then tap the water: each portion costs 1 coin (worms/insects: 2). Creative feeding is free. Full friends stop eating; crumbs sink. Recently fed adults can have babies.",
            "Wähle Futter und tippe ins Wasser: jede Portion kostet 1 Münze (Würmchen/Insekten: 2). Kreativ ist kostenlos. Satte Freunde hören auf; Reste sinken. Kürzlich gefütterte Erwachsene können Babys bekommen.",
          ),
        },
        {
          icon: <Hand />,
          title: t("Play", "Spielen"),
          text: t(
            "Tap a fish and choose an activity. The card closes so you can play. Tap Play to reopen the game choices.",
            "Tippe einen Fisch an und wähle ein Spiel. Die Karte schließt sich zum Spielen. Tippe auf Spielen, um die Auswahl wieder zu öffnen.",
          ),
        },
        {
          icon: <Leaf />,
          title: t("Decorate", "Gestalten"),
          text: t(
            "Choose a background or place a decoration. Drag it through the water to find its home.",
            "Wähle eine Kulisse oder stelle Deko auf. Ziehe sie durchs Wasser an ihren Lieblingsplatz.",
          ),
        },
        {
          icon: <Move />,
          title: t("Explore", "Erkunden"),
          text: t(
            "Drag to look around a Medium or Large world. Small worlds fit on your screen.",
            "Ziehe zum Erkunden einer mittleren oder großen Welt. Kleine Welten passen auf deinen Bildschirm.",
          ),
        },
        {
          icon: <ShoppingBag />,
          title: t("Little shop", "Kleiner Laden"),
          text: t(
            "Find new animals and lovely things here. A small baby grows into a big friend.",
            "Hier findest du neue Tiere und schöne Dinge. Ein kleines Baby wächst zu einem großen Freund heran.",
          ),
        },
      ],
    },
    {
      title: t("Make it your own", "Gestalte deine Welt"),
      icon: <Shovel />,
      items: [
        {
          icon: <Shovel />,
          title: t("Add sand", "Sand aufschütten"),
          text: t(
            "Choose the shovel in Decorate. Move your finger near the floor to build small hills.",
            "Wähle die Schaufel unter Gestalten. Bewege deinen Finger beim Boden und forme kleine Hügel.",
          ),
        },
        {
          icon: <Eraser />,
          title: t("Remove sand", "Sand abtragen"),
          text: t(
            "Use the eraser to scoop away a little sand where your finger moves.",
            "Mit dem Radierer trägst du dort etwas Sand ab, wo dein Finger entlangwandert.",
          ),
        },
        {
          icon: <RotateCw />,
          title: t("Turn and resize", "Drehen und vergrößern"),
          text: t(
            "Tap a placed decoration. Its controls let you change its size, turn it, flip it or put it away.",
            "Tippe auf aufgestellte Deko. Mit den Reglern kannst du sie vergrößern, drehen, spiegeln oder wegräumen.",
          ),
        },
        {
          icon: <RotateCcw />,
          title: t("Undo", "Rückgängig"),
          text: t(
            "Changed your mind? The curved arrow undoes your last decorating or sand step.",
            "Anders überlegt? Der gebogene Pfeil nimmt deinen letzten Deko- oder Sandschritt zurück.",
          ),
        },
        {
          icon: <Wind />,
          title: t("Air pump", "Luftpumpe"),
          text: t(
            "Turn the aquarium’s bubble pump on or off in Decorate.",
            "Schalte die Blasenpumpe im Aquarium unter Gestalten an oder aus.",
          ),
        },
        {
          icon: <Sparkles />,
          title: t("Clean glass and shore", "Scheibe und Ufer putzen"),
          text: t(
            "Choose Clean window and wipe away the green patches that gradually appear on the aquarium glass. Snails help too! At the woodland coast, choose Clean shore and tap the bits floating near the shore. Cleaning is optional; your friends stay safe.",
            "Wähle Scheibe putzen und wische die grünen Flecken weg, die langsam auf der Aquariumscheibe erscheinen. Schnecken helfen mit! Wähle an der Waldküste Ufer säubern und tippe auf die Teile am Ufer. Putzen ist freiwillig; deinen Freunden geht es trotzdem gut.",
          ),
        },
      ],
    },
    {
      title: t("Friends, coins and discoveries", "Freunde, Münzen und Wissen"),
      icon: <BookOpen />,
      items: [
        {
          icon: <Fish />,
          title: t("Names and feelings", "Namen und Gefühle"),
          text: t(
            "Tap a fish to give it a name and see its age, appetite and mood. Your named friends stay safe.",
            "Tippe einen Fisch an: Gib ihm einen Namen und entdecke Alter, Appetit und Stimmung. Benannte Freunde bleiben sicher.",
          ),
        },
        {
          icon: <BookOpen />,
          title: t("Discover every species", "Entdecke jede Tierart"),
          text: t(
            "Discover this species opens its book page: food, lifespan, companions and real-world care. Find every animal in the Field guide.",
            "Diese Art entdecken öffnet ihre Buchseite: Futter, Lebensdauer, Gefährten und echte Pflege. Im Entdeckerbuch findest du alle Tiere.",
          ),
        },
        {
          icon: <Coins />,
          title: t("Coins and growing", "Münzen und Wachsen"),
          text: t(
            "Receive 5 pocket-money coins per minute of active play. Sell grown friends to unlock new species. Creative worlds have free food, animals and decorations.",
            "Du erhältst 5 Münzen Taschengeld pro aktiver Spielminute. Fischverkäufe schalten neue Arten frei. In Kreativwelten sind Futter, Tiere und Deko kostenlos.",
          ),
        },
        {
          icon: <Shell />,
          title: t("Your three world slots", "Deine drei Weltplätze"),
          text: t(
            "Slot 1 is small, slot 2 medium and slot 3 huge. Each world stays on this device. Choose Growing or Creative when you start.",
            "Platz 1 ist klein, Platz 2 mittel und Platz 3 riesig. Die Welten bleiben auf diesem Gerät. Wähle beim Start Wachsen oder Kreativ.",
          ),
        },
        {
          icon: <Fish />,
          title: t("Room for 24 friends", "Platz für 24 Freunde"),
          text: t(
            "Each habitat has 24 animal places. Snails and other helpers count too. Sell an animal to welcome a new one.",
            "Jede Wasserwelt hat 24 Tierplätze. Schnecken und andere Helfer zählen mit. Verkaufe ein Tier für einen neuen Freund.",
          ),
        },
        {
          icon: <Waves />,
          title: t("Aquarium and coast", "Aquarium und Waldküste"),
          text: t(
            "The habitat buttons switch between your room aquarium and woodland coast. Both belong to the same saved world.",
            "Die Weltknöpfe wechseln zwischen deinem Zimmeraquarium und der Waldküste. Beide gehören zu derselben gespeicherten Welt.",
          ),
        },
      ],
    },
    {
      title: t("Little useful buttons", "Kleine praktische Knöpfe"),
      icon: <Menu />,
      items: [
        {
          icon: <Camera />,
          title: t("A postcard", "Eine Postkarte"),
          text: t(
            "Take a picture, write a greeting, then save or share it. Your world’s name and the date appear on the card.",
            "Mach ein Foto, schreibe einen Gruß und speichere oder teile es. Weltname und Datum stehen auf der Karte.",
          ),
        },
        {
          icon: <Volume2 />,
          title: t("Sound", "Ton"),
          text: t(
            "Open the menu and tap the speaker for sound on or off. On a keyboard, press M.",
            "Öffne das Menü und tippe den Lautsprecher für Ton an oder aus. Mit Tastatur geht das auch mit M.",
          ),
        },
        {
          icon: <Maximize />,
          title: t("Fullscreen", "Vollbild"),
          text: t(
            "The four corners ask your browser for fullscreen. You can also install the game from the menu.",
            "Die vier Ecken bitten den Browser um Vollbild. Im Menü kannst du das Spiel auch installieren.",
          ),
        },
        {
          icon: <Settings />,
          title: t("Settings", "Einstellungen"),
          text: t(
            "Open Menu for language, music and optional food-chain play. Food-chain play starts off.",
            "Im Menü findest du Sprache, Musik und das optionale Nahrungsketten-Spiel. Am Anfang ist es ausgeschaltet.",
          ),
        },
        {
          icon: <X />,
          title: t("Back to your world", "Zurück in deine Welt"),
          text: t(
            "Close a card with ×. Your world keeps growing, and taking a break never harms your pets.",
            "Schließe eine Karte mit ×. Deine Welt wächst weiter, und Pausen schaden deinen Tieren nie.",
          ),
        },
      ],
    },
  ];
  return (
    <div className="help-guide">
      <h2>{t("A little help from Pip", "Ein bisschen Hilfe von Pip")}</h2>
      <p className="help-intro">
        {t(
          "See a new sign? Find its picture here. Tap a heading to explore.",
          "Ein neues Zeichen entdeckt? Hier findest du sein Bild. Tippe auf eine Überschrift zum Nachschauen.",
        )}
      </p>
      {sections.map((section, index) => (
        <details
          key={index}
          className="help-chapter"
          name="fishtank-help"
          open={index === 0}
        >
          <summary>
            <span aria-hidden="true">{section.icon}</span>
            {section.title}
          </summary>
          <ul>
            {section.items.map((item, i) => (
              <li key={i}>
                <span className="help-picture" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
