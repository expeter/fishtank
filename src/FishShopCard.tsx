import { useMemo } from "react";
import { Check, Coins, Lock, Plus } from "lucide-react";
import Artwork from "./Artwork";
import {
  makeFish,
  prices,
  tiers,
  type Lang,
  type Mode,
  type animals,
} from "./game";
import { fishVariants } from "./fishVariants";

export default function FishShopCard({
  animal,
  lang,
  mode,
  unlocked,
  affordable,
  selected,
  onSelect,
  onBuy,
}: {
  animal: (typeof animals)[number];
  lang: Lang;
  mode: Mode;
  unlocked: boolean;
  affordable: boolean;
  selected?: string;
  onSelect: (id: string) => void;
  onBuy: () => void;
}) {
  const choices = fishVariants[animal.id];
  const chosen = choices.find((v) => v.id === selected) ?? choices[0];
  const preview = useMemo(
    () => ({ ...makeFish(animal.id, true), seed: 50, variant: chosen.id }),
    [animal.id, chosen.id],
  );
  return (
    <div className="animal-card" data-species={animal.id}>
      <button
        className="animal-buy"
        disabled={!unlocked || !affordable}
        onClick={onBuy}
      >
        <div className="catalog-art">
          <Artwork fish={preview} />
        </div>
        <strong>{animal[lang]}</strong>
        <small>
          {!unlocked ? (
            <>
              <Lock size={12} />
              {tiers[animal.tier]} {lang === "de" ? "verdient" : "earned"}
            </>
          ) : mode === "creative" ? (
            <>
              <Plus size={13} />
              {lang === "de" ? "Hinzufügen" : "Add friend"}
            </>
          ) : (
            <>
              <Coins size={13} />
              {prices[animal.tier]}
            </>
          )}
        </small>
      </button>
      <div
        className="fish-colours"
        role="group"
        aria-label={`${animal[lang]} · ${lang === "de" ? "Farbe" : "Colour"}`}
      >
        {choices.map((choice) => (
          <button
            key={choice.id}
            className="colour-choice"
            aria-label={choice[lang]}
            title={choice[lang]}
            aria-pressed={choice.id === chosen.id}
            onClick={() => onSelect(choice.id)}
          >
            <span
              style={{
                background: `linear-gradient(135deg, ${choice.color} 55%, ${choice.accent} 55%)`,
              }}
            />
            {choice.id === chosen.id && <Check size={16} />}
          </button>
        ))}
      </div>
      <span className="colour-name">{chosen[lang]}</span>
    </div>
  );
}
