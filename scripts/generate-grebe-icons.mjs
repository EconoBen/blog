import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const iconDirectory = path.join(root, 'public/icons');
const source = await readFile(path.join(iconDirectory, 'grebe-v1.svg'), 'utf8');
const paper = '#f7f2e8';
const square = source.replace('rx="13"', 'rx="0"');
// The standard mark's farthest point is less than 32 source pixels from center.
// At 78% scale it stays inside the maskable safe circle of radius 25.6 pixels.
const maskable = square.replace('<g id="grebe">', '<g id="grebe" transform="translate(32 32) scale(.78) translate(-32 -32)">');

async function raster(svg, size) {
  return sharp(Buffer.from(svg), { density: Math.max(144, size / 64 * 72) })
    .resize(size, size, { kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9, palette: false }).toBuffer();
}

await mkdir(iconDirectory, { recursive: true });
for (const size of [32, 180, 192, 512]) {
  const output = await raster(size === 32 ? source : square, size);
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.width, size);
  assert.equal(metadata.height, size);
  await writeFile(path.join(iconDirectory, `grebe-v1-${size}.png`), output);
}
const maskableOutput = await raster(maskable, 512);
await writeFile(path.join(iconDirectory, 'grebe-v1-maskable-512.png'), maskableOutput);

// ICO directory with lossless PNG entries, supported by modern browsers.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(size => raster(source, size)));
const directory = Buffer.alloc(6 + 16 * sizes.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index];
  directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(image.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
const ico = Buffer.concat([directory, ...images]);
assert.equal(ico.length, offset);
for (let index = 0; index < sizes.length; index += 1) {
  const entry = 6 + index * 16;
  const start = ico.readUInt32LE(entry + 12);
  const length = ico.readUInt32LE(entry + 8);
  const metadata = await sharp(ico.subarray(start, start + length)).metadata();
  assert.equal(metadata.width, sizes[index]);
  assert.equal(metadata.height, sizes[index]);
}
await writeFile(path.join(root, 'public/favicon.ico'), ico);

// Confirm the complete maskable mark fits inside the centered 80% safe circle.
const { data, info } = await sharp(maskableOutput).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const paperRGB = [247, 242, 232];
for (let y = 0; y < info.height; y += 1) {
  for (let x = 0; x < info.width; x += 1) {
    const at = (y * info.width + x) * 4;
    assert.equal(data[at + 3], 255, 'Maskable background must be opaque');
    const differs = paperRGB.some((channel, index) => Math.abs(channel - data[at + index]) > 8);
    if (differs) assert.ok(Math.hypot(x + .5 - 256, y + .5 - 256) <= 204.8, 'Grebe must fit inside the maskable safe circle');
  }
}

const previewPath = process.argv.find(argument => argument.startsWith('--preview='))?.slice('--preview='.length);
if (previewPath) {
  const labels = Buffer.from('<svg width="1040" height="360"><style>text{font:16px sans-serif;fill:#294a3f}</style><text x="24" y="30">Grebe mark</text><text x="334" y="30">16px (10× below)</text><text x="555" y="30">32px (5× below)</text><text x="792" y="30">Maskable circle</text></svg>');
  const circle = Buffer.from('<svg width="216" height="216"><circle cx="108" cy="108" r="108" fill="white"/></svg>');
  const circlePreview = await sharp(maskableOutput).resize(216, 216).composite([{ input: circle, blend: 'dest-in' }]).png().toBuffer();
  await sharp({ create: { width: 1040, height: 360, channels: 4, background: '#e8e9e4' } }).composite([
    { input: labels, left: 0, top: 0 },
    { input: await raster(source, 272), left: 24, top: 58 },
    { input: images[0], left: 334, top: 68 },
    { input: await sharp(images[0]).resize(160, 160, { kernel: 'nearest' }).png().toBuffer(), left: 334, top: 124 },
    { input: images[1], left: 555, top: 60 },
    { input: await sharp(images[1]).resize(160, 160, { kernel: 'nearest' }).png().toBuffer(), left: 555, top: 124 },
    { input: circlePreview, left: 792, top: 76 },
  ]).png().toFile(previewPath);
}
console.log('Grebe icons generated: SVG; 32, 180, 192, 512px PNG; 512px maskable; 16/32/48px ICO. Dimensions, ICO entries and maskable safe circle verified.');
