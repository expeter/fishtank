import { extraFishVariants } from "./extraFish";
/** Curated wild colour palettes. See docs/colour-sources.md; not a free hue wheel.
 * Labels describe colours, not sex or a promise of genetic inheritance. */
export interface FishVariant {
  id: string;
  en: string;
  de: string;
  color: string;
  accent: string;
  pattern: "plain" | "freckles" | "bands" | "patches" | "shimmer";
  fin?: string;
}
const v = (
  id: string,
  en: string,
  de: string,
  color: string,
  accent = "#343c35",
  pattern: FishVariant["pattern"] = "plain",
  fin?: string,
): FishVariant => ({ id, en, de, color, accent, pattern, fin });
export const fishVariants: Readonly<Record<string, readonly FishVariant[]>> = {
  ...extraFishVariants,
  guppy: [
    v(
      "orange",
      "Orange spots",
      "Orange Flecken",
      "#bac1af",
      "#e88b2e",
      "patches",
    ),
    v(
      "blue",
      "Blue shimmer",
      "Blauer Schimmer",
      "#bac1af",
      "#448ca5",
      "patches",
    ),
    v(
      "yellow",
      "Yellow spots",
      "Gelbe Flecken",
      "#bac1af",
      "#d9b54f",
      "patches",
    ),
  ],
  goldfish: [
    v("olive", "Olive", "Oliv", "#969060"),
    v("gold", "Gold", "Gold", "#dc992f"),
  ],
  tetra: [v("neon", "Blue & red", "Blau & Rot", "#42b9ce")],
  angelfish: [
    v(
      "silver",
      "Silver stripes",
      "Silberstreifen",
      "#c4c9bc",
      "#343a35",
      "bands",
    ),
  ],
  snail: [v("brown", "Brown shell", "Braunes Haus", "#a98350")],
  frog: [v("olive", "Olive brown", "Olivbraun", "#88845b")],
  clownfish: [
    v("orange", "Orange & white", "Orange & Weiß", "#ed882b"),
    v("darwin", "Black & white", "Schwarz & Weiß", "#343b36"),
  ],
  tang: [v("blue", "Blue & yellow", "Blau & Gelb", "#2776c5")],
  butterfly: [v("yellow", "Yellow & white", "Gelb & Weiß", "#e5c35d")],
  seahorse: [
    v("yellow", "Pale yellow", "Hellgelb", "#e3cd84", "#665036", "freckles"),
    v("black", "Dark", "Dunkel", "#484536"),
  ],
  shrimp: [v("clear", "Translucent", "Durchscheinend", "#c2b5a0")],
  crab: [v("brown", "Olive brown", "Olivbraun", "#8c7951")],
  betta: [
    v(
      "wild",
      "Wild colours",
      "Wildfarben",
      "#796849",
      "#41918e",
      "shimmer",
      "#a34b3e",
    ),
  ],
  discus: [
    v("brown", "Brown & blue", "Braun & Blau", "#ab794b", "#62a6b4"),
    v("blue", "Blue & brown", "Blau & Braun", "#809b98", "#426d86"),
  ],
  zebrafish: [v("striped", "Gold & blue", "Gold & Blau", "#c8bd87")],
  cory: [v("bronze", "Bronze", "Bronze", "#a49462")],
  swordtail: [
    v("green", "Green stripe", "Grüner Streifen", "#a3ac7c", "#a05437"),
  ],
  platy: [v("olive", "Olive spots", "Olive Flecken", "#aaa67c")],
  mandarin: [v("blue", "Blue & orange", "Blau & Orange", "#36899c")],
  gramma: [v("purple", "Purple & yellow", "Violett & Gelb", "#9159aa")],
  firefish: [v("red", "White & red", "Weiß & Rot", "#d86040")],
  puffer: [v("sand", "Sandy spots", "Sandflecken", "#b3a777")],
  ray: [v("spotted", "Blue spots", "Blaue Punkte", "#b7a069")],
  jelly: [v("clear", "Translucent", "Durchscheinend", "#d5e6e4")],
  pearl_gourami: [v("pearl", "Pearl spots", "Perlenpunkte", "#baa38b")],
  rainbowfish: [v("blue-gold", "Blue & gold", "Blau & Gold", "#e8ae45")],
  ghostknife: [v("black", "Black & white", "Schwarz & Weiß", "#263347")],
  regal_angelfish: [v("striped", "Golden stripes", "Goldstreifen", "#efc34a")],
  achilles_tang: [
    v("black-orange", "Black & orange", "Schwarz & Orange", "#303b4b"),
  ],
  zebra_shark: [v("sand", "Sand & brown", "Sand & Braun", "#c6ad7a")],
};
export function getFishVariant(
  species: string,
  id?: string,
): FishVariant | undefined {
  return fishVariants[species]?.find((v) => v.id === id);
}
