import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
function load(file, overrides = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => overrides[name] ?? require(name), module, module.exports);
  return module.exports;
}
const timeline = load('app/components/arrivalTimeline.ts');
const preparation = load('app/components/arrivalPreparationController.ts');
const { ARRIVAL_BEATS: B, ARRIVAL_DURATION_MS, getArrivalPhase } = timeline;
assert.equal(ARRIVAL_DURATION_MS, B.duration, 'The controller duration uses the shared final beat');
assert.ok(B.liftStart > B.shakeEnd && B.liftClear > B.liftStart && B.liftClear < B.launchEnd);
assert.equal(B.featherStart, B.launchEnd);
assert.equal(B.featherContact, B.featherEnd);
assert.ok(B.waterContact > B.secondPassEnd && B.waterContact < B.landEnd);
assert.equal(B.firstPassStart,B.rippleEnd);
for (const [start, end, phase] of [[0,B.wakeEnd,'wake'],[B.wakeEnd,B.shakeEnd,'shake'],[B.shakeEnd,B.launchEnd,'launch'],[B.launchEnd,B.featherEnd,'feather'],[B.featherEnd,B.rippleEnd,'ripple'],[B.rippleEnd,B.bookSettled,'introduce'],[B.bookSettled,B.secondPassStart,'book'],[B.secondPassStart,B.secondPassEnd,'collect'],[B.secondPassEnd,B.landEnd,'land'],[B.landEnd,B.duration,'settle']]) {
  assert.equal(getArrivalPhase(start), phase); assert.equal(getArrivalPhase(end - 1), phase);
}
assert.equal(getArrivalPhase(-1), 'wake'); assert.equal(getArrivalPhase(NaN), 'wake');
assert.equal(getArrivalPhase(B.duration), 'done'); assert.equal(getArrivalPhase(Infinity), 'done');

const serverMarker = load('app/components/ArrivalVisitMarker.tsx', { 'next/navigation': { usePathname: () => '/' } });
assert.equal(renderToStaticMarkup(React.createElement(serverMarker.default)), '', 'The persistent history marker has no server markup or browser dependency');
const serverHook = load('app/components/useGrebeArrival.ts', { './arrivalTimeline': timeline, './ArrivalVisitMarker': serverMarker, './arrivalPreparationController': preparation, 'next/navigation': { usePathname: () => '/' } });
function ServerProbe() {
  const { active, loading, elapsedMs, phase } = serverHook.useGrebeArrival({ assetUrls: ['/grebe.png'] });
  assert.deepEqual({ active, loading, elapsedMs, phase }, { active: false, loading: true, elapsedMs: 0, phase: 'done' });
  return React.createElement('span', null, 'Readable site');
}
assert.match(renderToStaticMarkup(React.createElement(ServerProbe)), /Readable site/, 'Server render must not create an overlay or access browser APIs');

