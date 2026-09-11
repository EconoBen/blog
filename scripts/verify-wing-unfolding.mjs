import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const compiled = name => ts.transpileModule(fs.readFileSync(`app/components/${name}.ts`, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const modules = new Map();
function load(name) {
  if (modules.has(name)) return modules.get(name);
  const module = { exports: {} };
  new Function('module', 'exports', 'require', compiled(name))(module, module.exports, path => load(path.replace('./', '')));
  modules.set(name, module.exports);
  return module.exports;
}
const rig = load('arrivalFlightRig'), { birdAnatomy } = load('arrivalRig');
const profile = 'sectioned';
const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: (a.z ?? 0) - (b.z ?? 0) });
const length = p => Math.hypot(p.x, p.y, p.z ?? 0);
const bone = (frame, i) => subtract(frame.joints[i + 1], frame.joints[i]);
const angle = (a, b) => Math.acos(Math.max(-1, Math.min(1, (a.x * b.x + a.y * b.y + a.z * b.z) / (length(a) * length(b)))));
const failures = [];
async function check(name, run) {
  try { await run(); console.log(`PASS ${name}`); }
  catch (error) { failures.push({ name, message: error.message }); console.error(`FAIL ${name}: ${error.message}`); }
}

await check('Early unfolding moves the shoulder instead of compounding a delayed deployment curve', () => {
  // Discover the evaluator's interval rather than fixing the test to one duration.
  const times = Array.from({ length: 5001 }, (_, i) => i);
  const start = times.find(t => rig.flightDeployment(t) > 0) - 1;
  const end = times.find(t => rig.flightDeployment(t) >= 1);
  assert.ok(Number.isFinite(start) && end > start);
  for (const near of [true, false]) {
    const at = progress => {
      const time = start + (end - start) * progress;
      return rig.flightWingFrame(birdAnatomy(time, { awake: 1, wings: rig.flightDeployment(time), flight: 0 }), near, profile);
    };
    const resting = at(0), quarter = at(.25), opened = at(1);
    const fullRotation = angle(bone(resting, 0), bone(opened, 0));
    assert.ok(fullRotation > .2, 'The shoulder actually unfolds');
    const earlyFraction = angle(bone(resting, 0), bone(quarter, 0)) / fullRotation;
    // This broad guard catches the rejected ~4% early motion. It is not an
    // anatomical measurement or a claim that the resulting silhouette is natural.
    assert.ok(earlyFraction >= .1, `By the first quarter, the ${near ? 'near' : 'far'} shoulder must make visible progress; observed ${(earlyFraction * 100).toFixed(2)}%`);
    const referenceLengths = [0, 1, 2].map(i => length(bone(opened, i)));
    for (let step = 0; step <= 100; step++) {
      const frame = at(step / 100);
      for (let i = 0; i < 3; i++) assert.ok(Math.abs(length(bone(frame, i)) / referenceLengths[i] - 1) < 1e-8, 'Measured segment lengths remain fixed through unfolding');
    }
    assert.ok(Math.abs(angle(bone(resting, 0), bone(resting, 1)) - angle(bone(opened, 0), bone(opened, 1))) > .1, 'The elbow changes its bend rather than rotating a rigid panel');
  }
});

await check('Completed deployment settles surface pitch without a velocity kink', () => {
  const end = Array.from({ length: 5001 }, (_, i) => i).find(time => rig.flightDeployment(time) >= 1);
  assert.ok(Number.isFinite(end));
  for (const near of [true, false]) {
    const at = time => {
      const state = birdAnatomy(time, { awake: 1, wings: rig.flightDeployment(time), flight: 0 });
      return subtract(rig.flightWingPoint({ x: 1450, y: 260 }, state, near, profile), rig.flightWingPoint({ x: 120, y: 150 }, state, near, profile));
    };
    const error = h => {
      const a = at(end - h), b = at(end), c = at(end + h);
      return length(subtract(subtract(b, a), subtract(c, b))) / h;
    };
    const coarse = error(.1), fine = error(.01);
    // A clamped-velocity seam persists as h shrinks; smooth pitch converges.
    assert.ok(fine < coarse * .1 + 1e-8, 'Wingtip velocity must converge instead of retaining a nonzero endpoint jump');
  }
});

