import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const timelineModule = { exports: {} };
new Function('require', 'module', 'exports', ts.transpileModule(fs.readFileSync('app/components/arrivalTimeline.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText)(require, timelineModule, timelineModule.exports);
const { ARRIVAL_BEATS: B } = timelineModule.exports;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import('react-dom/client');

// Exercise the actual wrapper, controller, shared context and visitor scheduler.
// Canvas actors are rendering leaves here. The real pose, target measurement and
// handoff props remain under test; mesh/art/Canvas rendering has its own checks.
async function harness(options = {}) {
  const dom = new JSDOM('<div id="root"></div><button id="previous-focus">Previous focus</button>', {
    url: options.url ?? 'https://econoben.dev/', pretendToBeVisual: true,
  });
  const saved = {};
  for (const key of ['window', 'document', 'HTMLElement', 'SVGElement', 'DOMPoint', 'Image', 'Path2D', 'setTimeout', 'clearTimeout']) saved[key] = globalThis[key];
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, SVGElement: dom.window.SVGElement });
  let now = 0, nextId = 0, reduced = !!options.reduced, hidden = false, opening, visitorStarts = 0, removeArrival;
  const frames = new Map(), timers = new Map(), images = [], motionListeners = new Set(), ownedListeners = new Set();
  const actorWork = { preparations: 0, draws: 0, wingFactories: [] };
  let selectedWing;
  if(options.realActor)globalThis.Path2D=class {};
  if (options.realActor) window.HTMLCanvasElement.prototype.getContext = () => ({
    setTransform() {}, clearRect() {}, save() {}, restore() {}, beginPath() {}, rect() {}, clip() {}, drawImage() {}, translate(){},scale(){},fillRect(){},createRadialGradient(){return {addColorStop(){}};},
  });
  const scrollCalls = [];
  const focusCalls = [];
  const focus = window.HTMLElement.prototype.focus;
  window.HTMLElement.prototype.focus = function (options) {
    focusCalls.push({ element: this, options });
    return focus.call(this, options);
  };
  const trackedEvents = new Set(['visibilitychange', 'pagehide', 'popstate', 'hashchange', 'scroll', 'resize', 'keydown', 'pointermove', 'pointerleave']);
  for (const target of [window, document, document.documentElement]) {
    const add = target.addEventListener.bind(target), remove = target.removeEventListener.bind(target);
    target.addEventListener = (name, listener, opts) => { if (trackedEvents.has(name)) ownedListeners.add(listener); add(name, listener, opts); };
    target.removeEventListener = (name, listener, opts) => { ownedListeners.delete(listener); remove(name, listener, opts); };
  }
  Object.defineProperties(window, {
    scrollX: { value: options.scrollX ?? 0, writable: true },
    scrollY: { value: options.scrollY ?? 0, writable: true },
    innerWidth: { value: options.width ?? 1200, writable: true },
    innerHeight: { value: options.height ?? 800, writable: true },
  });
  Object.defineProperty(document, 'hidden', { get: () => hidden });
  Object.defineProperty(document.documentElement, 'clientWidth', { get: () => window.innerWidth - 16 });
  const sceneRect = () => {
    const desktop = window.innerWidth > 1100;
    const width = options.pondWidth ?? (desktop ? 480 : Math.min(480, Math.max(280, window.innerWidth - 40)));
    return new window.DOMRect(options.pondLeft ?? window.innerWidth - width - 20, (options.pondTop ?? (desktop ? 180 : 700)) - window.scrollY, width, width * 440 / 800);
  };
  // Match the visible label rather than the much larger enclosing pond button.
  const invitationRect = () => {
    const box = sceneRect(), width = 116.34375, height = 36;
    if (window.innerHeight <= 600 && window.innerWidth >= window.innerHeight) {
      return new window.DOMRect(box.right - box.width * .07 - width, box.bottom - box.height * .4 - height, width, height);
    }
    return new window.DOMRect(box.left + (box.width - width) / 2, box.bottom - box.height * .06 - height, width, height);
  };
  const originalHtmlBox = window.HTMLElement.prototype.getBoundingClientRect;
  window.HTMLElement.prototype.getBoundingClientRect = function () {
    if (this.matches('.field-topbar')) return new window.DOMRect(0, 0, window.innerWidth, options.headerHeight ?? 72);
    return this.matches('.field-pond-invitation') ? invitationRect() : originalHtmlBox.call(this);
  };
  const originalBox = window.SVGElement.prototype.getBoundingClientRect;
  window.SVGElement.prototype.getBoundingClientRect = function () {
    return this.matches('.study-scene-art') ? sceneRect() : originalBox.call(this);
  };
  const residentMatrix = () => {
    const box = sceneRect(), outer = box.width / 800, scale = outer * 268 / 1190;
    return { a: scale, b: 0, c: 0, d: scale,
      e: box.left + outer * 188 - 185.44029850746267 * scale,
      f: box.top + outer * (263 - 268 * 800 / 1190) - 50 * scale };
  };
  globalThis.DOMPoint = class {
    constructor(x, y) { this.x = x; this.y = y; }
    matrixTransform(m) { return { x: m.a * this.x + m.c * this.y + m.e, y: m.b * this.x + m.d * this.y + m.f }; }
  };
  window.SVGElement.prototype.getScreenCTM = function () {
    if (options.noMatrix) return null;
    if (this.matches('.arrival-resident-engraving')) {
      const matrix = residentMatrix();
      if (!this.closest('.study-reflection')) return matrix;
      const box = sceneRect();
      return { ...matrix, d: -matrix.d, f: box.top + 529 * box.width / 800 - (matrix.f - box.top) };
    }
    if (this.matches('.study-scene-art')) { const box = sceneRect(); return { a: box.width / 800, b: 0, c: 0, d: box.height / 440, e: box.left, f: box.top }; }
    return null;
  };
  const target = () => {
    const matrix = residentMatrix(), point = new DOMPoint(776, 850).matrixTransform(matrix);
    return { ...point, width: matrix.a * 1536 };
  };
  Object.defineProperty(window.performance, 'now', { value: () => now });
  window.performance.getEntriesByType = () => [{ type: 'navigate' }];
  window.scrollTo = (x, y) => {
    const left = typeof x === 'object' ? x.left ?? window.scrollX : x;
    const top = typeof x === 'object' ? x.top ?? window.scrollY : y;
    scrollCalls.push({ left, top, at: now }); window.scrollX = left; window.scrollY = top;
  };
  // JSDOM does not implement native inert. Mirror the attribute/property contract.
  Object.defineProperty(window.HTMLElement.prototype, 'inert', {
    get() { return this.hasAttribute('inert'); },
    set(value) { this.toggleAttribute('inert', !!value); },
  });
  window.requestAnimationFrame = callback => { frames.set(++nextId, callback); return nextId; };
  window.cancelAnimationFrame = id => frames.delete(id);
  globalThis.setTimeout = window.setTimeout = (callback, delay = 0) => {
    if (!delay) return saved.setTimeout(callback, 0);
    timers.set(++nextId, { callback, at: now + delay }); return nextId;
  };
  globalThis.clearTimeout = window.clearTimeout = id => { if (!timers.delete(id)) saved.clearTimeout(id); };
  window.matchMedia = () => ({
    get matches() { return reduced; },
    addEventListener: (_name, listener) => motionListeners.add(listener),
    removeEventListener: (_name, listener) => motionListeners.delete(listener),
  });
  class FakeImage {
    onload = null; onerror = null; complete = false; naturalWidth = 0;
    constructor() { images.push(this); }
    set src(value) { this.url = value; }
    decode() { return options.deferWingDecode && this.url===selectedWing ? new Promise(resolve=>{this.resolveDecode=resolve;}) : Promise.resolve(); }
    succeed() { this.complete = true; this.naturalWidth = 640; this.onload?.(); }
    fail() { this.onerror?.(); }
  }
  window.Image = FakeImage;
  globalThis.Image = FakeImage;
  const modules = new Map();
  function load(file) {
    const absolute = path.resolve(file);
    if (modules.has(absolute)) return modules.get(absolute).exports;
    const module = { exports: {} }; modules.set(absolute, module);
    const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    }).outputText;
    new Function('require', 'module', 'exports', code)(name => {
      if (name.endsWith('.css')) {
        const style = document.createElement('style');
        style.textContent = fs.readFileSync(path.resolve(path.dirname(absolute), name), 'utf8');
        document.head.appendChild(style);
        return {};
      }
      if (name === 'next/navigation') return { usePathname: () => window.location.pathname };
      if (name === './ArrivalBird') {
        const actual = load('app/components/ArrivalBird.tsx');
        if (options.realActor) return actual;
        return { ...actual, ArrivalBird: props => React.createElement('div', {
          className: `arrival-bird${props.reflection ? ' arrival-bird-reflection' : ''}`,
          'data-actor-props': JSON.stringify(props),
          style: { left: props.x, top: props.y, width: props.size, height: props.size * 2 / 3, opacity: props.opacity ?? 1 },
        }) };
      }
      if (options.realActor && name === './arrivalArtwork') return {
        createArrivalTextures() {
          actorWork.preparations++;
          const body = document.createElement('canvas'); body.width = 1536; body.height = 1024;
          return { body, compose: () => body, coverts: { canvas: body, x: 0, y: 0 }, dispose() {} };
        },
        createArrivalWing: () => document.createElement('canvas'),
      };
      if(options.realActor && name==='./arrivalFlightArtwork'){
        const actual=load('app/components/arrivalFlightArtwork.ts');
        return {...actual,createFlightWingTextures(){
          actorWork.wingFactories.push('legacy');
          if(options.characterFailure)throw new Error('Simulated unavailable wing surface');
          const blends=Array.from({length:5},()=>document.createElement('canvas'));
          return {blends,dispose(){for(const c of blends)c.width=c.height=1;}};
        }};
      }
      if(options.realActor && name==='./arrivalWingSections')return {
        SECTIONED_WING_ASSET:'/assets/grebes/arrival/flight-wings-v3.webp',
        createSectionedWingTextures(){
          actorWork.wingFactories.push('sectioned');
          if(options.characterFailure)throw new Error('Simulated unavailable sectioned wing surface');
          const sections=[{x:70,width:430},{x:360,width:670},{x:900,width:610}].map(section=>({...section,blends:Array.from({length:5},()=>{
            const canvas=document.createElement('canvas');canvas.width=section.width;canvas.height=512;return canvas;
          })}));
          return {sections,dispose(){for(const section of sections)for(const canvas of section.blends)canvas.width=canvas.height=1;}};
        },
      };
      if (options.realActor && name === './arrivalMesh') return {
        createMeshCoverage: () => null, makeGrid: () => ({}), drawTexturedMesh() { actorWork.draws++; },
      };
      if (name === './ArrivalPond') return { ArrivalPond: () => React.createElement('canvas', { 'data-art-fixture': true, 'aria-hidden': true }) };
      if (name === './ReadingGrebe') return { ReadingGrebe: () => React.createElement('span', { 'data-reader-fixture': true }) };
      if (name.startsWith('.')) {
        const base = path.resolve(path.dirname(absolute), name);
        for (const extension of ['', '.ts', '.tsx']) if (fs.existsSync(base + extension)) return load(base + extension);
      }
      return require(name);
    }, module, module.exports);
    return module.exports;
  }
  const context = load('app/components/GrebeArrivalContext.tsx');
  const arrival = load('app/components/GrebeArrival.tsx');
  const field = load('app/components/GrebeField.tsx');
  const hook = load('app/components/useGrebeArrival.ts');
  const scheduler = load('app/components/pondSchedule.ts');
  const { StudyScene } = load('app/pond-studies/StudyScene.tsx');
  const { ARRIVAL_ART } = load('app/components/ArrivalBird.tsx');
  selectedWing=load('app/components/arrivalWingSections.ts').SECTIONED_WING_ASSET;
  const book = load('app/book/bookData.ts');
  const startVisits = scheduler.startPondVisits;
  scheduler.startPondVisits = onChange => { visitorStarts += 1; return startVisits(onChange, options.pondRandom ?? Math.random); };
  if (options.seen) window.sessionStorage.setItem(hook.GREBE_ARRIVAL_SESSION_KEY, '1');
  document.documentElement.style.overflow = options.overflow ?? 'auto';
  document.documentElement.style.scrollBehavior = 'smooth';
  document.documentElement.style.paddingRight = '5px';
  function Probe() { opening = context.useGrebeArrivalContext().opening; return null; }
  function Site() {
    const [showArrival, setShowArrival] = React.useState(true);
    removeArrival = () => setShowArrival(false);
    return React.createElement(context.GrebeArrivalProvider, null,
      React.createElement(Probe),
      React.createElement('header', { className: 'field-topbar' }),
      React.createElement('div', { className: 'shell-home-page', inert: options.inert || undefined },
        React.createElement('a', { href: '/book', id: 'book-link' }, 'Read the book'),
        React.createElement(field.GrebeField, { variant: 'home' }),
        React.createElement('button', { className: 'field-pond-scene', type: 'button', 'aria-label': 'Find an article' },
          React.createElement(StudyScene, { direction: 'atlas-dusk', arrivalResident: true }),
          React.createElement('span', { className: 'field-pond-invitation' }, 'Find an article'),
        ),
        showArrival && React.createElement(arrival.GrebeArrival),
      ),
    );
  }
  const previousFocus = document.getElementById('previous-focus'); previousFocus.focus();
  const root = createRoot(document.getElementById('root'));
  await act(async () => root.render(React.createElement(React.StrictMode, null, React.createElement(Site))));
  const site = document.querySelector('.shell-home-page');
  return {
    dom, site, images, timers, frames, scrollCalls, focusCalls, previousFocus, target, invitationRect, sceneRect, art: ARRIVAL_ART, selectedWing, book, actorWork,
    get opening() { return opening; },
    get visitorStarts() { return visitorStarts; },
    swimmers: () => [...document.querySelectorAll('.pond-swimmer')],
    async finishImages() { await act(async () => images.forEach(image => image.succeed())); },
    async failImages() { await act(async () => images.forEach(image => image.fail())); },
    async frame(ms) { now += ms; const callbacks = [...frames.values()]; frames.clear(); await act(async () => callbacks.forEach(callback => callback(now))); },
    async advance(ms) {
      const end = now + ms;
      for (;;) { const next = [...timers].sort((a, b) => a[1].at - b[1].at)[0]; if (!next || next[1].at > end) break;
        now = next[1].at; timers.delete(next[0]); await act(async () => next[1].callback()); }
      now = end;
    },
    async visibility(value) { hidden = value; await act(async () => document.dispatchEvent(new window.Event('visibilitychange'))); },
    async motion(value) { reduced = value; await act(async () => motionListeners.forEach(listener => listener({ matches: value }))); },
    async key(key, shiftKey = false) {
      const event = new window.KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true });
      await act(async () => document.activeElement.dispatchEvent(event)); return event;
    },
    async click(button) {
      assert.ok(button, 'The requested control is present'); await act(async () => button.click());
    },
    async resize(width, height) { window.innerWidth = width; window.innerHeight = height; await act(async () => window.dispatchEvent(new window.Event('resize'))); },
    async navigateHash(hash, scrollY) {
      window.history.pushState({}, '', hash); window.scrollY = scrollY;
      await act(async () => window.dispatchEvent(new window.HashChangeEvent('hashchange')));
    },
    async unmount() { await act(async () => root.unmount()); },
    async removeArrival() { await act(async () => removeArrival()); },
    async close() {
      await act(async () => root.unmount());
      assert.equal(frames.size, 0, 'Unmount cancels animation frames');
      assert.equal(timers.size, 0, 'Unmount cancels artwork and visitor timers');
      assert.equal(motionListeners.size, 0, 'Unmount removes preference listeners');
      assert.equal(ownedListeners.size, 0, 'Unmount removes arrival and visitor lifecycle listeners');
      assert.ok(images.every(image => image.onload === null && image.onerror === null), 'Unmount detaches image callbacks');
      dom.window.close();
      for (const [key, value] of Object.entries(saved)) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; }
    },
  };
}

