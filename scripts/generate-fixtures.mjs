import { deflateSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outputDirectory = join(root, "tests", "fixtures");

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  const output = Buffer.alloc(4);
  output.writeUInt32BE((crc ^ 0xffffffff) >>> 0, 0);
  return output;
};

const chunk = (name, payload) => {
  const type = Buffer.from(name);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(payload.length, 0);
  return Buffer.concat([length, type, payload, crc32(Buffer.concat([type, payload]))]);
};

const png = ({ width, height, background, subject, transparent = false }) => {
  const rows = [];
  for (let y = 0; y < height; y += 1) {
    const row = Buffer.alloc(1 + width * 4);
    for (let x = 0; x < width; x += 1) {
      const inSubject = x >= subject.left && x < subject.right && y >= subject.top && y < subject.bottom;
      const color = inSubject ? subject.color : background;
      const alpha = inSubject ? 255 : (transparent ? 0 : 255);
      const offset = 1 + x * 4;
      row[offset] = color[0];
      row[offset + 1] = color[1];
      row[offset + 2] = color[2];
      row[offset + 3] = alpha;
    }
    rows.push(row);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
};

const white = [255, 255, 255];
const gray = [220, 220, 220];
const dark = [80, 80, 80];

const definitions = [
  ["valid-2000x2000.png", { width: 2000, height: 2000, background: white, subject: { left: 400, top: 400, right: 1600, bottom: 1600, color: dark } }],
  ["too-small-400x400.png", { width: 400, height: 400, background: white, subject: { left: 80, top: 80, right: 320, bottom: 320, color: dark } }],
  ["transparent-2000x2000.png", { width: 2000, height: 2000, background: white, transparent: true, subject: { left: 400, top: 400, right: 1600, bottom: 1600, color: dark } }],
  ["non-white-background-2000x2000.png", { width: 2000, height: 2000, background: gray, subject: { left: 400, top: 400, right: 1600, bottom: 1600, color: dark } }],
  ["product-too-small-2000x2000.png", { width: 2000, height: 2000, background: white, subject: { left: 900, top: 900, right: 1100, bottom: 1100, color: dark } }],
  ["borderline-2000x2000.png", { width: 2000, height: 2000, background: [250, 250, 250], subject: { left: 500, top: 500, right: 1500, bottom: 1500, color: [160, 160, 160] } }],
];

await mkdir(outputDirectory, { recursive: true });
for (const [name, definition] of definitions) {
  await writeFile(join(outputDirectory, name), png(definition));
}
console.log(`Generated ${definitions.length} PNG fixtures in ${outputDirectory}`);