await check('Native painted-wing replacement retains early paint and transfers it continuously', async () => {
  const source = Object.fromEntries(['arrivalTimeline', 'arrivalRig', 'arrivalFlightRig', 'arrivalArtwork'].map(name => [name, compiled(name)]));
  const assets = ['engraving-plate-v2', 'anatomy-detail-v2', 'anatomy-flank-v3'].map(name => 'data:image/webp;base64,' + fs.readFileSync(`public/assets/grebes/arrival/${name}.webp`).toString('base64'));
  const browser = await chromium.launch({ headless: true });
  let result;
  try {
    const page = await browser.newPage();
    result = await page.evaluate(async ({ source, assets }) => {
      const modules = {};
      const load = name => {
        if (modules[name]) return modules[name];
        const module = { exports: {} };
        new Function('module', 'exports', 'require', source[name])(module, module.exports, name => load(name.replace('./', '')));
        return modules[name] = module.exports;
      };
      const { createArrivalTextures } = load('arrivalArtwork');
      const { flightWingMaterial } = load('arrivalFlightRig');
      const { birdAnatomy } = load('arrivalRig');
      const images = await Promise.all(assets.map(src => new Promise((resolve, reject) => {
        const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src;
      })));
      const textures = createArrivalTextures(...images);
      const points = [{ x: 600, y: 485 }, { x: 760, y: 570 }, { x: 520, y: 706 }];
      const pixels = canvas => points.map(p => Array.from(canvas.getContext('2d').getImageData(p.x, p.y, 1, 1).data));
      const base = pixels(textures.body);
      const raw = document.createElement('canvas'); raw.width = 1536; raw.height = 1024; raw.getContext('2d').drawImage(images[2], 0, 0);
      const exposed = pixels(raw);
      const samples = Array.from({ length: 121 }, (_, i) => i / 1000).map(wings => {
        const opacity = flightWingMaterial(birdAnatomy(3100, { awake: 1, wings, flight: 0 }));
        return { wings, opacity, pixels: pixels(textures.compose(1, wings, true, opacity)) };
      });
      const final = pixels(textures.compose(1, 1, true, flightWingMaterial(birdAnatomy(4000, { awake: 1, wings: 1, flight: 1 }))));
      const exactRest = textures.compose(1, 0, true, 0) === textures.body;
      textures.dispose(); raw.width = raw.height = 1;
      return { base, exposed, samples, final, exactRest };
    }, { source, assets });
  } finally { await browser.close(); }
  const contribution = pixels => {
    let numerator = 0, denominator = 0;
    for (let p = 0; p < pixels.length; p++) for (let channel = 0; channel < 3; channel++) {
      const difference = result.exposed[p][channel] - result.base[p][channel];
      numerator += (pixels[p][channel] - result.base[p][channel]) * difference;
      denominator += difference * difference;
    }
    assert.ok(denominator > 1000, 'The retained real-art samples distinguish folded feathers from flank paint');
    return numerator / denominator;
  };
  const measured = result.samples.map(sample => contribution(sample.pixels));
  assert.ok(measured[6] < .1, 'The first moving-wing appearance must not erase the full resting wing before its replacement is visible');
  let previous = 0;
  for (const [i, sample] of result.samples.entries()) {
    assert.ok(sample.opacity >= 0 && sample.opacity <= 1);
    assert.ok(Math.abs(measured[i] - sample.opacity) < .025, 'Actual Canvas paint contribution follows the shared moving-wing opacity');
    assert.ok(measured[i] >= previous - .025 && measured[i] - previous < .08, 'Adjacent material samples cannot abruptly uncover the flank');
    assert.ok(sample.pixels.every(pixel => pixel[3] === 255), 'The transfer retains opaque body ink');
    previous = measured[i];
  }
  assert.deepEqual(result.final, result.exposed, 'Full deployment removes all duplicate closed-wing paint at the sampled flank regions');
  assert.ok(result.exactRest, 'The completed fold returns the exact resident texture');
});