async function check(options, fn) {
  const h = await harness(options);
  try { await fn(h); } finally { await h.close(); }
}

const dialog = () => document.querySelector('[role="dialog"]');
const button = pattern => [...document.querySelectorAll('button')].find(node => pattern.test(node.getAttribute('aria-label') ?? node.textContent));
function assertPlaying(h) {
  const overlay = dialog();
  assert.ok(overlay, 'Playback exposes a dialog');
  assert.equal(overlay.getAttribute('aria-modal'), 'true');
  const label = overlay.getAttribute('aria-label') || document.getElementById(overlay.getAttribute('aria-labelledby'))?.textContent;
  assert.ok(label?.trim(), 'The dialog has an accessible name');
  assert.ok(document.body.contains(overlay) && !h.site.contains(overlay), 'The portal sits outside the inert page');
  assert.equal(h.site.inert, true, 'Playback makes the underlying page inert');
  assert.equal(document.documentElement.style.overflow, 'hidden', 'Playback locks page scrolling');
  assert.equal(h.opening, true, 'Playback retains the visitor hold');
  assert.equal(h.swimmers().length, 0);
  assert.equal(document.querySelector('.pond-peeker'), null);
  const skip = button(/skip/i);
  assert.ok(skip && overlay.contains(skip), 'Skip remains inside the active dialog');
  assert.equal(document.activeElement, skip, 'Playback moves focus to its visible exit');
}
function assertRestored(h, { overflow = 'auto', inert = false, reduced = false, swimmerCount = 1 } = {}) {
  assert.equal(dialog(), null, 'Closing removes the dialog');
  assert.equal(h.site.inert, inert, 'Closing restores the previous inert state');
  assert.equal(document.documentElement.style.overflow, overflow, 'Closing restores the previous scroll policy');
  assert.equal(document.documentElement.style.scrollBehavior, 'smooth', 'Closing restores the previous scroll behavior');
  assert.equal(document.documentElement.style.paddingRight, '5px', 'Closing removes its scrollbar compensation');
  assert.equal(document.documentElement.hasAttribute('data-grebe-arrival'), false, 'Closing removes the page handoff marker');
  assert.equal(h.site.style.getPropertyValue('--arrival-resident'), '', 'Closing removes its temporary resident opacity');
  assert.equal(h.opening, false, 'Closing releases the shared visitor hold');
  assert.equal(h.swimmers().length, reduced ? 0 : swimmerCount, 'Restored visitors follow the original schedule when motion is allowed');
}

