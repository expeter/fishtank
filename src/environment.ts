/** A storybook day lasts six minutes, independently of visits. */
export const DAY_CYCLE_MS = 6 * 60 * 1000;
export type Weather = "clear" | "cloudy" | "rain";
export interface WorldEnvironment {
  hour: number;
  daylight: number;
  dusk: number;
  weather: Weather;
  rain: number;
  cloud: number;
  wind: number;
  time: number;
}
export function noise(seed: number): number {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
}
const clamp = (n: number) => Math.max(0, Math.min(1, n));
export function worldEnvironment(
  created: number,
  now: number,
): WorldEnvironment {
  const seconds = Math.max(0, now - created) / 1000;
  const hour = (9 + ((seconds * 1000) / DAY_CYCLE_MS) * 24) % 24;
  const daylight = clamp(
    (Math.sin(((hour - 6) / 24) * Math.PI * 2) + 0.12) / 0.6,
  );
  const weatherIndex = Math.floor(seconds / 150);
  // The first visit is sunny; subsequent weather is stable across reloads.
  const forecast =
    weatherIndex === 0
      ? 0
      : noise(Math.floor(created / 1000) + weatherIndex * 19);
  const weather: Weather =
    forecast > 0.72 ? "rain" : forecast > 0.4 ? "cloudy" : "clear";
  // Fade weather at either boundary to avoid popping raindrops/clouds.
  const blend = clamp(Math.min(seconds % 150, 150 - (seconds % 150)) / 12);
  return {
    hour,
    daylight,
    dusk: Math.max(0, 1 - Math.abs(daylight - 0.5) * 2),
    weather,
    rain: weather === "rain" ? blend : 0,
    cloud:
      weather === "clear" ? 0.12 : (weather === "rain" ? 0.8 : 0.5) * blend,
    wind: 0.35 + (weather === "rain" ? blend * 0.7 : 0),
    time: seconds,
  };
}
export function drawWeather(
  c: CanvasRenderingContext2D,
  w: number,
  surface: number,
  e: WorldEnvironment,
  reduced: boolean,
) {
  c.save();
  const t = reduced ? 0 : e.time;
  if (e.rain > 0) {
    c.strokeStyle = `rgba(216,244,255,${e.rain * 0.5})`;
    c.lineWidth = 1;
    for (let i = 0; i < Math.ceil(w / 16); i++) {
      const x = (noise(i + 403) * w + t * 21) % w;
      const y = (noise(i + 909) * surface + t * (65 + noise(i) * 60)) % surface;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x - 3, Math.min(surface, y + 8));
      c.stroke();
      if (i % 3 === 0) {
        const phase = (t * 0.8 + noise(i + 41)) % 1;
        c.globalAlpha = (1 - phase) * e.rain * 0.4;
        c.beginPath();
        c.ellipse(
          noise(i + 921) * w,
          surface + 2,
          2 + phase * 12,
          1 + phase * 2,
          0,
          0,
          Math.PI * 2,
        );
        c.stroke();
        c.globalAlpha = 1;
      }
    }
  }
  c.restore();
}
export interface Bubble {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}
/** Each trip has a different origin, speed, size and delay; never a repeating column. */
export function bubbleField(
  w: number,
  h: number,
  surface: number,
  time: number,
  seed: number,
  count = 22,
): Bubble[] {
  const depth = Math.max(1, h - surface - 5);
  const result: Bubble[] = [];
  for (let i = 0; i < count; i++) {
    const life = 11 + noise(seed + i * 41) * 19;
    const offset = time + noise(seed + i * 13) * life;
    const cycle = Math.floor(offset / life);
    const phase = (offset % life) / life;
    if (phase > 0.86) continue;
    const salt = seed + i * 79 + cycle * 977;
    const rise = phase / 0.86;
    result.push({
      x:
        (noise(salt) * w +
          Math.sin(rise * 8 + noise(salt + 4) * 6) *
            (3 + noise(salt + 2) * 12) +
          w) %
        w,
      y: h - 4 - rise * depth,
      radius: 1.2 + noise(salt + 3) * 3.6,
      alpha:
        Math.min(1, rise * 8, (1 - rise) * 8) * (0.18 + noise(salt + 8) * 0.28),
    });
  }
  return result;
}
export function drawBubbles(
  c: CanvasRenderingContext2D,
  w: number,
  h: number,
  surface: number,
  time: number,
  seed: number,
  reduced = false,
  count = 22,
) {
  c.save();
  c.lineWidth = 1;
  for (const b of bubbleField(w, h, surface, reduced ? 0 : time, seed, count)) {
    c.strokeStyle = `rgba(207,250,255,${b.alpha})`;
    c.beginPath();
    c.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = `rgba(248,255,245,${b.alpha * 0.8})`;
    c.beginPath();
    c.arc(
      b.x - b.radius * 0.3,
      b.y - b.radius * 0.35,
      Math.max(0.6, b.radius * 0.2),
      0,
      Math.PI * 2,
    );
    c.fill();
  }
  c.restore();
}

/** Normalized above-horizon arc; sun and moon take turns every twelve game hours. */
export function celestialPosition(hour: number) {
  const h = ((hour % 24) + 24) % 24;
  const sun = h >= 6 && h < 18;
  const phase = (sun ? h - 6 : (h + 6) % 24) / 12;
  return {
    sun,
    x: 0.08 + phase * 0.84,
    y: 0.62 - Math.sin(phase * Math.PI) * 0.47,
  };
}
export function clockAngles(hour: number) {
  return {
    hour: ((hour % 12) / 12) * Math.PI * 2 - Math.PI / 2,
    minute: (hour % 1) * Math.PI * 2 - Math.PI / 2,
  };
}
