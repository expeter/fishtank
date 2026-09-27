import type { Save, Habitat, World } from "./game";
export interface LayoutSnapshot {
  habitat: Habitat;
  decor: World["decor"];
  background: number;
  ground: number;
  sand?: number[];
}
export function captureLayout(save: Save): LayoutSnapshot {
  const world = save.worlds[save.habitat];
  return structuredClone({
    habitat: save.habitat,
    decor: world.decor,
    background: world.background,
    ground: world.ground,
    sand: world.sand,
  });
}
/** Undo the layout only: purchased items remain owned and coins are never refunded. */
export function restoreLayout(save: Save, snapshot: LayoutSnapshot): Save {
  if (save.habitat !== snapshot.habitat) return save;
  const next = structuredClone(save),
    world = next.worlds[snapshot.habitat];
  const wanted = new Set(snapshot.decor.map((d) => d.id)),
    present = new Set(world.decor.map((d) => d.id));
  for (const d of world.decor.filter((d) => !wanted.has(d.id)))
    next.inventory.push(d.kind);
  for (const d of snapshot.decor.filter((d) => !present.has(d.id))) {
    const index = next.inventory.indexOf(d.kind);
    if (index < 0) return save;
    next.inventory.splice(index, 1);
  }
  world.decor = structuredClone(snapshot.decor);
  world.background = snapshot.background;
  world.ground = snapshot.ground;
  world.sand = snapshot.sand ? [...snapshot.sand] : undefined;
  return next;
}