await check('Native wing compositing applies partial opacity once, without dark triangle edges', async () => {
  const renderer = ts.transpileModule(fs.readFileSync('app/components/AnatomicalBird.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const browser = await chromium.launch({ headless: true });
  let results;
  try {
    const page = await browser.newPage();
    results = await page.evaluate(({ renderer, meshSource }) => {
      const meshModule = { exports: {} };
      new Function('module', 'exports', meshSource)(meshModule, meshModule.exports);
      const texture = (width, height, opaque = false) => {
        const c = document.createElement('canvas'); c.width = width; c.height = height;
        if (opaque) { const ctx = c.getContext('2d'); ctx.fillStyle = '#162820'; ctx.fillRect(0, 0, width, height); }
        return c;
      };
      return [.08, .5, 1].map(material => {
        const effects = [], layouts = [], cleanups = [], sources = [];
        let main;
        const jsx = (type, props) => {
          if (type === 'canvas') { const c = document.createElement('canvas'); c.className = props.className; props.ref.current = c; main = c; }
          return null;
        };
        const module = { exports: {} };
        const NativeImage = window.Image;
        window.Image = class { complete = true; naturalWidth = 1536; set src(_) {} };
        const body = texture(1536, 1024);
        new Function('require', 'module', 'exports', renderer)(name => {
          if (name === 'react') return { useRef: value => ({ current: value }), useState: () => [true, () => {}], useEffect: fn => effects.push(fn), useLayoutEffect: fn => layouts.push(fn) };
          if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
          if (name === './arrivalArtwork') return { createArrivalTextures: () => ({ body, compose: () => body, dispose() {} }) };
          if (name === './arrivalFlightArtwork') return { FLIGHT_WING_ASSET: 'legacy', createFlightWingTextures() { throw Error('Wrong factory'); } };
          if (name === './arrivalWingSections') return { SECTIONED_WING_ASSET: 'sections', createSectionedWingTextures: () => ({
            sections: [{ x: 70, width: 430 }, { x: 360, width: 670 }, { x: 900, width: 610 }].map(section => ({ ...section, blends: Array.from({ length: 5 }, () => { const c = texture(section.width, 512, true); sources.push(c); return c; }) })), dispose() {},
          }) };
          if (name === './arrivalMesh') return meshModule.exports;
          if (name === './arrivalRig') return { ARRIVAL_BODY_OUTLINE: '', birdAnatomy: () => ({}) };
          if (name === './arrivalTimeline') return { ARRIVAL_BEATS: { launchEnd: 5300, waterContact: 16400 } };
          if (name === './arrivalFlightRig') return { flightBodyPoint: p => p, flightWingFrame: () => ({ underside: 0 }), flightWingMaterial: () => material, flightWingPoint: (p, _, near) => ({ x: p.x + (near ? 0 : -4000), y: p.y }) };
          throw Error(name);
        }, module, module.exports);
        // Real Canvas and real triangle rasterization; only React scheduling and
        // artwork/pose inputs are controlled so the native alpha seam is isolated.
        module.exports.AnatomicalBird({ elapsedMs: 3200, size: 400, x: 0, y: 0, wings: .06, wingProfile: 'sectioned', onError: () => { throw Error('Unexpected rendering failure'); } });
        // The shoulder samples an image. Its transparent test input leaves the
        // far-off body and wing sample region unobscured.
        const originalDraw = CanvasRenderingContext2D.prototype.drawImage;
        CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) { if (image instanceof window.Image) return; return originalDraw.call(this, image, ...args); };
        try {
          for (const fn of [...effects, ...layouts]) { const cleanup = fn(); if (cleanup) cleanups.push(cleanup); }
          const s = 400 / 1536, left = Math.ceil((1536 * .575 + 150) * s), top = Math.ceil((1536 * .7 + 70) * s);
          const width = Math.floor(1100 * s), height = Math.floor(360 * s);
          const pixels = main.getContext('2d').getImageData(left, top, width, height).data;
          const alpha = Array.from({ length: width * height }, (_, i) => pixels[i * 4 + 3]);
          return { material, min: Math.min(...alpha), max: Math.max(...alpha), expected: Math.round(material * 255), pixels: alpha.length };
        } finally {
          for (const cleanup of cleanups.reverse()) cleanup();
          CanvasRenderingContext2D.prototype.drawImage = originalDraw; window.Image = NativeImage;
          for (const c of [body, ...sources]) c.width = c.height = 1;
        }
      });
    }, { renderer, meshSource: compiled('arrivalMesh') });
  } finally { await browser.close(); }
  for (const sample of results) {
    assert.ok(sample.pixels > 20_000);
    // Native antialiasing can leave a two-byte deficit at a shared edge even
    // with opaque paint; accumulated-opacity facets are far above this bound.
    assert.ok(sample.min >= sample.expected - 2 && sample.max <= sample.expected + 1,
      `At opacity ${sample.material}, opaque wing interiors and overlapping feather groups must have uniform alpha ${sample.expected}; observed ${sample.min}..${sample.max}`);
  }
  if (process.env.WING_UNFOLDING_EVIDENCE) fs.writeFileSync(process.env.WING_UNFOLDING_EVIDENCE, JSON.stringify({
    node: process.version, description: 'Actual AnatomicalBird and triangle rasterizer in native Chromium Canvas, with controlled opaque wing textures and isolated pose inputs. This measures opacity seams, not artwork quality.', samples: results,
  }, null, 2) + '\n');
});

await check('The actual renderer applies the same replacement opacity to complete wings and body paint', async () => {
  const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true });
  const saved = Object.fromEntries(['window', 'document', 'Image', 'Path2D', 'IS_REACT_ACT_ENVIRONMENT'].map(key => [key, globalThis[key]]));
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
  globalThis.Path2D = class {};
  globalThis.Image = class {
    complete = false; naturalWidth = 0; onload = null;
    set src(_) { this.complete = true; this.naturalWidth = 1536; this.onload?.(); }
  };
  const calls = [], shoulderCalls = [], composites = [], compositions = [], wingCanvases = new Set(), bodyCanvases = new Set();
  window.HTMLCanvasElement.prototype.getContext = function () {
    if (this.context) return this.context;
    const stack = [];
    return this.context = {
      globalAlpha: 1, setTransform() {}, clearRect() {}, translate() {}, scale() {}, beginPath() {}, rect() {}, clip() {}, fillRect() {},
      drawImage(image) { if (this.canvas.classList.contains('arrival-character')) composites.push({ image, alpha: this.globalAlpha }); }, canvas: this,
      save() { stack.push(this.globalAlpha); }, restore() { this.globalAlpha = stack.pop(); },
      createRadialGradient() { return { addColorStop() {} }; },
    };
  };
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('app/components/AnatomicalBird.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('require', 'module', 'exports', code)(name => {
    if (name === './arrivalArtwork') return { createArrivalTextures() {
      const body = document.createElement('canvas');
      bodyCanvases.add(body);
      return { body, compose(...args) { compositions.push(args); return body; }, dispose() {} };
    } };
    if (name === './arrivalFlightArtwork') return { FLIGHT_WING_ASSET: '/test-wings.webp', createFlightWingTextures() {
      const blends = Array.from({ length: 5 }, () => { const canvas = document.createElement('canvas'); wingCanvases.add(canvas); return canvas; });
      return { blends, dispose() {} };
    } };
    if (name === './arrivalWingSections') return { SECTIONED_WING_ASSET: '/assets/grebes/arrival/flight-wings-v3.webp', createSectionedWingTextures() {
      const sections = [{ x: 70, width: 430 }, { x: 360, width: 670 }, { x: 900, width: 610 }].map(section => ({
        ...section, blends: Array.from({ length: 5 }, () => {
          const canvas = document.createElement('canvas'); canvas.width = section.width; canvas.height = 512; wingCanvases.add(canvas); return canvas;
        }),
      }));
      return { sections, dispose() { for (const section of sections) for (const canvas of section.blends) canvas.width = canvas.height = 1; } };
    } };
    if (name === './arrivalMesh') return { createMeshCoverage: () => null, makeGrid: () => ({}), drawTexturedMesh(ctx, canvas) {
      if (wingCanvases.has(canvas)) calls.push(ctx.globalAlpha);
      else if (!bodyCanvases.has(canvas)) shoulderCalls.push(ctx.globalAlpha);
    } };
    if (name.startsWith('./')) return load(name.slice(2));
    return require(name);
  }, module, module.exports);
  const { createRoot } = await import('react-dom/client');
  const root = createRoot(document.getElementById('root'));
  try {
    for (const wings of [.006, .03, .06, .12, 1]) {
      const time = 3200;
      const expected = rig.flightWingMaterial(birdAnatomy(time, { awake: 1, wings, flight: 0 }));
      calls.length = 0;
      shoulderCalls.length = 0;
      composites.length = 0;
      await act(() => root.render(React.createElement(module.exports.AnatomicalBird, { elapsedMs: time, size: 400, x: 400, y: 400, awake: 1, wings, flight: 0, wingProfile: profile })));
      assert.ok(calls.length >= 6, 'All three sections of both wings participate in the transition');
      assert.deepEqual(calls.slice(-6), Array(6).fill(1), 'Feather triangles render fully opaque before the completed layer is faded');
      assert.ok(shoulderCalls.length > 0, 'The real feathered shoulder patch participates in rendering');
      assert.equal(shoulderCalls.at(-1), 1, 'The shoulder joins the completed near-wing layer without per-triangle fading');
      if (expected > 0 && expected < 1) {
        assert.equal(composites.length, 2, 'Each completed wing is copied once at its material opacity');
        assert.deepEqual(composites.map(call => call.alpha), [expected, expected]);
        assert.equal(composites[0].image, composites[1].image, 'Both wings reuse the same retained compositing surface');
      } else assert.equal(composites.length, 0, 'Fully opaque wings draw directly without a layer copy');
      assert.equal(compositions.at(-1)[3], expected, 'The body uses the same material coordinate as the replacement wings');
    }
  } finally {
    await act(() => root.unmount()); dom.window.close();
    for (const [key, value] of Object.entries(saved)) if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
  }
});

assert.equal(failures.length, 0, JSON.stringify(failures, null, 2));
console.log('Wing unfolding passed: early shoulder motion, stable articulated segments, real-pixel painted-wing transfer and renderer material agreement. Visual fullness and posed coverage still require the independent study review.');
