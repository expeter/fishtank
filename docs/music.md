# Original procedural music

The soundtrack uses four original miniature scores made with Web Audio; there are no downloaded tracks, samples or external assets. Each 32-beat chapter changes melody, chord roots, pitch centre and pace. Chapters rotate automatically:

- **Sunlit pebbles:** clear sine notes in C, open rests and a light upper bell.
- **Reed boats:** warmer triangle notes in D, a slower answering phrase.
- **Skipping minnows:** an A-based phrase with gently uneven beats and a brighter second phrase.
- **Moonlit window:** a slower F-based lullaby with more breathing room.

Each chapter lasts roughly 22–38 seconds. Together they form an almost two-minute cycle, with quiet bass-and-fifth harmony every eight beats. Soft attack/release envelopes avoid abrupt clicks; the harmony stays below the melody so interactions remain audible. These titles describe the composed scores; no additional menu or track selector is needed.

The existing `sound(wanted, music)` API and effect names remain unchanged. One timeout schedules music. Repeated settings calls do not create extra clocks or restart the sequence. Turning music off stops and disconnects its currently sounding notes while allowing enabled effects to finish. Master mute stops all voices, clears queued effect notes and music scheduling, then suspends the audio context. Delayed browser resume callbacks cannot override mute. Finished voices disconnect their oscillator and gain nodes.

`tests/audio.test.ts` verifies that playback actually changes pitches, instruments, intervals and simultaneous harmony across the cycle; it also covers repeated enable calls, independent effects, immediate mute, queued-note cancellation, delayed unlock and unavailable audio output.