await check({}, async h => {
  assert.ok(h.images.length > 0, 'Eligible autoplay prepares artwork');
  assert.deepEqual(new Set(h.images.map(image => image.url)), new Set([...Object.values(h.art),h.book.AGENT_MEMORY.coverSrc]), 'Preparation includes the exact character, landscape and publication cover assets');
  assert.ok(h.images.some(image=>image.url===h.selectedWing),'The preload barrier requests the actual selected wing factory asset, independently of the shared preload registry');
  assert.equal(h.art.wing,h.selectedWing,'The public art registry describes the selected renderer source');
  assert.equal(document.querySelector('.arrival-resident-engraving image').getAttribute('href'), h.art.body, 'The resident uses the same body master that the film prepares');
  assert.equal(h.opening, true, 'The initial provider hold covers artwork preparation');
  assert.equal(h.visitorStarts, 0, 'No intermediate mount effect starts a visitor before arrival eligibility is resolved');
  assert.equal(h.swimmers().length, 0);
  assert.equal(dialog(), null, 'Loading artwork does not block the readable page');
  assert.equal(h.site.inert, false);
  assert.equal(document.documentElement.style.overflow, 'auto');
  assert.equal(document.activeElement, h.previousFocus);
  await h.finishImages();
  assertPlaying(h);
  const landscape = document.querySelector('.arrival-landscape');
  assert.equal(Number(landscape.style.opacity || 1), 1, 'The landscape starts fully opaque');
  assert.equal(landscape.style.clipPath, '', 'The first landscape frame has no reveal cutout');
  assert.equal(window.getComputedStyle(landscape).backgroundColor, 'rgb(247, 242, 232)', 'Opaque paper covers the site before the Canvas paints');
  await h.frame(600);
  const hero = () => document.querySelector('.arrival-bird:not(.arrival-bird-reflection)');
  assert.ok(hero(), 'The opening includes a normal bird as well as its water reflection');
  const desktopSize = hero().style.width;
  await h.resize(390, 844);
  assert.notEqual(hero().style.width, desktopSize, 'The visible bird resizes with the viewport');
  assert.equal(Number.parseFloat(hero().style.left), 195, 'The opening remains centered after a narrow-screen resize');
  assert.equal(dialog().dataset.elapsed, '600', 'Resizing preserves the running timeline');
  for (const backwards of [false, true]) {
    const event = await h.key('Tab', backwards);
    assert.equal(event.defaultPrevented, true, 'The dialog contains forward and backward keyboard navigation');
    assert.equal(document.activeElement, button(/skip/i));
  }
  await h.key('Escape');
  assertRestored(h);
  assert.equal(document.activeElement, h.previousFocus, 'Escape restores the previous focus');
  await h.advance(4100);
  assert.equal(h.swimmers().length, 2, 'The usual opposite visitor returns on its existing schedule');
});

