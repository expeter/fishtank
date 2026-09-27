import { Leaf, Wind } from "lucide-react";
import type { FoodKind } from "./feeding";
export default function FoodIcon({ kind }: { kind: FoodKind }) {
  return (
    <>
      {kind === "algae" ? (
        <Leaf />
      ) : kind === "insects" ? (
        <Wind />
      ) : kind === "worms" ? (
        <svg viewBox="0 0 24 24">
          <path
            d="M4 18C-2 8 12 20 10 10S22 1 19 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      ) : kind === "pellets" ? (
        <svg viewBox="0 0 24 24">
          <circle cx="7" cy="8" r="4" fill="currentColor" />
          <circle cx="17" cy="15" r="4" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24">
          <path d="m2 4 8-2 1 9-8 2zm12 9 7-2 1 8-8 2" fill="currentColor" />
        </svg>
      )}
    </>
  );
}
