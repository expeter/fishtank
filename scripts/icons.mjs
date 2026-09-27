import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
const crc = (b) => {
  let c = 0xffffffff;
  for (const x of b) {
    c ^= x;
    for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
  }
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const t = Buffer.from(type),
    len = Buffer.alloc(4),
    sum = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  sum.writeUInt32BE(crc(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, sum]);
};
for (const size of [192, 512]) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const X = (x / size) * 192,
        Y = (y / size) * 192;
      let col = [18, 62, 72, 255];
      if (X > 125 && X < 155 && Math.abs(Y - 96) < (X - 125) * 0.75)
        col = [246, 184, 91, 255];
      if (((X - 88) / 49) ** 2 + ((Y - 96) / 32) ** 2 < 1)
        col = [246, 184, 91, 255];
      if (((X - 78) / 30) ** 2 + ((Y - 85) / 9) ** 2 < 1)
        col = [251, 205, 127, 255];
      if ((X - 63) ** 2 + (Y - 91) ** 2 < 36) col = [18, 62, 72, 255];
      if ((X - 61) ** 2 + (Y - 89) ** 2 < 4) col = [255, 249, 221, 255];
      if ((X - 49) ** 2 + (Y - 50) ** 2 < 42) col = [148, 207, 204, 255];
      const p = y * (size * 4 + 1) + 1 + x * 4;
      raw.set(col, p);
    }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  writeFileSync(
    `public/icon-${size}.png`,
    Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk("IHDR", ihdr),
      chunk("IDAT", deflateSync(raw)),
      chunk("IEND", Buffer.alloc(0)),
    ]),
  );
}