await check({deferWingDecode:true},async h=>{
  const wingImages=h.images.filter(image=>image.url===h.selectedWing);
  assert.ok(wingImages.length,'The selected wing is included before the opening starts');
  await act(async()=>h.images.filter(image=>image.url!==h.selectedWing).forEach(image=>image.succeed()));
  assert.equal(dialog(),null,'Other assets cannot start playback while the selected wing is missing');
  await act(async()=>wingImages.forEach(image=>image.succeed()));
  assert.ok(wingImages.some(image=>image.resolveDecode),'The actual selected-wing decode participates in readiness');
  assert.equal(dialog(),null,'A loaded selected wing does not start playback before decoding finishes');
  assert.equal(h.opening,true,'The shared visitor hold remains during the selected artwork decode');
  await act(async()=>wingImages.forEach(image=>image.resolveDecode?.()));
  assertPlaying(h);
  await h.key('Escape');assertRestored(h);
});

for(const pondRandom of [()=>0,()=>1])await check({pondRandom},async h=>{
  const wingImages=h.images.filter(image=>image.url===h.selectedWing);
  assert.ok(wingImages.length);
  await act(async()=>h.images.filter(image=>image.url!==h.selectedWing).forEach(image=>image.succeed()));
  await act(async()=>wingImages.forEach(image=>image.fail()));
  assertRestored(h);
  assert.equal(document.activeElement,h.previousFocus,'A missing selected wing leaves reading focus alone');
  const firstSwimmer=h.swimmers()[0],starts=h.visitorStarts;
  await h.finishImages();await h.advance(2600);
  // The opposite visitor starts between2 and4 seconds. Exercise both ends
  // using the real scheduler, instead of assuming that2.6 seconds has only one.
  const secondHasArrived=pondRandom()===0;
  assertRestored(h,{swimmerCount:secondHasArrived?2:1});
  assert.deepEqual(h.swimmers().map(node=>node.classList.contains('pond-swimmer--left')?'left':'right').sort(),secondHasArrived?['left','right']:['left']);
  assert.equal(h.swimmers()[0],firstSwimmer,'A late selected-wing callback preserves the running first visitor rather than restarting its DOM animation');
  assert.equal(h.visitorStarts,starts,'A late selected-wing callback does not restart the restored visitor scheduler');
  assert.equal(h.frames.size,0,'A late selected-wing load cannot restart a failed preparation');
  await h.advance(1500);
  assertRestored(h,{swimmerCount:2});
  assert.deepEqual(h.swimmers().map(node=>node.classList.contains('pond-swimmer--left')?'left':'right').sort(),['left','right'],'Both deterministic schedules eventually contain one visitor from each side');
  assert.equal(h.swimmers()[0],firstSwimmer);
  assert.equal(h.visitorStarts,starts);
});

