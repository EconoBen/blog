import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { chromium } from 'playwright';

const compile = name => ts.transpileModule(fs.readFileSync(`app/components/${name}.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const modules = new Map();
function load(name) {
  if (modules.has(name)) return modules.get(name);
  const module = { exports: {} };
  new Function('module', 'exports', 'require', compile(name))(module, module.exports, path => load(path.replace('./', '')));
  modules.set(name, module.exports);
  return module.exports;
}
const { arrivalPose } = load('arrivalChoreography');
const { ARRIVAL_BEATS: B } = load('arrivalTimeline');
const { birdAnatomy } = load('arrivalRig');
const { flightWingPoint } = load('arrivalFlightRig');

// Use the actual painted wing boundary and occupied interior. Measuring the
// oversized transparent character canvas gives no useful collision evidence.
const browser = await chromium.launch({ headless: true, timeout: 10_000 });
let sourcePoints;
try {
  const page = await browser.newPage();
  sourcePoints = await page.evaluate(async ({ source, asset }) => {
    const module = { exports: {} };
    new Function('module', 'exports', source)(module, module.exports);
    const image = new Image(); image.src = asset; await image.decode();
    const textures = module.exports.createSectionedWingTextures(image);
    const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 512;
    try {
      const ctx = canvas.getContext('2d');
      for (const section of [...textures.sections].reverse()) ctx.drawImage(section.blends[0], section.x, 0);
      const pixels = ctx.getImageData(0, 0, 1536, 512).data;
      const alpha = (x, y) => x >= 0 && x < 1536 && y >= 0 && y < 512 ? pixels[(y * 1536 + x) * 4 + 3] : 0;
      const points = [];
      for (let y = 0; y < 512; y += 3) for (let x = 0; x < 1536; x += 3) {
        if (alpha(x, y) <= 96) continue;
        const boundary = [[-3, 0], [3, 0], [0, -3], [0, 3]].some(([dx, dy]) => alpha(x + dx, y + dy) <= 96);
        if (boundary || (x % 18 === 0 && y % 18 === 0)) points.push({ x, y });
      }
      return points;
    } finally {
      textures.dispose(); canvas.width = canvas.height = 1;
    }
  }, { source: compile('arrivalWingSections'), asset: 'data:image/webp;base64,' + fs.readFileSync('public/assets/grebes/arrival/flight-wings-v3.webp').toString('base64') });
} finally {
  await browser.close();
}
assert.ok(sourcePoints.length > 1000, 'The clearance probe includes occupied feather edges and interior');

const TOP_PADDING = 12;
const BOOK_PADDING = 8;
const geometries = new Map();
function wingGeometry(time, actor) {
  const key = `${time}/${actor.wings}/${actor.flight}`;
  if (geometries.has(key)) return geometries.get(key);
  const state = birdAnatomy(time, { awake: 1, wings: actor.wings, flight: actor.flight });
  const points = [true, false].flatMap(near => sourcePoints.map(point => flightWingPoint(point, state, near, 'sectioned')));
  geometries.set(key, points);
  return points;
}
function project(points, actor) {
  const scale = actor.size / 1536;
  const angle = actor.rotate * Math.PI / 180;
  const c = Math.cos(angle), s = Math.sin(angle);
  return points.map(point => {
    // The source waterline anchor is the character's actual CSS transform
    // origin. Both tested passes face right; bank/landing are separate checks.
    const x = (point.x - 760) * scale, y = (point.y - 850) * scale;
    return { x: actor.x + x * c - y * s, y: actor.y + x * s + y * c };
  });
}
function reservationClearance(point, book) {
  const angle = -book.rotate * Math.PI / 180;
  const x = point.x - book.x, y = point.y - book.y;
  const localX = x * Math.cos(angle) - y * Math.sin(angle);
  const localY = x * Math.sin(angle) + y * Math.cos(angle);
  // Positive outside, negative inside the rotated reservation. Requiring an
  // 8px separation also keeps diagonal corners clear of the cover and text.
  return Math.max(Math.abs(localX) - book.width / 2, Math.abs(localY) - book.height / 2);
}
const viewports = [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 320, height: 568 }, { width: 844, height: 390 }, { width: 568, height: 320 }];
const reports = [];
const failures = [];
for (const view of viewports) {
  // This target has no effect on the hero or either flyby. Native resident,
  // control and book DOM measurements are deliberately outside this test.
  const target = { x: view.width / 2, y: view.height * .7, width: 160 };
  const name = `${view.width}x${view.height}`;
  const report = { viewport: name, heroTop: { value: Infinity }, passes: [] };
  for (let time = 3550; time <= 3800; time += 10) {
    const actor = arrivalPose(time, view, target).hero;
    const points = project(wingGeometry(time, actor), actor);
    const top = Math.min(...points.map(point => point.y));
    if (top < report.heroTop.value) report.heroTop = { value: top, time };
  }
  if (report.heroTop.value < TOP_PADDING) failures.push(`${name} hero at ${report.heroTop.time}ms has top ${report.heroTop.value.toFixed(1)}px; needs ${TOP_PADDING}px before departure`);
  for (const [label, start, end, property] of [
    ['first', B.firstPassStart, B.firstPassEnd, 'crossing'],
    ['second', B.secondPassStart, B.secondPassEnd, 'secondCrossing'],
  ]) {
    const pass = { label, interiorFrames: 0, top: { value: Infinity }, bottom: { value: Infinity }, book: { value: Infinity } };
    for (let time = start; time < end; time += 16) {
      const pose = arrivalPose(time, view, target);
      const actor = { ...pose[property], wings: 1, flight: 1 };
      const points = project(wingGeometry(time, actor), actor);
      const left = Math.min(...points.map(point => point.x)), right = Math.max(...points.map(point => point.x));
      // Entry and exit intentionally cross the horizontal viewport boundary.
      // A complete visible interior must still contain the entire wingstroke.
      if (left >= 0 && right <= view.width) {
        pass.interiorFrames++;
        const top = Math.min(...points.map(point => point.y));
        const bottom = view.height - Math.max(...points.map(point => point.y));
        if (top < pass.top.value) pass.top = { value: top, time };
        if (bottom < pass.bottom.value) pass.bottom = { value: bottom, time };
      }
      if (pose.book.opacity > 0) {
        for (const point of points) {
          if (point.x < 0 || point.x > view.width || point.y < 0 || point.y > view.height) continue;
          const clearance = reservationClearance(point, pose.book);
          if (clearance < pass.book.value) pass.book = { value: clearance, time, point };
        }
      }
    }
    if (pass.interiorFrames < 3) failures.push(`${name} ${label} pass has no meaningful fully visible interior`);
    if (pass.top.value < TOP_PADDING) failures.push(`${name} ${label} pass at ${pass.top.time}ms has top ${pass.top.value.toFixed(1)}px; needs ${TOP_PADDING}px`);
    if (pass.bottom.value < TOP_PADDING) failures.push(`${name} ${label} pass at ${pass.bottom.time}ms has bottom clearance ${pass.bottom.value.toFixed(1)}px; needs ${TOP_PADDING}px`);
    if (pass.book.value < BOOK_PADDING) failures.push(`${name} ${label} pass at ${pass.book.time}ms has book clearance ${pass.book.value.toFixed(1)}px; needs ${BOOK_PADDING}px`);
    report.passes.push(pass);
  }
  reports.push(report);
}
console.log(JSON.stringify({ sourcePoints: sourcePoints.length, topPadding: TOP_PADDING, bookPadding: BOOK_PADDING, reports }, null, 2));
assert.equal(failures.length, 0, `Occupied wing clearance failed:\n${failures.join('\n')}`);
console.log('Flight clearance passed: occupied sectioned wings clear the pre-departure top, both flyby interiors and the rotated publication reservation.');
