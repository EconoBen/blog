import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
function loader(overrides = {}) {
  const cache = new Map();
  function load(file) {
    const absolute = path.resolve(file);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const module = { exports: {} };
    cache.set(absolute, module);
    const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
    } }).outputText;
    const dependency = id => {
      if (Object.hasOwn(overrides, id)) return overrides[id];
      if (id.startsWith('.')) {
        const target = path.resolve(path.dirname(absolute), id);
        return load([target, `${target}.ts`, `${target}.tsx`].find(candidate => fs.existsSync(candidate)));
      }
      return require(id);
    };
    new Function('require', 'module', 'exports', code)(dependency, module, module.exports);
    return module.exports;
  }
  return load;
}

const load = loader();
const { ARRIVAL_BEATS: beats } = load('app/components/arrivalTimeline.ts');
assert.ok(beats, 'The environment must share the composition timing contract');
const { ArrivalSurface } = load('app/components/ArrivalSurface.tsx');
const surface = (time, overrides = {}) => renderToStaticMarkup(React.createElement(ArrivalSurface, {
  elapsedMs: time, x: 720, y: 567, size: 990, ...overrides,
}));
assert.doesNotMatch(surface(beats.wakeEnd - 1), /data-drop=/, 'The waking bird does not shed water early');
assert.match(surface(beats.wakeEnd + 230), /data-drop="shake"/, 'Shake droplets follow the shared wake boundary');
assert.doesNotMatch(surface(beats.liftStart - 1), /data-drop="launch"/, 'The pond does not launch droplets before lift');
assert.match(surface(beats.liftStart + 230), /data-drop="launch"/, 'Takeoff droplets follow the shared lift');
assert.equal(surface(beats.launchEnd), '', 'The foreground water layer retires before the feather sequence');
assert.ok(ArrivalSurface({ elapsedMs: beats.launchEnd - .1, x: 1, y: 1, size: 500 }).props.style.opacity < .00001,
  'The surface is transparent before it retires');
assert.equal(surface(beats.wakeEnd + 230), surface(beats.wakeEnd + 230), 'Frame rendering is deterministic');
for (const size of [0, -1, NaN, Infinity]) assert.equal(surface(0, { size }), '');
for (const time of [0, beats.wakeEnd, beats.shakeEnd, beats.liftStart, beats.liftClear, beats.launchEnd - 1]) {
  assert.doesNotMatch(surface(time), /NaN|Infinity/);
}

function waterEvents(node, events = []) {
  if (Array.isArray(node)) node.forEach(child => waterEvents(child, events));
  else if (React.isValidElement(node)) {
    if (node.props['data-drop'] || node.props['data-impact']) events.push(node);
    waterEvents(node.props.children, events);
  }
  return events;
}
for (const [kind, start, end] of [['shake', beats.wakeEnd, beats.liftStart], ['launch', beats.liftStart, beats.launchEnd]]) {
  const lastDrop = new Map(), impacts = new Set();
  for (let time = start; time < end; time += 10) {
    const frame = ArrivalSurface({ elapsedMs: time, x: 0, y: 0, size: 1000 });
    for (const event of waterEvents(frame)) {
      const position = event.props.transform.match(/translate\(([-.\d]+) ([-.\d]+)\)/).slice(1).map(Number);
      if (event.props['data-drop'] === kind) lastDrop.set(event.key, position);
      if (event.props['data-impact'] === kind && !impacts.has(event.key)) {
        const previous = lastDrop.get(event.key);
        assert.ok(previous, 'A water impact is preceded by its own visible falling drop');
        assert.ok(Math.hypot(previous[0] - position[0], previous[1] - position[1]) < 15,
          'The drop trajectory reaches the actual ripple origin without jumping');
        assert.equal(position[1], 0, 'Drops land on the shared waterline');
        impacts.add(event.key);
      }
    }
  }
  assert.ok(impacts.size >= 8, 'The rendered water sequence contains complete trajectories');
}

