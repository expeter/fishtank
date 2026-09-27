import type { Habitat, Save } from "./game";
export interface BirthNotice {
  id: string;
  habitat: Habitat;
  species: string;
}
/** Only births added during this open session are announced; purchases and reloads are quiet. */
export function newBirths(
  previous: Save | null,
  next: Save | null,
): BirthNotice[] {
  if (
    !previous ||
    !next ||
    previous.id !== next.id ||
    previous.created !== next.created
  )
    return [];
  return (["aquarium", "sea"] as const).flatMap((habitat) => {
    const known = new Set(previous.worlds[habitat].fish.map((f) => f.id));
    return next.worlds[habitat].fish
      .filter((f) => f.parents && !known.has(f.id))
      .map((f) => ({ id: f.id, habitat, species: f.species }));
  });
}
