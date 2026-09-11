import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const compile = path => ts.transpileModule(fs.readFileSync(path, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
}).outputText;
const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let hidden = false, reduced = false, now = 0, timerId = 0, starts = 0, maxVisitors = 0;
const timers = new Map(), motionListeners = new Set(), activeSchedulers = new Set();
Object.defineProperty(document, 'hidden', { get: () => hidden });
window.matchMedia = () => ({
  get matches() { return reduced; },
  addEventListener: (_name, listener) => motionListeners.add(listener),
  removeEventListener: (_name, listener) => motionListeners.delete(listener),
});
const originalTimers = { setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout };
globalThis.setTimeout = window.setTimeout = (callback, delay = 0) => {
  if (!delay) return originalTimers.setTimeout(callback, 0);
  timers.set(++timerId, { callback, at: now + delay }); return timerId;
};
globalThis.clearTimeout = window.clearTimeout = id => { if (!timers.delete(id)) originalTimers.clearTimeout(id); };
// Identical random choices make reused CSS animations observable as identical
// DOM/style state, rather than accidentally restarting through a changed duration.
const fixedMath = Object.create(Math); fixedMath.random = () => .5;
const scheduler = { exports: {} };
new Function('exports', 'Math', compile('app/components/pondSchedule.ts'))(scheduler.exports, fixedMath);
const arrival = { exports: {} };
new Function('require', 'module', 'exports', compile('app/components/GrebeArrivalContext.tsx'))(require, arrival, arrival.exports);
const field = { exports: {} };
new Function('require', 'module', 'exports', compile('app/components/GrebeField.tsx'))(id => {
  if (id === './GrebeArrivalContext') return arrival.exports;
  if (id === './ReadingGrebe') return { ReadingGrebe: () => React.createElement('span', { 'data-reader': true }) };
  if (id === './pondSchedule') return { startPondVisits: onChange => {
    const session = ++starts;
    activeSchedulers.add(session);
    assert.equal(activeSchedulers.size, 1, 'Only one scheduler may own the two visitor slots');
    const stop = scheduler.exports.startPondVisits(visits => {
      maxVisitors = Math.max(maxVisitors, visits.length);
      assert.ok(visits.length <= 2, 'Restarts preserve the two-visitor cap');
      assert.equal(new Set(visits.map(visit => visit.side)).size, visits.length, 'Each shore owns only one visitor');
      onChange(visits);
    });
    return () => { activeSchedulers.delete(session); stop(); };
  } };
  return require(id);
}, field, field.exports);
const { createRoot } = await import('react-dom/client');
const root = createRoot(document.getElementById('root'));
const swimmers = () => [...document.querySelectorAll('.pond-swimmer')];
const visibility = value => { hidden = value; document.dispatchEvent(new window.Event('visibilitychange')); };
const motion = value => { reduced = value; motionListeners.forEach(listener => listener({ matches: value })); };
const advance = async elapsed => {
  const until = now + elapsed;
  while (true) {
    const next = [...timers].sort((a, b) => a[1].at - b[1].at)[0];
    if (!next || next[1].at > until) break;
    now = next[1].at; timers.delete(next[0]); await act(async () => next[1].callback());
  }
  now = until;
};
try {
  await act(async () => root.render(React.createElement(React.StrictMode, null, React.createElement(field.exports.GrebeField, { variant: 'home' }))));
  assert.equal(swimmers().length, 1, 'The initial visitor is present after effects settle');
  const initial = swimmers()[0];
  const initialStyle = initial.getAttribute('style');
  await act(async () => { visibility(true); visibility(false); });
  assert.equal(swimmers().length, 1);
  assert.notEqual(swimmers()[0], initial, 'A batched hide/show starts a fresh CSS animation instead of reusing its old clock');
  assert.equal(swimmers()[0].getAttribute('style'), initialStyle, 'The fix does not change crossing speed, size, height or head start');
  await advance(4000);
  assert.equal(swimmers().length, 2, 'The opposite visitor still arrives on its normal schedule');
  const beforeMotion = swimmers().find(node => node.classList.contains('pond-swimmer--left'));
  await act(async () => { motion(true); motion(false); });
  assert.equal(swimmers().length, 1);
  assert.notEqual(swimmers()[0], beforeMotion, 'A batched reduced-motion toggle also starts a fresh animation');
  assert.equal(swimmers()[0].getAttribute('style'), initialStyle);
  await advance(600000);
  assert.equal(maxVisitors, 2, 'Long-running visits and meetings retain the existing density limit');
  await act(async () => visibility(true));
  assert.equal(swimmers().length, 0);
  assert.equal(timers.size, 0, 'A hidden page stops every scheduled arrival and departure');
  assert.equal(activeSchedulers.size, 0);
  await act(async () => visibility(false));
  assert.equal(swimmers().length, 1);
  await act(async () => motion(true));
  assert.equal(swimmers().length, 0);
  assert.equal(timers.size, 0, 'Reduced motion leaves no running visitor schedule');
  await act(async () => motion(false));
  assert.equal(swimmers().length, 1);
  let setOpening;
  function ArrivalControls() {
    setOpening = arrival.exports.useGrebeArrivalContext().setOpening;
    return null;
  }
  const startsBeforeArrival = starts;
  await act(async () => root.render(React.createElement(React.StrictMode, null,
    React.createElement(arrival.exports.GrebeArrivalProvider, null,
      React.createElement(ArrivalControls),
      React.createElement(field.exports.GrebeField, { variant: 'home' }),
    ),
  )));
  assert.equal(starts, startsBeforeArrival, 'The initial arrival hold starts no visitor schedule, including StrictMode replay');
  assert.equal(swimmers().length, 0);
  assert.equal(document.querySelector('.pond-peeker'), null, 'The peeker is absent while the arrival owns the scene');
  assert.equal(timers.size, 0);
  await act(async () => { visibility(true); visibility(false); motion(true); motion(false); });
  await advance(10000);
  assert.equal(starts, startsBeforeArrival, 'Visibility/motion changes cannot bypass an unfinished arrival');
  await act(async () => setOpening(false));
  assert.equal(swimmers().length, 1, 'Completing or skipping arrival immediately starts one swimmer');
  assert.equal(swimmers()[0].getAttribute('style'), initialStyle, 'Arrival release preserves the original crossing speed, size, height and head start');
  assert.ok(document.querySelector('.pond-peeker'), 'The peeker returns after arrival');
  await advance(1900);
  assert.equal(swimmers().length, 1, 'The opposite arrival still waits its normal delay');
  await advance(2200);
  assert.equal(swimmers().length, 2);
  const beforeHold = swimmers()[0];
  await act(async () => setOpening(true));
  assert.equal(swimmers().length, 0, 'A new hold removes existing visitors immediately');
  assert.equal(document.querySelector('.pond-peeker'), null);
  assert.equal(timers.size, 0, 'A new hold cancels departures, opposite arrivals and meeting timers');
  assert.equal(activeSchedulers.size, 0);
  await act(async () => { visibility(true); setOpening(false); });
  assert.equal(swimmers().length, 0, 'Releasing a hold while hidden does not start motion');
  await act(async () => visibility(false));
  assert.equal(swimmers().length, 1);
  assert.notEqual(swimmers()[0], beforeHold, 'A resumed crossing gets a fresh DOM animation clock');
  await act(async () => { setOpening(true); motion(true); });
  await act(async () => setOpening(false));
  assert.equal(swimmers().length, 0, 'Skipping arrival with reduced motion keeps roaming animation off');
  assert.equal(timers.size, 0);
  await act(async () => motion(false));
  assert.equal(swimmers().length, 1);
  await advance(600000);
  assert.equal(maxVisitors, 2, 'Arrival handoffs retain the existing two-slot limit over repeated visits');
  await act(async () => setOpening(true));
  await act(async () => root.unmount());
  assert.equal(timers.size, 0);
  assert.equal(activeSchedulers.size, 0);
  assert.equal(motionListeners.size, 0);
  const finalStarts = starts;
  visibility(true); visibility(false); motion(true); motion(false);
  assert.equal(starts, finalStarts, 'Unmount removes lifecycle listeners, so later events cannot restart a scheduler');
  console.log('Grebe field lifecycle passed: immediate visitor, fresh animation nodes across batched visibility/motion resets, StrictMode cleanup, unchanged styles, arrival hold/release/skip, and two-slot density.');
} finally {
  if (document.getElementById('root')?.hasChildNodes()) await act(async () => root.unmount());
  Object.assign(globalThis, originalTimers);
  dom.window.close();
}