await check({ realActor: true }, async h => {
  await h.finishImages();
  await h.finishImages();
  const main = document.querySelector('.arrival-bird:not(.arrival-bird-reflection) canvas');
  const reflected = document.querySelector('.arrival-bird-reflection canvas');
  const publication = document.querySelector('.arrival-book-feature');
  assert.ok(main && reflected);
  assert.equal(h.actorWork.preparations, 1, 'Playback prepares its one character only once');
  assert.deepEqual(h.actorWork.wingFactories,['sectioned'],'The actual public opening selects the sectioned factory without a test-only profile override');
  const initialImages = h.images.length;
  const current = () => document.querySelector('.arrival-bird:not(.arrival-bird-reflection) canvas');
  await h.frame(B.launchEnd);
  assert.equal(current(), main, 'The existing character canvas remains mounted during the feather beat');
  assert.equal(main.parentElement.style.opacity, '0');
  const hiddenDraws = h.actorWork.draws;
  await h.frame(B.rippleEnd - B.launchEnd - 1);
  assert.equal(h.actorWork.draws, hiddenDraws, 'The hidden character does no rendering during feather and ripple beats');
  await h.frame(1);
  assert.equal(current(), main, 'The crossing reuses the existing character canvas');
  assert.equal(main.parentElement.style.opacity, '1');
  assert.equal(main.closest('.arrival-hero-air'), null, 'The crossing removes only the waterline clip');
  assert.equal(document.querySelector('.arrival-bird-reflection canvas'), reflected, 'The inactive reflection retains its original owned node');
  await h.frame(B.firstPassEnd - B.firstPassStart);
  assert.equal(current(), main, 'The first departure retains the character for the second pass');
  assert.equal(main.parentElement.style.opacity, '0', 'The first bird is hidden only after it leaves the viewport');
  await h.frame(B.bookSettled-B.firstPassEnd);
  assert.equal(document.querySelector('.arrival-book-feature'),publication,'The publication keeps its original element while settling');
  assert.equal(publication.style.opacity,'1');
  const pausedDraws=h.actorWork.draws;
  await h.frame(B.secondPassStart-B.bookSettled-1);
  assert.equal(h.actorWork.draws,pausedDraws,'The reading pause does no hidden character rendering');
  await h.frame(1);
  assert.equal(current(),main,'The second left-to-right traversal uses the same prepared canvas');
  assert.equal(main.parentElement.style.opacity,'1');
  assert.ok(main.parentElement.style.transform.includes('scaleX(1)'));
  assert.equal(document.querySelector('.arrival-book-feature'),publication,'The second pass collects the same publication element');
  await h.frame(B.secondPassEnd-B.secondPassStart);
  assert.equal(current(), main, 'Landing reuses the same canvas after changing direction and pose');
  assert.ok(main.parentElement.style.transform.includes('scaleX(-1)'));
  assert.equal(h.actorWork.preparations, 1, 'Both traversals and landing never prepare another texture set');
  assert.equal(h.images.length, initialImages, 'No images are loaded at the phase transitions');
  await h.frame(B.landEnd - B.secondPassEnd);
  assert.equal(current(), null, 'The canvas is removed at the exact resident handoff');
  assert.deepEqual([main.width, main.height, reflected.width, reflected.height], [1, 1, 1, 1], 'Handoff releases the retained drawing buffers');
});

