import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { chromium } from 'playwright';

// Exercise the actual prepared artwork without a dev server or review files.
const source = ts.transpileModule(fs.readFileSync('app/components/arrivalWingSections.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const asset = 'data:image/webp;base64,' + fs.readFileSync('public/assets/grebes/arrival/flight-wings-v3.webp').toString('base64');
const browser = await chromium.launch({ headless: true, timeout: 10_000 });
try {
  const page = await browser.newPage();
  const result = await page.evaluate(async ({ source, asset }) => {
    const module = { exports: {} };
    new Function('module', 'exports', source)(module, module.exports);
    const image = new Image();
    image.src = asset;
    await image.decode();
    const create = document.createElement.bind(document);
    const allocated = [];
    document.createElement = (name, ...args) => {
      const node = create(name, ...args);
      if (name === 'canvas') allocated.push(node);
      return node;
    };
    let textures;
    try {
      textures = module.exports.createSectionedWingTextures(image);
    } finally {
      document.createElement = create;
    }
    const groups = textures.sections;
    const pixel = (canvas, x, y) => [...canvas.getContext('2d').getImageData(x, y, 1, 1).data];
    const composite = [];
    for (let blend = 0; blend < 5; blend++) {
      const canvas = create('canvas');
      canvas.width = 1536;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      for (const group of [...groups].reverse()) context.drawImage(group.blends[blend], group.x, 0);
      composite.push(canvas);
    }
    // A sample at each tip alone missed the rejected column-registration bug.
    // Count every connected region, so a detached feather fragment also fails.
    const components = canvas => {
      const width = 1536;
      const count = width * 512;
      const data = canvas.getContext('2d').getImageData(0, 0, width, 512).data;
      const solid = new Uint8Array(count);
      const seen = new Uint8Array(count);
      const queue = new Int32Array(count);
      const areas = [];
      for (let i = 0; i < count; i++) solid[i] = data[i * 4 + 3] > 64 ? 1 : 0;
      for (let start = 0; start < count; start++) {
        if (!solid[start] || seen[start]) continue;
        let head = 0;
        let tail = 1;
        queue[0] = start;
        seen[start] = 1;
        while (head < tail) {
          const i = queue[head++];
          const x = i % width;
          for (const next of [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i + width]) {
            if (next >= 0 && next < count && solid[next] && !seen[next]) {
              seen[next] = 1;
              queue[tail++] = next;
            }
          }
        }
        areas.push(tail);
      }
      let borderInk = 0;
      for (let y = 0; y < 512; y++) for (let x = 0; x < width; x++) {
        if ((x < 64 || x >= 1510 || y < 40 || y >= 500) && data[(y * width + x) * 4 + 3] !== 0) borderInk++;
      }
      return { areas: areas.sort((a, b) => b - a), borderInk };
    };
    const raw = create('canvas');
    raw.width = 1536;
    raw.height = 1024;
    raw.getContext('2d').drawImage(image, 0, 0);
    const distalPoints = [[1200, 260], [1380, 350], [1435, 305]];
    const persistent = allocated.filter(canvas => canvas.width > 1 || canvas.height > 1);
    const values = {
      groups: groups.map(group => ({ x: group.x, width: group.width, dimensions: group.blends.map(canvas => [canvas.width, canvas.height]) })),
      uniqueTextures: new Set(groups.flatMap(group => group.blends)).size,
      allocations: allocated.length,
      persistentBuffers: persistent.length,
      persistentPixels: persistent.reduce((sum, canvas) => sum + canvas.width * canvas.height, 0),
      temporaryDisposed: allocated.filter(canvas => !persistent.includes(canvas)).map(canvas => [canvas.width, canvas.height]),
      exterior: composite.map(canvas => [[0, 0], [60, 160], [500, 20], [700, 500], [1460, 460], [1500, 380]].map(([x, y]) => pixel(canvas, x, y)[3])),
      // These coordinates lie inside the white bar in both painted views;
      // farther left, the registered ventral view has a dark feather shaft.
      white: composite.map(canvas => [[750, 385], [730, 360], [820, 390]].map(([x, y]) => pixel(canvas, x, y))),
      distal: composite.map(canvas => distalPoints.map(([x, y]) => pixel(canvas, x, y))),
      originalDistal: distalPoints.map(([x, y]) => pixel(raw, x, y)),
      statistics: composite.map(components),
      innerSurface: composite.map(canvas => pixel(canvas, 500, 180)),
    };
    textures.dispose();
    textures.dispose();
    values.disposed = allocated.map(canvas => [canvas.width, canvas.height]);
    values.failures = [];
    for (let failureAt = 1; failureAt <= 16; failureAt++) {
      const acquired = [];
      document.createElement = (name, ...args) => {
        const node = create(name, ...args);
        if (name === 'canvas') {
          acquired.push(node);
          if (acquired.length === failureAt) node.getContext = () => null;
        }
        return node;
      };
      let error;
      try {
        module.exports.createSectionedWingTextures(image);
      } catch (failure) {
        error = String(failure);
      } finally {
        document.createElement = create;
      }
      values.failures.push({ at: failureAt, acquired: acquired.length, error, disposed: acquired.every(canvas => canvas.width === 1 && canvas.height === 1) });
    }
    for (const canvas of [...composite, raw]) canvas.width = canvas.height = 1;
    return values;
  }, { source, asset });

  assert.equal(result.groups.length, 3, 'The root, inner wing and outer fan retain separate feather ownership');
  for (const [index, group] of result.groups.entries()) {
    assert.equal(group.dimensions.length, 5, 'Each section caches all five surface blends');
    assert.ok(group.width < 1536 && group.width > 200, 'The section stores its cropped feather region');
    assert.ok(group.dimensions.every(([width, height]) => width === group.width && height === 512));
    if (index > 0) {
      const previous = result.groups[index - 1];
      assert.ok(group.x > previous.x && group.x < previous.x + previous.width, 'Adjacent feather groups overlap in source space');
    }
  }
  assert.equal(result.uniqueTextures, 15);
  assert.equal(result.persistentBuffers, 15, 'The cache retains only the fifteen cropped textures');
  assert.ok(result.persistentPixels <= 4_400_000, 'The persistent texture budget stays near 4.38 million pixels');
  assert.equal(result.allocations, 16, 'Only one temporary full-width source is needed');
  assert.deepEqual(result.temporaryDisposed, [[1, 1]], 'The full-width preparation buffer is released before return');
  for (const exterior of result.exterior) assert.ok(exterior.every(alpha => alpha === 0), 'Opaque checkerboard pixels stay outside the contour');
  for (const [blend, statistics] of result.statistics.entries()) {
    assert.equal(statistics.borderInk, 0, `Blend ${blend} has a completely transparent outer margin`);
    assert.equal(statistics.areas.length, 1, `Blend ${blend} must keep every primary tip connected; fragments are not acceptable`);
    assert.ok(statistics.areas[0] > 350_000 && statistics.areas[0] < 450_000, 'The connected silhouette retains the broad feather field');
  }
  for (const white of result.white) for (const color of white) {
    assert.equal(color[3], 255, 'The white flight bar remains fully opaque in every blend');
    assert.ok(Math.min(...color.slice(0, 3)) > 170, 'White feathers retain their pale ink, not a dark fill');
  }
  for (const distal of result.distal) for (const [point, color] of distal.entries()) {
    assert.equal(color[3], 255, 'The retained primary tips remain opaque');
    for (let channel = 0; channel < 4; channel++) {
      assert.ok(Math.abs(color[channel] - result.originalDistal[point][channel]) <= 1, 'Shared distal feathers preserve the actual plate within blending rounding');
    }
  }
  assert.notDeepEqual(result.innerSurface[0], result.innerSurface[4], 'The pale ventral field remains distinct from the dorsal field');
  assert.ok(result.innerSurface.every(color => color[3] === 255), 'Surface blending does not make the inner wing translucent');
  assert.ok(result.disposed.every(([width, height]) => width === 1 && height === 1), 'Repeated disposal releases all owned backing stores');
  for (const failure of result.failures) {
    assert.ok(failure.error, `Missing context at allocation ${failure.at} reports failure`);
    assert.ok(failure.acquired >= failure.at, `Failure injection ${failure.at} reached its target`);
    assert.ok(failure.disposed, `Failure at allocation ${failure.at} releases all earlier and partially prepared buffers`);
  }
  console.log('Wing sections passed: connected tips, opaque white feathers, clean exterior, fifteen cropped buffers and every allocation-failure cleanup.');
} finally {
  await browser.close();
}
