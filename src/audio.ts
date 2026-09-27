let ctx: AudioContext | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;
let step = 0;
let enabled = false;
let musicEnabled = false;
let effectGeneration = 0;
type Bus = "music" | "effect";
const voices = new Map<OscillatorNode, { bus: Bus; dispose: () => void }>();
const effectTimers = new Set<ReturnType<typeof setTimeout>>();

/** Original miniature scores: -1 is a rest, other values are semitone offsets.
 * Two phrases, two instruments and changing chord roots make each theme breathe. */
const themes = [
  {
    base: 60,
    beat: 780,
    wave: "sine",
    notes: [0, 4, 7, -1, 9, 7, 4, 2, 0, -1, 7, 12, 9, 7, 4, -1],
    chords: [0, 5, 9, 7],
  },
  {
    base: 62,
    beat: 960,
    wave: "triangle",
    notes: [7, -1, 4, 2, 0, 4, -1, 7, 9, 12, 9, -1, 7, 4, 2, -1],
    chords: [0, 7, 5, 0],
  },
  {
    base: 57,
    beat: 680,
    wave: "sine",
    notes: [0, 7, -1, 4, 9, -1, 7, 12, 11, 7, 4, -1, 2, 4, 0, -1],
    chords: [0, 9, 5, 7],
  },
  {
    base: 65,
    beat: 1180,
    wave: "triangle",
    notes: [12, -1, 7, -1, 9, 7, 4, -1, 5, -1, 4, 2, 0, -1, 7, -1],
    chords: [0, 5, 7, 0],
  },
] as const;
const pitch = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

function stopVoices(bus?: Bus) {
  for (const [voice, state] of voices) {
    if (bus && state.bus !== bus) continue;
    try {
      voice.stop();
    } catch {
      /* Already ended. */
    }
    state.dispose();
  }
}
function note(
  hz: number,
  duration: number,
  volume: number,
  bus: Bus,
  wave: OscillatorType = "sine",
) {
  if (
    !enabled ||
    (bus === "music" && !musicEnabled) ||
    !ctx ||
    ctx.state !== "running"
  )
    return;
  const o = ctx.createOscillator(),
    g = ctx.createGain();
  o.type = wave;
  o.frequency.value = hz;
  const at = ctx.currentTime;
  g.gain.setValueAtTime(0.001, at);
  g.gain.exponentialRampToValueAtTime(
    volume,
    at + Math.min(0.07, duration / 4),
  );
  g.gain.exponentialRampToValueAtTime(0.001, at + duration);
  o.connect(g);
  g.connect(ctx.destination);
  const dispose = () => {
    if (!voices.delete(o)) return;
    o.disconnect();
    g.disconnect();
    o.onended = null;
  };
  voices.set(o, { bus, dispose });
  o.onended = dispose;
  o.start();
  o.stop(at + duration);
}
function musicTick() {
  timer = undefined;
  if (!enabled || !musicEnabled) return;
  // Each 32-beat chapter lasts about 22–38 seconds; a full cycle is almost two minutes.
  const theme = themes[Math.floor(step / 32) % themes.length];
  const position = step % 32,
    phrase = Math.floor(position / 16);
  const melody = theme.notes[position % 16];
  if (melody >= 0) {
    const octave = phrase && position % 4 === 0 ? 12 : 0;
    note(
      pitch(theme.base + melody + octave),
      (theme.beat / 1000) * 1.35,
      0.012,
      "music",
      phrase ? "sine" : theme.wave,
    );
    // A quiet upper bell accompanies just a few notes, leaving space for water sounds.
    if (position % 8 === 4)
      note(pitch(theme.base + melody + 12), 0.8, 0.003, "music");
  }
  if (position % 8 === 0) {
    const root = theme.base - 12 + theme.chords[Math.floor(position / 8)];
    note(pitch(root), (theme.beat / 1000) * 4.2, 0.006, "music", "sine");
    note(
      pitch(root + 7),
      (theme.beat / 1000) * 3.2,
      0.003,
      "music",
      "triangle",
    );
  }
  step++;
  // Alternating long/short beats gives the faster chapter a gentle skipping rhythm.
  const swing =
    Math.floor((step - 1) / 32) % themes.length === 2
      ? step % 2
        ? 1.12
        : 0.88
      : 1;
  timer = setTimeout(musicTick, theme.beat * swing);
}
export function sound(wanted: boolean, music: boolean) {
  enabled = wanted;
  musicEnabled = wanted && music;
  if (!musicEnabled) {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    stopVoices("music");
  }
  if (!wanted) {
    effectGeneration++;
    for (const pending of effectTimers) clearTimeout(pending);
    effectTimers.clear();
    stopVoices();
    if (ctx && ctx.state !== "closed") void ctx.suspend().catch(() => {});
    return;
  }
  try {
    if (typeof AudioContext === "undefined") return;
    if (!ctx || ctx.state === "closed") ctx = new AudioContext();
    const context = ctx;
    void context
      .resume()
      .then(() => {
        // A delayed autoplay unlock must not override a more recent mute.
        if (!enabled && context.state !== "closed") return context.suspend();
      })
      .catch(() => {});
  } catch {
    return; // Audio is optional; unavailable output must not stop the game.
  }
  if (musicEnabled && timer === undefined) timer = setTimeout(musicTick, 300);
}
export function tone(hz = 660, duration = 0.15, volume = 0.05) {
  note(hz, duration, volume, "effect");
}

export type SoundEffect =
  "feed" | "play" | "learn" | "bubble" | "buy" | "place" | "hello";
/** Tiny hand-composed water instruments; no downloads or audio tracking. */
export function effect(name: SoundEffect) {
  if (!enabled || !ctx || ctx.state !== "running") return;
  const generation = effectGeneration;
  const variation = 0.94 + Math.random() * 0.12;
  const melodies: Record<SoundEffect, number[]> = {
    feed: [390, 560, 740],
    play: [523, 784, 659],
    learn: [523, 659, 784, 1047],
    bubble: [240, 410],
    buy: [659, 880, 1047],
    place: [330, 440],
    hello: [659, 523, 784, 659],
  };
  const notes = melodies[name];
  const spacing = name === "feed" || name === "bubble" ? 34 : 70;
  notes.forEach((hz, i) => {
    const play = () => {
      if (generation !== effectGeneration) return;
      tone(
        hz * variation,
        name === "bubble" ? 0.085 : 0.13,
        0.026 / (1 + i * 0.12),
      );
    };
    if (i === 0) play();
    else {
      const pending = setTimeout(() => {
        effectTimers.delete(pending);
        play();
      }, i * spacing);
      effectTimers.add(pending);
    }
  });
}