const saved = new Map(['document', 'window', 'Image', 'ResizeObserver'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
function pondHarness(width, height, deviceDpr, { nullContext = false, failedArt = false } = {}) {
  const hooks = [], effects = [], canvases = [];
  let index = 0, pending = [], rect = { width, height }, resize, art, ready = 0, disconnected = false;
  const gradient = { addColorStop() {} };
  const methods = new Set(['setTransform', 'clearRect', 'fillRect', 'drawImage', 'beginPath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'ellipse', 'fill', 'stroke', 'closePath', 'save', 'restore', 'scale', 'translate', 'rotate', 'rect', 'clip', 'setLineDash']);
  function canvas() {
    let w = 300, h = 150;
    const log = [];
    const context = new Proxy({ createLinearGradient: () => gradient, createRadialGradient: () => gradient }, {
      get: (object, key) => key in object ? object[key] : methods.has(key) ? (...args) => log.push([key, ...args]) : undefined,
    });
    const item = { peak: 0, log, getBoundingClientRect: () => rect, getContext: () => nullContext ? null : context };
    Object.defineProperties(item, {
      width: { get: () => w, set: value => { w = value; item.peak = Math.max(item.peak, w * h); } },
      height: { get: () => h, set: value => { h = value; item.peak = Math.max(item.peak, w * h); } },
    });
    canvases.push(item);
    return item;
  }
  const main = canvas();
  globalThis.document = { createElement: canvas };
  globalThis.window = { devicePixelRatio: deviceDpr, addEventListener() {}, removeEventListener() {} };
  globalThis.Image = class { constructor() { art = this; this.naturalWidth = failedArt ? 0 : 1691; this.naturalHeight = 930; } };
  globalThis.ResizeObserver = class { constructor(callback) { resize = callback; } observe() {} disconnect() { disconnected = true; } };
  const react = {
    useRef(value) { const position = index++; return hooks[position] ??= { current: value }; },
    useEffect(callback, deps) {
      const position = index++, previous = effects[position];
      if (!previous || deps.some((value, i) => !Object.is(value, previous.deps[i]))) {
        effects[position] = { deps, cleanup: previous?.cleanup };
        pending.push(() => { previous?.cleanup?.(); effects[position].cleanup = callback(); });
      }
    },
  };
  const { ArrivalPond } = loader({ react })('app/components/ArrivalPond.tsx');
  const onReady = () => ready++;
  const render = time => {
    index = 0; pending = [];
    const element = ArrivalPond({ elapsedMs: time, onReady });
    element.props.ref.current = main;
    pending.forEach(callback => callback());
  };
  render(0);
  return {
    main, canvases, render, get ready() { return ready; },
    finishArt() { (failedArt ? art.onerror : art.onload)(); },
    resize(w, h) { rect = { width: w, height: h }; resize(); },
    close() { effects.forEach(effect => effect?.cleanup?.()); },
    get disconnected() { return disconnected; },
  };
}

try {
  for (const [width, height, dpr] of [[1440, 900, 2], [3840, 2160, 2], [7680, 4320, 3], [390, 844, 3]]) {
    const pond = pondHarness(width, height, dpr);
    const replaced = pond.canvases[1];
    pond.finishArt();
    assert.ok(pond.canvases.every(canvas => canvas.peak <= 4_000_000), 'Every backing buffer stays below four million pixels');
    assert.equal(replaced.width * replaced.height, 1, 'The old landscape releases its pixels');
    assert.equal(pond.canvases.at(-1).width * pond.canvases.at(-1).height, 1, 'The temporary panorama releases its pixels');
    assert.deepEqual([pond.main.width, pond.main.height], [pond.canvases.at(-2).width, pond.canvases.at(-2).height], 'The visible surface and cached landscape share their density');
    if (width === 1440) assert.ok(pond.main.width / width > 1.7, 'Desktop engraving retains fine detail');
    if (width >= 3840) assert.ok(pond.main.width / width < 1, 'Large displays may render below DPR one');
    const buffers = pond.canvases.length;
    const frames = [];
    for (const time of [0, beats.wakeEnd, beats.liftStart + 230, beats.featherContact + 300, beats.featherContact + 300]) {
      pond.main.log.length = 0;
      pond.render(time - .1); pond.main.log.length = 0; pond.render(time);
      const geometry = pond.main.log.filter(([method]) => method !== 'drawImage');
      assert.ok(geometry.flat().filter(value => typeof value === 'number').every(Number.isFinite), 'All emitted drawing coordinates stay finite');
      frames.push(JSON.stringify(geometry));
    }
    assert.equal(frames[3], frames[4], 'Identical supplied times produce identical drawing commands');
    assert.notEqual(frames[0], frames[1], 'Environment motion advances with the supplied time');
    assert.equal(pond.canvases.length, buffers, 'Frame updates reuse the landscape');
    assert.equal(pond.ready, 1, 'Readiness is announced once');
    pond.resize(height, width);
    assert.ok(pond.canvases.every(canvas => canvas.peak <= 4_000_000), 'Orientation changes cannot allocate an oversized intermediate buffer');
    pond.resize(0, 0);
    assert.ok(pond.canvases.every(canvas => canvas.width * canvas.height === 1), 'Collapsed surfaces release all pixels');
    pond.close();
    assert.equal(pond.disconnected, true);
  }
  for (const options of [{ nullContext: true }, { failedArt: true }]) {
    const pond = pondHarness(390, 844, 2, options);
    if (!options.nullContext) pond.finishArt();
    assert.equal(pond.ready, 1, 'Missing drawing context or artwork cannot block the opening');
    pond.close();
  }
} finally {
  for (const [key, descriptor] of saved) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
}
console.log('Arrival pond passed: shared phase timing, deterministic water, finite geometry, bounded buffers, cache reuse and cleanup.');
