import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { chromium } from 'playwright';

const modules = new Map();
const compile = name => ts.transpileModule(fs.readFileSync(`app/components/${name}.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
function load(name) {
  if (modules.has(name)) return modules.get(name);
  const module = { exports: {} };
  new Function('module', 'exports', 'require', compile(name))(module, module.exports, path => load(path.replace('./', '')));
  modules.set(name, module.exports);
  return module.exports;
}
const rig = load('arrivalFlightRig');
const { birdAnatomy } = load('arrivalRig');

// Sample occupied pixels from the real prepared outer fan. Empty corners of a
// rectangular mesh would falsely inflate the apparent feather area.
const browser = await chromium.launch({ headless: true, timeout: 10_000 });
let featherPoints;
try {
  const page = await browser.newPage();
  featherPoints = await page.evaluate(async ({ source, asset }) => {
    const module = { exports: {} };
    new Function('module', 'exports', source)(module, module.exports);
    const image = new Image();
    image.src = asset;
    await image.decode();
    const textures = module.exports.createSectionedWingTextures(image);
    try {
      const outer = textures.sections.at(-1);
      const canvas = outer.blends[0];
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      const points = [];
      for (let y = 0; y < canvas.height; y += 12) for (let x = 0; x < canvas.width; x += 12) {
        if (pixels[(y * canvas.width + x) * 4 + 3] > 240) points.push({ x: x + outer.x, y });
      }
      return points;
    } finally {
      textures.dispose();
    }
  }, {
    source: compile('arrivalWingSections'),
    asset: 'data:image/webp;base64,' + fs.readFileSync('public/assets/grebes/arrival/flight-wings-v3.webp').toString('base64'),
  });
} finally {
  await browser.close();
}
assert.ok(featherPoints.length > 500, 'The measurements include the actual broad feather field and primary tips');

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));
const cross = (origin, a, b) => (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
function convexHull(points) {
  const sorted = points.slice().sort((a, b) => a.x - b.x || a.y - b.y);
  const lower = [], upper = [];
  for (const point of sorted) {
    while (lower.length > 1 && cross(lower.at(-2), lower.at(-1), point) <= 0) lower.pop();
    lower.push(point);
  }
  for (const point of sorted.reverse()) {
    while (upper.length > 1 && cross(upper.at(-2), upper.at(-1), point) <= 0) upper.pop();
    upper.push(point);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
function projectedVolume(points) {
  const hull = convexHull(points);
  let twiceArea = 0, diameterSquared = 0;
  for (const [index, point] of hull.entries()) {
    const next = hull[(index + 1) % hull.length];
    twiceArea += point.x * next.y - next.x * point.y;
    for (const other of hull) diameterSquared = Math.max(diameterSquared, (point.x - other.x) ** 2 + (point.y - other.y) ** 2);
  }
  const mean = points.reduce((sum, point) => ({ x: sum.x + point.x / points.length, y: sum.y + point.y / points.length }), { x: 0, y: 0 });
  let xx = 0, yy = 0, xy = 0;
  for (const point of points) {
    const x = point.x - mean.x, y = point.y - mean.y;
    xx += x * x; yy += y * y; xy += x * y;
  }
  // Measure thickness across the fan's principal direction, not screen axes.
  // A diagonally oriented needle can have a deceptively large bounding box.
  const angle = Math.atan2(2 * xy, xx - yy) / 2;
  const axis = { x: Math.cos(angle), y: Math.sin(angle) };
  let alongMin = Infinity, alongMax = -Infinity, acrossMin = Infinity, acrossMax = -Infinity;
  for (const point of points) {
    const along = point.x * axis.x + point.y * axis.y;
    const across = -point.x * axis.y + point.y * axis.x;
    alongMin = Math.min(alongMin, along); alongMax = Math.max(alongMax, along);
    acrossMin = Math.min(acrossMin, across); acrossMax = Math.max(acrossMax, across);
  }
  return { areaRatio: Math.abs(twiceArea) / 2 / diameterSquared, widthRatio: (acrossMax - acrossMin) / (alongMax - alongMin), diameter: Math.sqrt(diameterSquared) };
}

const profile = 'sectioned';
const deploymentEnd = Array.from({ length: 6001 }, (_, time) => time).find(time => rig.flightDeployment(time) >= 1);
assert.ok(Number.isFinite(deploymentEnd), 'The wing reaches full deployment');
const stateAt = time => birdAnatomy(time, { awake: 1, wings: 1, flight: 1 });
const pitch = time => rig.flightWingFrame(stateAt(time), true, profile).flap;
// Discover successive complete strokes from the actual motion. The test does
// not assert a fixed frequency or depend on a particular recovery timestamp.
const peaks = [];
for (let time = deploymentEnd + 1; time < deploymentEnd + 2500 && peaks.length < 4; time++) {
  if (pitch(time) > pitch(time - 1) && pitch(time) >= pitch(time + 1)) peaks.push(time);
}
assert.equal(peaks.length, 4, 'The measurement spans three complete wingbeats');
let minimumArea = { value: Infinity }, minimumWidth = { value: Infinity };
let maximumReachRatio = 0;
for (let time = peaks[0]; time <= peaks.at(-1); time += 5) for (const near of [true, false]) {
  const state = stateAt(time);
  const frame = rig.flightWingFrame(state, near, profile);
  const attachment = rig.flightBodyPoint(frame.attachment, state);
  const root = rig.flightWingPoint({ x: 120, y: 150 }, state, near, profile);
  assert.ok(distance(root, attachment) < 1e-8, 'Feather curvature must not pull the wing root off the body');
  const reference = rig.flightWingFrame(stateAt(peaks[0]), near, profile);
  for (let bone = 0; bone < 3; bone++) {
    const length = distance(frame.joints[bone], frame.joints[bone + 1]);
    assert.ok(Math.abs(length / distance(reference.joints[bone], reference.joints[bone + 1]) - 1) < 1e-8, 'The recovery changes articulation without growing the underlying bones');
  }
  const points = featherPoints.map(point => rig.flightWingPoint(point, state, near, profile));
  assert.ok(points.every(point => Number.isFinite(point.x) && Number.isFinite(point.y)), 'Every occupied feather point remains finite');
  const volume = projectedVolume(points);
  if (volume.areaRatio < minimumArea.value) minimumArea = { value: volume.areaRatio, time, near };
  if (volume.widthRatio < minimumWidth.value) minimumWidth = { value: volume.widthRatio, time, near };
  // These are broad visual guards, not ornithological measurements. A thin
  // diagonal plate fails them even when its screen-aligned box looks large.
  assert.ok(volume.areaRatio >= .04, `The ${near ? 'near' : 'far'} outer fan degenerates toward a needle at ${time}ms: normalized area ${volume.areaRatio}`);
  assert.ok(volume.widthRatio >= .08, `The ${near ? 'near' : 'far'} outer fan loses transverse width at ${time}ms: ${volume.widthRatio}`);
  const span = frame.lengths.reduce((sum, value) => sum + value, 0);
  maximumReachRatio = Math.max(maximumReachRatio, ...points.map(point => distance(root, point) / span));
  assert.ok(points.every(point => distance(root, point) <= span * 1.45), 'The curved feather field stays within a reasonable extent of its fixed skeleton');
  // Probe adjacent real states at a fraction of a millisecond. Relative wing
  // motion excludes the body's bob, and scales the tolerance by its own size.
  const h = .01;
  for (const point of featherPoints.filter((_, index) => index % 75 === 0)) {
    const before = rig.flightWingPoint(point, stateAt(time - h), near, profile);
    const current = rig.flightWingPoint(point, state, near, profile);
    const after = rig.flightWingPoint(point, stateAt(time + h), near, profile);
    assert.ok(distance(before, after) < span * .005, 'Feathers remain position-continuous through recovery');
    const velocityChange = Math.hypot((after.x - current.x) - (current.x - before.x), (after.y - current.y) - (current.y - before.y)) / h;
    assert.ok(velocityChange < span * .001, 'Feather velocity does not jump between adjacent recovery frames');
  }
}
console.log(`Flight feather volume passed: ${featherPoints.length} real-art points, three full strokes, minimum normalized area ${minimumArea.value.toFixed(4)}, width ${minimumWidth.value.toFixed(4)}, maximum reach/skeleton ${maximumReachRatio.toFixed(3)}.`);
