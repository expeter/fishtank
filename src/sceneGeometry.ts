import type { Decoration } from "./game";

/** Preserve the original 60 Hz motion speed on high-refresh and slower screens. */
export function motionBlend(blendAt60Hz: number, elapsedMs: number): number {
  return (
    1 -
    Math.pow(
      1 - blendAt60Hz,
      Math.max(0, Math.min(100, elapsedMs)) / (1000 / 60),
    )
  );
}

/** Canvas decorations are drawn in CSS pixels, not fractions of the viewport. */
export function pickDecoration(
  decorations: Decoration[],
  x: number,
  y: number,
  width: number,
  height: number,
): Decoration | undefined {
  return [...decorations]
    .sort((a, b) => b.layer - a.layer)
    .find((d) => {
      const px = x * width - d.x * width,
        py = y * height - d.y * height,
        angle = ((d.rotation ?? 0) * Math.PI) / 180,
        dx = px * Math.cos(angle) + py * Math.sin(angle),
        dy = -px * Math.sin(angle) + py * Math.cos(angle);
      return (
        Math.abs(dx) <= 55 * d.scale + 8 &&
        dy >= -115 * d.scale - 8 &&
        dy <= 10 * d.scale + 8
      );
    });
}

/** Keep an edited toy reachable when a turn moves its tall end below the floor. */
export function fitDecoration(
  d: Decoration,
  width: number,
  height: number,
  left = 0,
  visibleWidth = width,
  top = 0,
  visibleHeight = height,
): Pick<Decoration, "x" | "y"> {
  const angle = ((d.rotation ?? 0) * Math.PI) / 180;
  const corners = [
    [-55, -115],
    [55, -115],
    [-55, 10],
    [55, 10],
  ].map(([x, y]) => ({
    x: (x * Math.cos(angle) - y * Math.sin(angle)) * d.scale,
    y: (x * Math.sin(angle) + y * Math.cos(angle)) * d.scale,
  }));
  const bound = (
    value: number,
    start: number,
    end: number,
    min: number,
    max: number,
  ) => {
    const low = start + 8 - min,
      high = end - 8 - max;
    return low > high ? (low + high) / 2 : Math.max(low, Math.min(high, value));
  };
  return {
    x:
      bound(
        d.x * width,
        left,
        left + visibleWidth,
        Math.min(...corners.map((c) => c.x)),
        Math.max(...corners.map((c) => c.x)),
      ) / width,
    y:
      bound(
        d.y * height,
        Math.max(height * 0.22, top),
        Math.min(height, top + visibleHeight),
        Math.min(...corners.map((c) => c.y)),
        Math.max(...corners.map((c) => c.y)),
      ) / height,
  };
}

/** Distance-capped movement: a far-away tap must never turn into a sprint. */
export function swimStep(
  from: { x: number; y: number },
  target: { x: number; y: number },
  elapsedMs: number,
  pixelsPerSecond: number,
) {
  const dx = target.x - from.x,
    dy = target.y - from.y;
  const distance = Math.hypot(dx, dy);
  const step = Math.min(
    distance * motionBlend(0.018, elapsedMs),
    (Math.max(0, pixelsPerSecond) * Math.max(0, Math.min(100, elapsedMs))) /
      1000,
  );
  return distance
    ? { x: from.x + (dx / distance) * step, y: from.y + (dy / distance) * step }
    : { ...from };
}
