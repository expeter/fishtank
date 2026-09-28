let ctx: AudioContext | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;
let ambienceTimer: ReturnType<typeof setTimeout> | undefined;
let ambienceEnabled = false;
let habitat: "aquarium" | "sea" = "aquarium";
let step = 0;
let enabled = false;
let musicEnabled = false;
let effectGeneration = 0;
type Bus = "music" | "effect" | "ambience";
const voices = new Map<
  AudioScheduledSourceNode,
  { bus: Bus; dispose: () => void }
>();
const effectTimers = new Set<ReturnType<typeof setTimeout>>();

/** Original miniature scores: -1 is a rest, other values are semitone offsets.
 * Two phrases, two instruments and changing chord roots make each theme breathe. */
const themes = [
  {
    base: 48,
    beat: 1050,
    wave: "sine",
    notes: [0, 4, 7, -1, 9, 7, 4, 2, 0, -1, 7, 12, 9, 7, 4, -1],
    chords: [0, 5, 9, 7],
  },
  {
    base: 50,
    beat: 960,
    wave: "triangle",
    notes: [7, -1, 4, 2, 0, 4, -1, 7, 9, 12, 9, -1, 7, 4, 2, -1],
    chords: [0, 7, 5, 0],
  },
  {
    base: 45,
    beat: 920,
    wave: "sine",
    notes: [0, 7, -1, 4, 9, -1, 7, 12, 11, 7, 4, -1, 2, 4, 0, -1],
    chords: [0, 9, 5, 7],
  },
  {
    base: 53,
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
    (bus === "ambience" && !ambienceEnabled) ||
    !ctx ||
    ctx.state !== "running"
  )
    return;
  const o = ctx.createOscillator(),
    g = ctx.createGain(),
    filter = ctx.createBiquadFilter();
  o.type = wave;
  o.frequency.value = Math.max(65, Math.min(520, hz));
  filter.type = "lowpass";
  filter.frequency.value = bus === "music" ? 650 : 700;
  filter.Q.value = 0.3;
  volume = Math.max(0.001, Math.min(volume, bus === "music" ? 0.012 : 0.018));
  const at = ctx.currentTime;
  g.gain.setValueAtTime(0.001, at);
  g.gain.exponentialRampToValueAtTime(
    volume,
    at + Math.min(bus === "music" ? 0.3 : 0.035, duration / 3),
  );
  g.gain.exponentialRampToValueAtTime(0.001, at + duration);
  o.connect(filter);
  filter.connect(g);
  g.connect(ctx.destination);
  const dispose = () => {
    if (!voices.delete(o)) return;
    o.disconnect();
    filter.disconnect();
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
    const octave = phrase && position % 4 === 0 ? -5 : 0;
    note(
      pitch(theme.base + melody + octave),
      (theme.beat / 1000) * 1.35,
      0.012,
      "music",
      phrase ? "sine" : theme.wave,
    );
    // A sparse lower answer gives the phrase warmth without upper bells.
    if (position % 8 === 4)
      note(pitch(theme.base + melody - 7), 1.5, 0.003, "music");
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
/** Independent sparse environmental voice; no constant hiss or pitched bird whistles. */
function ambienceTick() {
  ambienceTimer = undefined;
  if (!enabled || !ambienceEnabled) return;
  if (ctx?.state === "running") {
    const context = ctx;
    const duration =
      habitat === "sea" ? 3 + Math.random() * 2 : 0.9 + Math.random();
    const buffer = context.createBuffer(
      1,
      Math.ceil(context.sampleRate * duration),
      context.sampleRate,
    );
    const data = buffer.getChannelData(0);
    let low = 0;
    for (let i = 0; i < data.length; i++) {
      low = (low + (Math.random() * 2 - 1) * 0.025) / 1.025;
      // Slow texture movement resembles a receding wave or a soft filter trickle.
      data[i] = low * (0.7 + 0.3 * Math.sin((i / context.sampleRate) * 7));
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.value = habitat === "sea" ? 420 : 600;
    filter.Q.value = 0.3;
    const at = context.currentTime;
    gain.gain.setValueAtTime(0.001, at);
    gain.gain.exponentialRampToValueAtTime(
      habitat === "sea" ? 0.065 : 0.045,
      at + duration * 0.4,
    );
    gain.gain.exponentialRampToValueAtTime(0.001, at + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    const dispose = () => {
      if (!voices.delete(source)) return;
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
      source.onended = null;
    };
    voices.set(source, { bus: "ambience", dispose });
    source.onended = dispose;
    source.start();
    source.stop(at + duration);
  }
  ambienceTimer = setTimeout(
    ambienceTick,
    (habitat === "sea" ? 11000 : 14000) + Math.random() * 9000,
  );
}

export function sound(
  wanted: boolean,
  music: boolean,
  ambience = false,
  nextHabitat: "aquarium" | "sea" = "aquarium",
) {
  enabled = wanted;
  musicEnabled = wanted && music;
  ambienceEnabled = wanted && ambience;
  if (!ambienceEnabled || habitat !== nextHabitat) {
    if (ambienceTimer !== undefined) clearTimeout(ambienceTimer);
    ambienceTimer = undefined;
    stopVoices("ambience");
  }
  habitat = nextHabitat;
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
  if (ambienceEnabled && ambienceTimer === undefined)
    ambienceTimer = setTimeout(ambienceTick, 1800);
}
export function tone(hz = 330, duration = 0.18, volume = 0.018) {
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
    feed: [175, 220, 294],
    play: [220, 330, 277],
    learn: [220, 277, 330, 440],
    bubble: [140, 210],
    buy: [262, 330, 392],
    place: [165, 220],
    hello: [277, 220, 330, 277],
  };
  const notes = melodies[name];
  const spacing = name === "feed" || name === "bubble" ? 34 : 70;
  notes.forEach((hz, i) => {
    const play = () => {
      if (generation !== effectGeneration) return;
      tone(
        hz * variation,
        name === "bubble" ? 0.085 : 0.13,
        0.014 / (1 + i * 0.12),
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