await check({width:390,height:844},async h=>{
  await h.finishImages();
  await h.frame(B.bookSettled);
  assert.equal(dialog().dataset.phase,'book');
  const publication=document.querySelector('.arrival-book-feature');
  const pose=publication.getAttribute('style');
  const live=h.book.chapters.flatMap(part=>part.chapters).filter(chapter=>chapter.status==='live').length;
  assert.ok(publication.textContent.includes(h.book.AGENT_MEMORY.title));
  assert.ok(publication.textContent.includes(h.book.AGENT_MEMORY.author));
  assert.ok(publication.textContent.includes(h.book.AGENT_MEMORY.publisher));
  assert.ok(publication.textContent.includes(`${live} chapters available now.`));
  assert.equal(publication.querySelector('img').getAttribute('src'),h.book.AGENT_MEMORY.coverSrc);
  assert.equal(publication.querySelectorAll('a,button,[tabindex]').length,0,'There are no disappearing book controls');
  assert.equal(document.querySelector('.arrival-landscape').style.clipPath,'','The book rests against the intact pond');
  await h.frame(1500);
  assert.equal(publication.getAttribute('style'),pose,'The reading pause leaves the publication completely stationary');
  await h.visibility(true);await h.frame(60_000);
  assert.equal(publication.getAttribute('style'),pose,'Hidden time does not consume the publication hold');
  await h.visibility(false);await h.frame(B.secondPassStart-B.bookSettled-1500);
  assert.equal(dialog().dataset.phase,'collect');
  assert.equal(document.querySelector('.arrival-book-feature'),publication,'Collection retains the same book');
  await h.key('Escape');assertRestored(h);
});

await check({ seen: true, scrollX: 12, scrollY: 840, overflow: 'scroll' }, async h => {
  assertRestored(h, { overflow: 'scroll' });
  const replay = button(/replay/i); replay?.focus();
  await h.click(replay);
  assert.equal(h.opening, true, 'Replay holds roaming birds while artwork prepares');
  await h.finishImages();
  assertPlaying(h);
  await h.click(button(/skip/i));
  assertRestored(h, { overflow: 'scroll' });
  assert.equal(document.activeElement, button(/replay/i), 'Skip returns focus to replay even if its original DOM node was replaced');
  assert.equal(window.scrollX, 12);
  assert.equal(window.scrollY, 840, 'Skipping replay preserves the reader’s original scroll position');
});

for (const noMatrix of [false, true]) await check({ overflow: 'clip', scrollX: 3, scrollY: 100, noMatrix }, async h => {
  await h.finishImages();
  assertPlaying(h);
  await h.frame(B.waterContact);
  const contact = () => document.querySelector('.arrival-contact');
  assert.ok(contact(), 'Landing contact ripples begin at the shared water-contact beat');
  const desktopLeft = contact().style.left;
  await h.resize(390, 844);
  const destination = h.target();
  assert.notEqual(contact().style.left, desktopLeft, 'Landing contact follows a resized pond');
  assert.ok(Math.abs(Number.parseFloat(contact().style.left) - destination.x) < .5, 'The contact matches the resident’s horizontal water anchor');
  assert.ok(Math.abs(Number.parseFloat(contact().style.top) - destination.y) < .5, 'The contact matches the resident’s waterline after resize');
  assert.equal(dialog().dataset.elapsed, String(B.waterContact));

  await h.frame(B.landEnd - B.waterContact - .1);
  const returning = document.querySelector('.arrival-flight-layer .arrival-bird');
  assert.ok(returning, 'One returning actor remains until the atomic handoff');
  const props = JSON.parse(returning.dataset.actorProps);
  assert.ok(Math.hypot(props.x - destination.x, props.y - destination.y) < .05, 'The returning actor reaches the measured resident position');
  assert.ok(Math.abs(props.size - destination.width) < .05, `${noMatrix ? 'Bounding-box fallback' : 'SVG transform'} supplies the full body-master width`);
  assert.equal(props.facing, -1, 'The returning actor faces the same direction as the mirrored resident');
  assert.equal(props.flight, 0, 'The body reaches its upright pose before handoff');
  assert.ok(props.wings < .00001 && Math.abs(props.immersion - 850 / 1024) < .00001, 'Wings and immersion match the resting resident');
  assert.equal(props.opacity, 1, 'The returning body stays opaque through its final frame');
  assert.equal(h.site.style.getPropertyValue('--arrival-resident'), '0', 'The resident stays hidden while the actor owns its place');
  await h.frame(.1);
  assert.equal(document.querySelector('.arrival-flight-layer .arrival-bird'), null, 'The returning body is removed at the handoff beat');
  assert.equal(h.site.style.getPropertyValue('--arrival-resident'), '1', 'The resident appears in the same frame without a two-body dissolve');
  const landingScroll = window.scrollY;
  await h.frame(B.duration - B.landEnd);
  assertRestored(h, { overflow: 'clip' });
  assert.equal(document.activeElement, button(/find an article/i), 'Successful completion focuses the resident’s actual action');
  assert.equal(h.focusCalls.at(-1).options?.preventScroll, true, 'Completion focus cannot trigger another native camera movement');
  assert.equal(window.scrollX, 3);
  assert.equal(window.scrollY, landingScroll, 'Completion stays at the pond without scrolling back');
});

