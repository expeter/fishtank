import type { FoodKind } from "./feeding";
/** Recognisable food containers and animals, not abstract flakes/wind symbols. */
export default function FoodIcon({ kind }: { kind: FoodKind }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === "worms" ? (
        <>
          <path
            d="M4 16c-4-8 8-8 7-2s8 8 8-1c0-4-6-6-5-9"
            stroke="#ac5e42"
            strokeWidth="4"
          />
          <path d="m4 11 2 1m2 1 2 1m6 3 2-1" />
          <circle cx="14" cy="4" r=".7" fill="currentColor" />
        </>
      ) : kind === "insects" ? (
        <>
          <ellipse
            cx="8"
            cy="8"
            rx="4"
            ry="3"
            fill="#d4edf0"
            transform="rotate(30 8 8)"
          />
          <ellipse
            cx="16"
            cy="8"
            rx="4"
            ry="3"
            fill="#d4edf0"
            transform="rotate(-30 16 8)"
          />
          <ellipse cx="12" cy="13" rx="3" ry="6" fill="#c39b5a" />
          <path d="m8 12-3 2m11-2 3 2m-10 2-3 3m10-3 3 3M10 4 8 2m6 2 2-2" />
        </>
      ) : (
        <>
          <path d="M5 7h14v13c-4 2-10 2-14 0Z" fill="#f5d38b" />
          <ellipse cx="12" cy="7" rx="7" ry="2" fill="#986f40" />
          <path d="m6 5 11-3 3 2-11 3Z" fill="#e6b871" />
          {kind === "algae" ? (
            <>
              <path d="M9 17c-2-6 6-7 7-7 0 6-3 9-7 7Z" fill="#639966" />
              <path d="m9 18 5-6" />
            </>
          ) : kind === "pellets" ? (
            <g fill="#946140">
              <circle cx="10" cy="13" r="1.5" />
              <circle cx="15" cy="15" r="1.5" />
              <circle cx="10" cy="18" r="1.5" />
            </g>
          ) : (
            <>
              <path d="m8 12 5-1-1 4-4 1Z" fill="#d28043" />
              <path d="m13 16 4-1-1 4-4-1Z" fill="#b56838" />
            </>
          )}
        </>
      )}
    </svg>
  );
}
