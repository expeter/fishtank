import { ChevronRight } from "lucide-react";
import type { Lang } from "./game";
/** Pip is an original little otter guide, drawn as vectors so he stays crisp on phones. */
export function PipFace({ sleepy = false }: { sleepy?: boolean }) {
  return (
    <svg className="pip-face" viewBox="0 0 90 90" aria-hidden="true">
      <path
        d="M19 47Q8 35 18 23Q30 17 34 32M56 31Q64 15 76 24Q84 36 72 46"
        fill="#885632"
        stroke="#482d23"
        strokeWidth="3"
      />
      <path
        d="M14 52C9 23 77 18 79 52Q81 85 46 85Q12 86 14 52"
        fill="#ac7245"
        stroke="#482d23"
        strokeWidth="3"
      />
      <path
        d="M23 61Q24 45 44 51Q65 43 71 61Q69 80 46 80Q25 79 23 61"
        fill="#ffe1a3"
      />
      <ellipse cx="30" cy="51" rx="4" ry={sleepy ? 1 : 6} fill="#263c3f" />
      <ellipse cx="61" cy="51" rx="4" ry={sleepy ? 1 : 6} fill="#263c3f" />
      {!sleepy && (
        <>
          <circle cx="31" cy="48" r="1.5" fill="white" />
          <circle cx="62" cy="48" r="1.5" fill="white" />
        </>
      )}
      <path d="M40 59Q46 54 53 59Q49 66 46 66Q41 64 40 59" fill="#442a24" />
      <path
        d="M46 65v4m0 0q-5 5-9 0m9 0q5 5 9 0"
        fill="none"
        stroke="#6c432d"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="24" cy="62" rx="6" ry="3" fill="#e98f72" />
      <ellipse cx="69" cy="62" rx="6" ry="3" fill="#e98f72" />
      <path
        d="M54 25q1-15 16-17q1 13-16 17"
        fill="#8fb947"
        stroke="#376742"
        strokeWidth="2"
      />
      <path
        d="M31 30q9-4 19-4"
        fill="none"
        stroke="#ce935a"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
export const storyChapters = [
  {
    en: "A name makes a friend",
    de: "Ein Name macht Freunde",
    line: "I’m Pip! This cove is our secret. What shall we call your first little friend?",
    deLine:
      "Ich bin Pip! Diese Bucht ist unser Geheimnis. Wie soll dein erster kleiner Freund heißen?",
    action: "Name a fish",
    deAction: "Fisch benennen",
  },
  {
    en: "A little picnic",
    de: "Ein kleines Picknick",
    line: "Lovely name! Sprinkle a snack. Some friends are shy — let them come in their own time.",
    deLine:
      "Ein schöner Name! Streue etwas Futter. Manche Freunde sind schüchtern und brauchen Zeit.",
    action: "Let’s feed",
    deAction: "Füttern",
  },
  {
    en: "Make a secret garden",
    de: "Ein geheimer Garten",
    line: "A cosy hiding place would make this feel like home. Shall we plant something?",
    deLine: "Ein gemütliches Versteck wäre schön. Wollen wir etwas pflanzen?",
    action: "Plant something",
    deAction: "Etwas pflanzen",
  },
  {
    en: "Our little haven",
    de: "Unser kleines Paradies",
    line: "You did it! A name, a picnic, a garden. Now the cove has a story — yours. Watch what tomorrow brings.",
    deLine:
      "Geschafft! Ein Name, ein Picknick, ein Garten. Jetzt hat die Bucht eine Geschichte – deine. Mal sehen, was morgen passiert.",
    action: "Keep exploring",
    deAction: "Weiter entdecken",
  },
];
export default function Pip({
  lang,
  chapter,
  open,
  onOpen,
  onClose,
  onAction,
}: {
  lang: Lang;
  chapter: number;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onAction: () => void;
}) {
  const entry = storyChapters[Math.min(chapter, 3)];
  return (
    <aside
      className={"pip-companion " + (open ? "speaking" : "")}
      aria-label={
        lang === "de" ? "Pip, dein Otterfreund" : "Pip, your otter friend"
      }
    >
      <button
        className="pip-button"
        aria-label={lang === "de" ? "Mit Pip sprechen" : "Talk to Pip"}
        onClick={onOpen}
      >
        <PipFace />
      </button>
      {open && (
        <div className="pip-speech">
          <button
            className="pip-dismiss"
            aria-label={lang === "de" ? "Pip ausblenden" : "Hide Pip"}
            onClick={onClose}
          >
            ×
          </button>
          <strong>{lang === "de" ? entry.de : entry.en}</strong>
          <p>{lang === "de" ? entry.deLine : entry.line}</p>
          <button className="pip-action" onClick={onAction}>
            {lang === "de" ? entry.deAction : entry.action}{" "}
            <ChevronRight size={12} aria-hidden="true" />
          </button>
        </div>
      )}
    </aside>
  );
}