await check({ width: 320, height: 568, pondTop: 718.890625, pondWidth: 272, pondLeft: 24 }, async h => {
  await h.finishImages();
  const initial = h.target(), label = h.invitationRect(), scene = h.sceneRect();
  const previousBirdOnlyTravel = initial.y + 36 - window.innerHeight;
  assert.ok(Math.abs(label.top - previousBirdOnlyTravel - 547.5) < 1 && Math.abs(label.bottom - previousBirdOnlyTravel - 583.5) < 1, 'The fixture reproduces the observed partially hidden label at y547.5..583.5');
  const minimumTravel = label.bottom - (window.innerHeight - 18);
  await h.frame(B.rippleEnd - 220);
  assert.ok(h.invitationRect().bottom <= window.innerHeight - 18 + .01, 'The focused action label is fully visible with clearance after the covered camera move');
  assert.ok(h.target().y - h.target().width * 800 / 1536 >= 90, 'Fitting the label keeps the full resident body visible');
  assert.ok(Math.abs(window.scrollY - minimumTravel) < .01, 'The camera travels only far enough to fit the label');
  assert.ok(window.scrollY < scene.bottom - (window.innerHeight - 18), 'The larger pond button does not provoke extra camera travel');
  const landingScroll = window.scrollY;
  await h.frame(B.duration - (B.rippleEnd - 220));
  assertRestored(h);
  assert.equal(document.activeElement, button(/find an article/i));
  assert.equal(window.scrollY, landingScroll, 'Focusing the visible label requires no post-contact camera movement');
});

// Visible desktop and phone destinations must not provoke an arbitrary camera trip.
for (const options of [
  { width: 390, height: 844, pondTop: 640 },
  { width: 1440, height: 900, pondTop: 136, pondWidth: 574, pondLeft: 742 },
]) await check(options, async h => {
  await h.finishImages();
  const destination = h.target();
  if (options.width === 390) assert.ok(destination.y > window.innerHeight * .82, 'This fixture distinguishes viewport fit from the former percentage cutoff');
  assert.ok(destination.y - destination.width * 800 / 1536 >= 90 && destination.y + 18 <= window.innerHeight - 18);
  assert.ok(h.invitationRect().bottom <= window.innerHeight - 18);
  await h.frame(B.rippleEnd);
  assert.equal(h.scrollCalls.length, 0, 'The camera stays still when the full bird, focused label and deliberate clearance fit');
  await h.frame(B.duration - B.rippleEnd);
  assertRestored(h);
  assert.equal(h.scrollCalls.length, 0, 'Successful completion adds no unnecessary scroll restoration');
  assert.equal(document.activeElement, button(/find an article/i));
});

await check({ width: 844, height: 390, headerHeight: 114.9375, pondTop: 651.921875, pondWidth: 764 }, async h => {
  await h.finishImages();
  const initial = h.target(), top = initial.y - initial.width * 800 / 1536;
  assert.ok(h.invitationRect().bottom - top < window.innerHeight - 108, 'The landscape action sits beside the bird, so the destination fits together');
  await h.frame(B.rippleEnd - 220);
  assert.ok(h.target().y - h.target().width * 800 / 1536 >= 114, 'The landing bird clears the landscape phone header');
  assert.ok(h.target().y + 18 <= window.innerHeight - 18 + .01, 'The full bird remains inside the short viewport');
  assert.ok(h.invitationRect().bottom <= window.innerHeight - 18, 'The article action is fully visible in landscape');
  const landingScroll = window.scrollY;
  await h.frame(B.duration - (B.rippleEnd - 220));
  assert.equal(document.activeElement, button(/find an article/i));
  assert.equal(window.scrollY, landingScroll, 'Landscape completion needs no corrective scroll');
  assertRestored(h);
});

await check({ seen: true, scrollY: 1135, width: 844, height: 390, headerHeight: 114.9375, pondTop: 651.921875, pondWidth: 764 }, async h => {
  await act(async () => button(/replay opening/i).click());
  await h.finishImages();
  await h.frame(B.rippleEnd - 220);
  assert.ok(h.target().y - h.target().width * 800 / 1536 >= 132.9375 - .01, 'A replay from below the pond fits the crest beneath the actual header plus clearance');
  assert.ok(h.invitationRect().bottom <= window.innerHeight - 18, 'The action remains visible beside the landing grebe');
  await h.frame(B.duration - (B.rippleEnd - 220));
  assertRestored(h);
});

await check({ width: 390, height: 844, pondTop: 980 }, async h => {
  await h.finishImages();
  const initial = h.target();
  const minimumTravel = Math.max(initial.y + 18, h.invitationRect().bottom) - (window.innerHeight - 18);
  assert.ok(minimumTravel > 0);
  await h.frame(B.featherContact - 551);
  assert.equal(window.scrollY, 0, 'The camera waits for the covered interval');
  await h.frame(541);
  assert.ok(window.scrollY > 0 && window.scrollY < minimumTravel, 'Camera travel progresses gradually');
  assert.equal(document.querySelector('.arrival-landscape').style.clipPath, '', 'The full landscape covers the page while the camera moves');
  await h.frame(B.rippleEnd - 220 - (B.featherContact - 10));
  assert.ok(Math.abs(window.scrollY - minimumTravel) < .01, 'Camera travel is only the distance required to fit the bird, focused label and clearance');
  const landingScroll = window.scrollY;
  await h.frame(B.duration - (B.rippleEnd - 220));
  assertRestored(h);
  assert.equal(window.scrollY, landingScroll, 'Successful completion preserves the landing camera position');
  assert.ok(h.scrollCalls.every(call => call.at < B.rippleEnd), 'Normal camera movement finishes before the site reveal');
  assert.equal(document.activeElement, button(/find an article/i));
});

for (const exit of ['skip', 'Escape']) await check({ seen: true, width: 390, height: 844, pondTop: 980, scrollX: 8, scrollY: 80 }, async h => {
  const replay = button(/replay/i); replay.focus();
  await h.click(replay);
  const requestedImages = h.images.length;
  assert.equal(replay.getAttribute('aria-disabled'), 'true', 'Replay exposes its loading state without losing keyboard focus');
  await h.click(replay);
  assert.equal(h.images.length, requestedImages, 'Repeated clicks during preparation do not start another load');
  await h.finishImages();
  await h.frame(B.bookSettled + 500);
  assert.ok(window.scrollY > 80, 'This exit occurs after the opening has moved the camera');
  assert.equal(dialog().dataset.phase,'book','Skip and Escape remain immediate during the quiet book hold');
  if (exit === 'skip') await h.click(button(/skip/i)); else await h.key('Escape');
  assertRestored(h);
  assert.equal(window.scrollX, 8);
  assert.equal(window.scrollY, 80, `${exit} restores the original reading position after camera travel`);
  assert.equal(document.activeElement, replay, `${exit} restores the original replay control`);
});

