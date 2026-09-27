import { afterEach, describe, expect, it, vi } from "vitest";
import { capturePhoto, postcardLines, postcardMetadata } from "../src/sharing";

const options = {
  worldName: "Léni’s Wald / Meer",
  timestamp: Date.UTC(2026, 8, 27, 14, 12, 0, 123),
  message: "Hallo, Oma!\nMeine Fische heißen Goldi und Pip.",
  lang: "de" as const,
};
afterEach(() => vi.unstubAllGlobals());
describe("personal habitat postcards", () => {
  it("keeps a safe world-specific filename with capture time down to milliseconds", () => {
    expect(postcardMetadata(options).filename).toBe(
      "leni-s-wald-meer-2026-09-27T14-12-00-123Z.png",
    );
    expect(
      postcardMetadata({ ...options, timestamp: options.timestamp + 1 })
        .filename,
    ).not.toBe(postcardMetadata(options).filename);
    expect(postcardMetadata(options)).toEqual(postcardMetadata(options));
    expect(postcardMetadata({ ...options, lang: "en" }).date).not.toBe(
      postcardMetadata(options).date,
    );
  });
  it("limits message codepoints without splitting emoji and preserves handwritten line breaks", () => {
    const m = postcardMetadata({
      ...options,
      message: "🐟".repeat(181),
    }).message;
    expect(Array.from(m)).toHaveLength(180);
    expect(m.endsWith("🐟")).toBe(true);
    expect(
      postcardMetadata({ ...options, message: " Hello\r\nPip " }).message,
    ).toBe("Hello\nPip");
  });
  it("wraps paragraphs and long words to the available width", () => {
    const measure = (s: string) => Array.from(s).length * 10;
    const lines = postcardLines(
      "Hello lovely friend\n\nabcdefghijklmnop",
      70,
      measure,
    );
    expect(lines).toContain("");
    expect(lines.every((line) => measure(line) <= 70)).toBe(true);
    expect(lines.join("").replace(/ /g, "")).toBe(
      "Hellolovelyfriendabcdefghijklmnop",
    );
  });
  it("draws the frozen habitat and personalized footer onto a separate PNG canvas", async () => {
    const text: string[] = [];
    const context = {
      font: "",
      fillStyle: "",
      textBaseline: "",
      measureText: (s: string) => ({ width: s.length * 13 }),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      fillRect: vi.fn(),
      fillText: (s: string) => text.push(s),
    };
    const output = {
      width: 0,
      height: 0,
      getContext: () => context,
      toBlob: (done: (b: Blob) => void) => done(new Blob(["png"])),
    };
    vi.stubGlobal("document", { createElement: () => output });
    const source = { width: 800, height: 600 } as HTMLCanvasElement;
    const file = await capturePhoto(source, options);
    expect(context.drawImage).toHaveBeenCalledWith(source, 0, 0);
    expect(source.height).toBe(600);
    expect(output.height).toBeGreaterThan(750);
    expect(output.width).toBe(800);
    expect(text).toContain(options.worldName);
    expect(text).toContain("Hallo, Oma!");
    expect(text).toContain(postcardMetadata(options).date);
    expect(file.type).toBe("image/png");
    expect(file.name).toBe(postcardMetadata(options).filename);
  });
  it("preserves the raw-capture API and reports a failed canvas export", async () => {
    const canvas = {
      toBlob: (done: (b: Blob | null) => void) => done(new Blob(["png"])),
    } as HTMLCanvasElement;
    expect((await capturePhoto(canvas)).name).toBe("little-fishtank.png");
    canvas.toBlob = (done: BlobCallback) => done(null);
    await expect(capturePhoto(canvas)).rejects.toThrow("Could not capture");
  });
});
