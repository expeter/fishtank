import type { Lang } from "./game";
export default function LanguageSwitch({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
}) {
  return (
    <div
      className="language-flags"
      role="group"
      aria-label={lang === "de" ? "Sprache" : "Language"}
    >
      <button
        aria-label="Deutsch"
        aria-pressed={lang === "de"}
        onClick={() => onChange("de")}
      >
        <svg viewBox="0 0 30 20" aria-hidden="true">
          <path fill="#191919" d="M0 0h30v7H0z" />
          <path fill="#ce2532" d="M0 7h30v6H0z" />
          <path fill="#ffd447" d="M0 13h30v7H0z" />
        </svg>
        <span>Deutsch</span>
      </button>
      <button
        aria-label="English"
        aria-pressed={lang === "en"}
        onClick={() => onChange("en")}
      >
        <svg viewBox="0 0 30 20" aria-hidden="true">
          <path fill="#174681" d="M0 0h30v20H0z" />
          <path stroke="#fff" strokeWidth="5" d="m0 0 30 20M30 0 0 20" />
          <path stroke="#cf2637" strokeWidth="2" d="m0 0 30 20M30 0 0 20" />
          <path stroke="#fff" strokeWidth="7" d="M15 0v20M0 10h30" />
          <path stroke="#cf2637" strokeWidth="4" d="M15 0v20M0 10h30" />
        </svg>
        <span>English</span>
      </button>
    </div>
  );
}