await check({}, async h => {
  await h.finishImages();
  await h.frame(B.wakeEnd);
  await h.visibility(true);
  const before = dialog().dataset.elapsed;
  await h.frame(60_000);
  assert.equal(dialog().dataset.elapsed, before, 'A hidden document freezes the composed frame');
  await h.visibility(false);
  await h.frame(B.shakeEnd - B.wakeEnd);
  assert.equal(dialog().dataset.phase, 'launch', 'The composed film resumes from its visible elapsed time');
  await h.key('Escape');
  assertRestored(h);
});

await check({ seen: true }, async h => {
  const replay = button(/replay/i); replay.focus();
  await h.click(replay); await h.finishImages();
  assertPlaying(h);
  await h.navigateHash('#field-atlas', 1600);
  assertRestored(h);
  assert.equal(window.location.hash, '#field-atlas');
  assert.equal(window.scrollY, 1600, 'Navigation cancellation preserves the requested anchor position instead of restoring the pre-opening position');
  assert.notEqual(document.activeElement, replay, 'Navigation cancellation leaves destination focus under navigation control');
});

await check({ width: 390, height: 844 }, async h => {
  await h.finishImages();
  assertPlaying(h);
  await h.frame(B.secondPassEnd + 200);
  const beforeOrientation = window.scrollY;
  await h.resize(844, 390);
  if (dialog()) assert.ok(Math.abs(window.scrollY - beforeOrientation) < .5, 'Late orientation adjustment starts without an immediate camera jump');
  await h.frame(400);
  if (dialog()) {
    const destination = h.target();
    assert.ok(destination.y - destination.width * 800 / 1536 >= 89.5 && destination.y + 18 <= window.innerHeight - 17.5, 'Late orientation changes keep the full landing body and clearance visible');
    await h.key('Escape');
  }
  assertRestored(h); // A graceful early finish is also a valid resize fallback.
});

for(const [initial,next] of [[{width:844,height:390},{width:390,height:844}],[{width:390,height:844},{width:844,height:390}]]){
  await check(initial,async h=>{
    await h.finishImages();await h.frame(B.waterContact-400);
    const pose=()=>JSON.parse(document.querySelector('[data-actor-props]').dataset.actorProps);
    const before=pose().wings;
    await h.resize(next.width,next.height);
    if(dialog()){
      assert.ok(Math.abs(pose().wings-before)<1e-8,'A late orientation change cannot jump to a different wing-fold pose at the same elapsed time');
      await h.frame(100);
      assert.ok(pose().wings<=before+1e-8,'The final fold must not reopen during orientation retargeting');
      await h.frame(299);
      assert.ok(pose().wings<=before+1e-8,'Retargeting keeps the closing motion monotonic');
      await h.key('Escape');
    }
    assertRestored(h);
  });
}

await check({ inert: true, overflow: 'scroll' }, async h => {
  await h.finishImages();
  assertPlaying(h);
  await h.unmount();
  assert.equal(dialog(), null, 'Unmount removes the body portal');
  assert.equal(h.site.inert, true, 'Unmount preserves an inert state owned by another feature');
  assert.equal(document.documentElement.style.overflow, 'scroll');
  assert.equal(document.activeElement, h.previousFocus, 'Unmount restores still-connected previous focus');
});

await check({}, async h => {
  await h.finishImages();
  assertPlaying(h);
  await h.removeArrival();
  assertRestored(h);
  assert.equal(document.activeElement, h.previousFocus, 'Removing only the arrival returns control to the still-mounted site');
  assert.equal(h.frames.size, 0, 'Removing the arrival cancels its animation clock');
});

await check({}, async h => {
  await h.finishImages();
  assertPlaying(h);
  await h.motion(true);
  assertRestored(h, { reduced: true });
  assert.equal(document.activeElement, h.previousFocus);
});

for (const options of [{ reduced: true }, { seen: true }, { url: 'https://econoben.dev/#writing' }]) {
  await check(options, async h => {
    assertRestored(h, options);
    assert.equal(h.images.length, 0, 'Ineligible autoplay does not request artwork');
    assert.equal(document.activeElement, h.previousFocus, 'Ineligible autoplay leaves reading focus alone');
  });
}
for (const failure of ['failImages', 'timeout']) {
  await check({}, async h => {
    if (failure === 'timeout') await h.advance(2500); else await h.failImages();
    assertRestored(h);
    assert.equal(document.activeElement, h.previousFocus, 'Unavailable artwork never steals focus');
  });
}
console.log('Grebe arrival integration passed: canonical cover preloading, one character and publication across two passes, hidden book timing, immediate exits, responsive handoff, minimum covered camera travel, eligibility and cleanup.');

await check({realActor:true,characterFailure:true},async h=>{
  await h.finishImages();await h.finishImages();
  assertRestored(h);
  assert.equal(document.querySelector('.arrival-book-feature'),null,'A character preparation failure removes the transient publication');
  assert.equal(h.frames.size,0,'A failed drawing surface cancels the actual opening clock');
  assert.equal(document.activeElement,h.previousFocus,'The drawing fallback restores the reader’s focus');
});
