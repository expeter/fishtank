export interface PostcardOptions {
  worldName: string;
  timestamp: number;
  message: string;
  lang: "en" | "de";
}

/** File names are safe on phones; a retained capture timestamp also names edited previews. */
export function postcardMetadata(options: PostcardOptions) {
  const date = new Date(options.timestamp);
  const timestamp = Number.isFinite(date.getTime()) ? date : new Date(0);
  const worldName =
    options.worldName.trim() ||
    (options.lang === "de" ? "Meine kleine Welt" : "My little world");
  const slug =
    worldName
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 56) || "little-fishtank";
  return {
    worldName,
    message: Array.from(options.message.replace(/\r\n?/g, "\n").trim())
      .slice(0, 180)
      .join(""),
    date: new Intl.DateTimeFormat(options.lang === "de" ? "de-DE" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(timestamp),
    filename: `${slug}-${timestamp.toISOString().replace(/[:.]/g, "-")}.png`,
  };
}

/** Wrap both paragraphs and long unbroken names without drawing outside the postcard. */
export function postcardLines(
  text: string,
  maxWidth: number,
  measure: (text: string) => number,
): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    let current = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const proposed = current ? `${current} ${word}` : word;
      if (measure(proposed) <= maxWidth) {
        current = proposed;
        continue;
      }
      if (current) {
        lines.push(current);
        current = "";
      }
      for (const character of Array.from(word)) {
        if (current && measure(current + character) > maxWidth) {
          lines.push(current);
          current = "";
        }
        current += character;
      }
    }
    lines.push(current);
  }
  return lines;
}

export function capturePhoto(
  canvas: HTMLCanvasElement,
  options?: PostcardOptions,
): Promise<File> {
  return new Promise((resolve, reject) => {
    let output = canvas;
    let filename = "little-fishtank.png";
    if (options) {
      const metadata = postcardMetadata(options);
      filename = metadata.filename;
      output = document.createElement("canvas");
      output.width = canvas.width;
      const c = output.getContext("2d");
      if (!c || !canvas.width || !canvas.height) {
        reject(new Error("Could not create the postcard"));
        return;
      }
      // Layout in an 800px design space so long world captures retain proportionate type.
      const scale = canvas.width / 800;
      const padding = 32;
      c.font = '600 30px "DM Sans", sans-serif';
      const title = postcardLines(
        metadata.worldName,
        736,
        (text) => c.measureText(text).width,
      );
      c.font = '24px "DM Sans", sans-serif';
      const message = metadata.message
        ? postcardLines(
            metadata.message,
            736,
            (text) => c.measureText(text).width,
          )
        : [];
      const footer =
        padding * 2 +
        title.length * 36 +
        29 +
        (message.length ? 16 + message.length * 32 : 0);
      output.height = canvas.height + Math.ceil(footer * scale);
      c.drawImage(canvas, 0, 0);
      c.save();
      c.translate(0, canvas.height);
      c.scale(scale, scale);
      c.fillStyle = "#fff1d0";
      c.fillRect(0, 0, 800, footer);
      c.fillStyle = "#c18d4e";
      c.fillRect(0, 0, 800, 3);
      c.textBaseline = "top";
      c.fillStyle = "#234f4b";
      c.font = '600 30px "DM Sans", sans-serif';
      let y = padding;
      for (const line of title) {
        c.fillText(line, padding, y);
        y += 36;
      }
      c.fillStyle = "#6d6b58";
      c.font = '20px "DM Sans", sans-serif';
      c.fillText(metadata.date, padding, y + 3);
      y += 29;
      if (message.length) {
        y += 16;
        c.font = '24px "DM Sans", sans-serif';
        c.fillStyle = "#38564f";
        for (const line of message) {
          c.fillText(line, padding, y);
          y += 32;
        }
      }
      c.restore();
    }
    output.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not capture the habitat"));
        return;
      }
      resolve(new File([blob], filename, { type: "image/png" }));
    }, "image/png");
  });
}
export function canSharePhoto(file: File): boolean {
  try {
    return (
      typeof navigator.share === "function" &&
      Boolean(navigator.canShare?.({ files: [file] }))
    );
  } catch {
    return false;
  }
}
export function downloadPhoto(file: File): void {
  const url = URL.createObjectURL(file),
    link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