const { createRoot } = await import('react-dom/client');
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
async function harness(options = {}) {
  const dom = new JSDOM('<div id="root"></div>', { url: options.url ?? 'https://econoben.dev/', pretendToBeVisual: true, runScripts: 'outside-only' });
  globalThis.window = dom.window; globalThis.document = dom.window.document;
  let now = 0, counter = 0, hidden = !!options.hidden, reduced = !!options.reduced, route = new URL(options.url ?? 'https://econoben.dev/').pathname, latest;
  const frames = new Map(), timers = new Map(), motionListeners = new Set(), images = [], ownedListeners = new Set(), openingStates = [];
  const listenerNames = new Set(['visibilitychange','pagehide','popstate','hashchange','scroll','keydown','click','focusin',preparation.ARRIVAL_PREPARATION_EVENT]);
  for (const target of [window, document]) {
    const add = target.addEventListener.bind(target), remove = target.removeEventListener.bind(target);
    target.addEventListener = (name, listener, opts) => { if (listenerNames.has(name)) ownedListeners.add(listener); add(name, listener, opts); };
    target.removeEventListener = (name, listener, opts) => { ownedListeners.delete(listener); remove(name, listener, opts); };
  }
  Object.defineProperty(window, 'scrollY', { value: options.scrollY ?? 0, writable: true });
  Object.defineProperty(document, 'hidden', { get: () => hidden });
  Object.defineProperty(window.performance, 'now', { value: () => now });
  window.performance.getEntriesByType = () => [{ type: options.navigationType ?? 'navigate' }];
  window.requestAnimationFrame = callback => { frames.set(++counter, callback); return counter; };
  window.cancelAnimationFrame = id => frames.delete(id);
  window.setTimeout = (callback, delay) => { timers.set(++counter, { at: now + delay, callback }); return counter; };
  window.clearTimeout = id => timers.delete(id);
  window.matchMedia = () => ({ get matches() { return reduced; }, addEventListener: (_name, listener) => motionListeners.add(listener), removeEventListener: (_name, listener) => motionListeners.delete(listener) });
  class FakeImage {
    onload = null; onerror = null; complete = false; naturalWidth = 0;
    constructor() { images.push(this); }
    set src(value) { this.url = value; if (options.cached) { this.complete = true; this.naturalWidth = 64; } }
    decode() { return options.stallDecode ? new Promise(() => {}) : Promise.resolve(); }
    succeed() { this.complete = true; this.naturalWidth = 64; this.onload?.(); }
    fail() { this.onerror?.(); }
  }
  window.Image = FakeImage;
  if (options.blockStorage) Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Storage blocked'); } });
  const navigation = { usePathname: () => route };
  const visitMarker = load('app/components/ArrivalVisitMarker.tsx', { 'next/navigation': navigation });
  const hook = load('app/components/useGrebeArrival.ts', { './arrivalTimeline': timeline, './ArrivalVisitMarker': visitMarker, './arrivalPreparationController': preparation, 'next/navigation': navigation });
  const key = hook.GREBE_ARRIVAL_SESSION_KEY;
  assert.equal(key, 'econoben:grebe-arrival:v1');
  if (options.seen) window.sessionStorage.setItem(key, '1');
  const preparationReleases = [];
  if (options.nativePreparation) {
    document.body.insertAdjacentHTML('afterbegin', '<div id="arrival-preparation"><button type="button">Skip opening</button></div>');
    window.eval(preparation.arrivalPreparationScript());
    const native = window.__econobenArrivalPreparation;
    if (native) {
      const release = native.release;
      native.release = reason => { preparationReleases.push({ reason, active: latest?.active }); release(reason); };
    }
    if (options.skipBeforeMount) document.querySelector('#arrival-preparation button').click();
    if (options.expireBeforeMount) {
      for (const [id, timer] of [...timers]) { now = timer.at; timers.delete(id); timer.callback(); }
    }
  }
  let root = createRoot(document.getElementById('root'));
  const assetUrls = options.assetUrls ?? ['/wake.png','/flight.png'];
  function Probe() {
    latest = hook.useGrebeArrival({ assetUrls: [...assetUrls], durationMs: options.durationMs });
    const opening = latest.active || latest.loading;
    React.useEffect(() => { openingStates.push(opening); }, [opening]);
    return null;
  }
  function Visit() { return React.createElement(React.Fragment, null, options.historyMarker ? React.createElement(visitMarker.default) : null, !options.homeOnly || route === '/' ? React.createElement(Probe) : null); }
  const render = () => root.render(options.strict ? React.createElement(React.StrictMode, null, React.createElement(Visit)) : React.createElement(Visit));
  await act(async () => render());
  return {
    get state() { return latest; }, images, frames, timers, motionListeners, ownedListeners, openingStates, preparationReleases,
    preparationVisible: () => document.documentElement.hasAttribute('data-arrival-preparing'),
    nativeSkip: async () => { await act(async () => document.querySelector('#arrival-preparation button').click()); },
    seen: () => window.sessionStorage.getItem(key),
    blockStorage() { Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Storage blocked'); } }); },
    async finishImages() { await act(async () => images.forEach(image => image.succeed())); },
    async frame(ms) { now += ms; const callbacks = [...frames.values()]; frames.clear(); await act(async () => callbacks.forEach(callback => callback(now))); },
    async advance(ms) { const end = now + ms; for (;;) { const next = [...timers].sort((a,b) => a[1].at - b[1].at)[0]; if (!next || next[1].at > end) break; now = next[1].at; timers.delete(next[0]); await act(async () => next[1].callback()); } now = end; },
    async motion(value) { reduced = value; await act(async () => motionListeners.forEach(listener => listener({ matches: value }))); },
    async visibility(value) { hidden = value; await act(async () => document.dispatchEvent(new window.Event('visibilitychange'))); },
    async scroll(value) { window.scrollY = value; await act(async () => window.dispatchEvent(new window.Event('scroll'))); },
    async event(name) { await act(async () => window.dispatchEvent(new window.Event(name))); },
    async navigate(path) { window.history.pushState({}, '', path); route = window.location.pathname; await act(async () => render()); },
    async restore(path) { window.history.pushState({}, '', path); route = window.location.pathname; await act(async () => { window.dispatchEvent(new window.PopStateEvent('popstate')); render(); }); },
    async rerender() { await act(async () => render()); },
    async skip() { await act(async () => latest.skip()); },
    async replay() { await act(async () => latest.replay()); },
    async remount() { await act(async () => root.unmount()); root = createRoot(document.getElementById('root')); await act(async () => render()); },
    async close() { await act(async () => root.unmount()); assert.equal(frames.size,0,'Unmount cancels animation frames'); assert.equal(timers.size,0,'Unmount cancels asset deadlines'); assert.equal(motionListeners.size,0,'Unmount detaches reduced-motion listener'); assert.equal(ownedListeners.size,0,'Unmount removes navigation/visibility/scroll listeners'); assert.ok(images.every(image => image.onload === null && image.onerror === null),'Image callbacks are detached'); dom.window.close(); delete globalThis.window; delete globalThis.document; },
  };
}
async function check(options, fn) { const h = await harness(options); try { await fn(h); } finally { await h.close(); } }

await check({}, async h => {
  assert.equal(h.state.loading,true); assert.equal(h.state.active,false); assert.equal(h.seen(),null);
  assert.deepEqual(h.openingStates,[true],'The first effect holds the pond while eligibility and artwork are pending');
  await act(async () => h.images[0].succeed()); assert.equal(h.state.active,false,'Wait for all artwork');
  await h.finishImages(); assert.equal(h.state.active,true); assert.equal(h.state.phase,'wake'); assert.equal(h.seen(),'1');
  assert.ok(h.openingStates.every(Boolean),'Preparing the arrival never briefly releases the pond scheduler');
  const images = h.images.length, skip = h.state.skip, replay = h.state.replay;
  await h.frame(B.wakeEnd); assert.equal(h.state.phase,'shake');
  await h.rerender(); assert.equal(h.images.length,images,'Equivalent asset arrays must not reload on frame renders'); assert.equal(h.state.skip,skip); assert.equal(h.state.replay,replay);
  await h.visibility(true); assert.equal(h.frames.size,0); await h.frame(90000); assert.equal(h.state.elapsedMs,B.wakeEnd,'Hidden time does not advance the film');
  await h.visibility(false); await h.frame(B.shakeEnd - B.wakeEnd); assert.equal(h.state.phase,'launch');
  await h.frame(B.duration - B.shakeEnd); assert.equal(h.state.active,false); assert.equal(h.state.phase,'done'); assert.equal(h.state.elapsedMs,B.duration); assert.equal(h.frames.size,0);
  await h.remount(); assert.equal(h.state.loading,false); assert.equal(h.images.length,images,'Seen sessions do not autoplay again');
  await h.replay(); await h.finishImages(); assert.equal(h.state.active,true,'Explicit replay overrides the once-per-session rule');
});
await check({ strict:true, cached:true }, async h => { assert.equal(h.state.active,true,'Strict effects preserve one actual start with cached artwork'); assert.equal(h.frames.size,1); await h.frame(1000); assert.equal(h.state.elapsedMs,1000); });
await check({}, async h => { const late = h.images[0].onload; await h.skip(); assert.equal(h.state.active,false); assert.equal(h.state.loading,false); assert.equal(h.seen(),'1'); await act(async () => late()); assert.equal(h.state.active,false,'Late artwork cannot undo skip'); assert.equal(h.timers.size,0); });
await check({}, async h => { await act(async () => h.images[0].fail()); assert.equal(h.state.loading,false); assert.equal(h.state.active,false); assert.equal(h.seen(),null,'Artwork failure does not consume an unseen session'); assert.equal(h.timers.size,0); await h.replay(); await h.finishImages(); assert.equal(h.state.active,true); });
await check({}, async h => { const late = h.images[0].onload; await h.advance(2500); assert.equal(h.state.loading,false,'Stalled artwork is bounded to 2.5 seconds'); assert.equal(h.state.active,false); assert.equal(h.seen(),null); await act(async () => late()); assert.equal(h.state.active,false); });
await check({ stallDecode:true }, async h => { await h.finishImages(); assert.equal(h.state.loading,true); await h.advance(2500); assert.equal(h.state.loading,false,'Decoding is included in the load deadline'); assert.equal(h.state.active,false); });
await check({ reduced:true }, async h => { assert.equal(h.images.length,0); assert.equal(h.state.active,false); await h.replay(); assert.equal(h.images.length,0,'Manual replay respects reduced motion'); assert.equal(h.seen(),null); });
await check({}, async h => { await h.finishImages(); await h.motion(true); assert.equal(h.state.active,false); assert.equal(h.frames.size,0); await h.motion(false); assert.equal(h.state.active,false,'Changing preference back does not unexpectedly restart'); await h.replay(); await h.finishImages(); assert.equal(h.state.active,true); });
for (const options of [{url:'https://econoben.dev/#writing'},{scrollY:800},{navigationType:'back_forward'},{url:'https://econoben.dev/book'},{seen:true}]) await check(options, async h => { assert.equal(h.images.length,0); assert.equal(h.state.active,false); assert.equal(h.state.loading,false,'Ineligible visits release preparation immediately'); assert.deepEqual(h.openingStates,[true,false]); });
await check({scrollY:800}, async h => { await h.replay(); await h.finishImages(); assert.equal(h.state.active,true,'A requested replay may run from a scrolled home page'); });
await check({}, async h => { await h.scroll(800); await h.finishImages(); assert.equal(h.state.active,false,'A visitor who starts reading during load is not interrupted'); assert.equal(h.seen(),null); });
await check({hidden:true}, async h => { await h.finishImages(); assert.equal(h.state.active,false); assert.equal(h.state.loading,false); assert.equal(h.seen(),null,'Background readiness alone does not consume the arrival'); await h.visibility(false); assert.equal(h.state.active,true); assert.equal(h.state.elapsedMs,0); });
await check({}, async h => { const late = h.images[0].onload; await h.navigate('/book'); await act(async () => late()); assert.equal(h.state.active,false); assert.equal(h.state.loading,false); assert.equal(h.seen(),null,'Navigation before a start does not mark seen'); });
await check({url:'https://econoben.dev/book'}, async h => { await h.restore('/'); assert.equal(h.images.length,0,'A mounted controller suppresses client-side history restoration to home'); assert.equal(h.seen(),null); await h.navigate('/about'); await h.navigate('/'); await h.finishImages(); assert.equal(h.state.active,true,'A later deliberate home entry remains eligible'); });
await check({url:'https://econoben.dev/book',historyMarker:true,homeOnly:true,strict:true,cached:true}, async h => { assert.equal(h.images.length,0,'An article visit does not mount the controller or load artwork'); await h.restore('/'); assert.equal(h.images.length,0,'The tiny persistent marker suppresses Back before the home-only controller mounts'); assert.equal(h.seen(),null); await h.navigate('/about'); await h.navigate('/'); await h.finishImages(); assert.equal(h.state.active,true,'A new deliberate home visit clears the restoration marker'); });
await check({historyMarker:true,homeOnly:true}, async h => { const count = h.images.length; await h.navigate('/book'); await h.restore('/'); assert.equal(h.images.length,count,'Back after an interrupted load does not replay preparation'); assert.equal(h.seen(),null); await h.replay(); await h.finishImages(); assert.equal(h.state.active,true,'The restoration marker does not block an explicit replay'); });
for (const event of ['pagehide','popstate','hashchange']) await check({}, async h => { await h.finishImages(); await h.event(event); assert.equal(h.state.active,false,`${event} aborts active arrival`); assert.equal(h.frames.size,0); });
await check({}, async h => { const stale = h.images[0].onload; await h.replay(); await act(async () => stale()); assert.equal(h.state.active,false,'Superseded load callbacks cannot start a new run'); await h.finishImages(); assert.equal(h.state.active,true); assert.equal(h.frames.size,1); });
await check({blockStorage:true}, async h => { await h.finishImages(); assert.equal(h.state.active,true); const count = h.images.length; await h.remount(); assert.equal(h.images.length,count,'Blocked storage still suppresses repeats during this document session'); assert.equal(h.state.active,false); });
await check({seen:true}, async h => { assert.equal(h.images.length,0); h.blockStorage(); await h.remount(); assert.equal(h.images.length,0,'A previously observed session flag remains remembered if storage later becomes unavailable'); });
await check({durationMs:400}, async h => { await h.finishImages(); await h.frame(400); assert.equal(h.state.active,false,'Configured shorter durations still finish'); assert.equal(h.state.phase,'done'); });
await check({}, async h => { assert.equal(h.state.loading,true); }); // Closing during a pending load exercises timer/image cleanup.
await check({}, async h => { await h.finishImages(); await h.navigate('/book'); assert.equal(h.state.active,false); assert.equal(h.frames.size,0); await h.replay(); assert.equal(h.state.active,false,'Replay cannot start away from home'); });
await check({assetUrls:['/wake.png','/wake.png']}, async h => { assert.equal(h.images.length,1,'Repeated artwork URLs only load once'); await h.finishImages(); assert.equal(h.state.active,true); });
await check({nativePreparation:true,strict:true}, async h => {
  assert.ok(h.preparationVisible(), 'StrictMode replacement preparation keeps the native cover');
  assert.equal(h.state.loading,true);
  assert.equal(h.preparationReleases.length,0,'Starting an asset attempt does not cancel native preparation');
  await h.finishImages();
  assert.equal(h.state.active,true); assert.equal(h.preparationVisible(),false);
  assert.deepEqual(h.preparationReleases,[{reason:'active',active:true}],'The cover releases only after the active film commits');
});
for (const option of ['skipBeforeMount','expireBeforeMount']) await check({nativePreparation:true,blockStorage:true,[option]:true}, async h => {
  assert.equal(h.preparationVisible(),false); assert.equal(h.images.length,0,'A pre-hydration Skip/deadline suppresses automatic preparation even with blocked storage');
  await h.replay(); await h.finishImages(); assert.equal(h.state.active,true,'An explicit replay still overrides the native document marker');
});
await check({nativePreparation:true}, async h => {
  const late=h.images[0].onload;
  await h.nativeSkip(); assert.equal(h.state.loading,false); assert.equal(h.preparationVisible(),false);
  await act(async()=>late()); assert.equal(h.state.active,false,'Native Skip during hydration invalidates queued artwork');
});
await check({nativePreparation:true}, async h => {
  await act(async()=>h.images[0].fail()); assert.equal(h.state.loading,false); assert.equal(h.preparationVisible(),false);
  const count=h.images.length; await h.remount(); assert.equal(h.images.length,count,'Failure cannot flash a late automatic opening after the native cover is gone');
  await h.replay(); await h.finishImages(); assert.equal(h.state.active,true);
});
await check({nativePreparation:true}, async h => {
  await h.advance(2500); assert.equal(h.preparationVisible(),false); assert.equal(h.state.loading,false,'Hydrated asset timeout retains the shorter 2.5-second bound');
});
await check({nativePreparation:true,hidden:true}, async h => {
  await h.finishImages(); await h.advance(50000);
  assert.ok(h.preparationVisible()); assert.equal(h.state.active,false); assert.equal(h.seen(),null,'Ready hidden artwork does not consume the arrival through the native deadline');
  await h.visibility(false); assert.equal(h.state.active,true); assert.equal(h.preparationVisible(),false); assert.equal(h.seen(),'1');
});
await check({nativePreparation:true}, async h => { assert.ok(h.preparationVisible()); });
console.log('Grebe arrival passed: phase boundaries, SSR, session/replay, hidden-tab timing, reduced motion, restoration suppression, bounded image loading, stale callbacks and full cleanup.');
