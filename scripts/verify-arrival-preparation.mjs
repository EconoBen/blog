import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const componentFiles = fs.readdirSync('app/components');
for (const module of ['ArrivalPreparation', 'arrivalPreparationController']) {
  const candidates = componentFiles.filter(file => /\.tsx?$/.test(file) && file.replace(/\.tsx?$/, '').toLowerCase() === module.toLowerCase());
  assert.equal(candidates.length, 1, `Extensionless ${module} must resolve unambiguously on a case-insensitive filesystem`);
}
function load(file, overrides = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => overrides[name] ?? require(name), module, module.exports);
  return module.exports;
}
const preparation = load('app/components/arrivalPreparationController.ts');
const components = load('app/components/ArrivalPreparation.tsx', { './arrivalPreparationController': preparation });
const head = renderToStaticMarkup(React.createElement(components.ArrivalPreparationHead));
const body = renderToStaticMarkup(React.createElement(components.ArrivalPreparationBody));
assert.match(head, /<script/);
assert.match(body, /Skip opening/);
assert.ok(!head.includes('next/script'), 'Preparation must not wait for a framework script queue');

async function fixture(options = {}) {
  const timers = new Map(), listeners = new Set();
  let next = 0, clock = 0, reduced = !!options.reduced, hidden = !!options.hidden;
  const html = `<!doctype html><html><head>${head}</head><body>${options.body === false ? '' : body}<main><button id="article">Read article</button></main></body></html>`;
  const dom = new JSDOM(html, {
    url: options.url ?? 'https://econoben.dev/', pretendToBeVisual: true,
    runScripts: options.noJS ? 'outside-only' : 'dangerously',
    beforeParse(window) {
      window.matchMedia = () => ({ get matches() { return reduced; }, addEventListener: (_type, callback) => listeners.add(callback), removeEventListener: (_type, callback) => listeners.delete(callback) });
      window.performance.getEntriesByType = () => [{ type: options.navigation ?? 'navigate' }];
      Object.defineProperty(window.performance, 'now', { value: () => clock });
      Object.defineProperty(window.document, 'hidden', { get: () => hidden });
      Object.defineProperty(window, 'scrollY', { value: options.scrollY ?? 0, writable: true });
      if (options.seen) window.sessionStorage.setItem(preparation.GREBE_ARRIVAL_SESSION_KEY, '1');
      if (options.blockStorage) Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('Blocked storage'); } });
      window.setTimeout = (callback, delay) => { const id = ++next; timers.set(id, { at: clock + delay, callback }); return id; };
      window.clearTimeout = id => timers.delete(id);
    },
  });
  const { window } = dom;
  await Promise.resolve();
  const root = window.document.documentElement;
  const active = () => root.hasAttribute('data-arrival-preparing');
  const suppressed = () => root.hasAttribute('data-arrival-suppressed');
  const button = () => window.document.querySelector('#arrival-preparation button');
  return {
    window, root, active, suppressed, button, timers, listeners,
    async attach() { window.document.body.insertAdjacentHTML('afterbegin', body); await Promise.resolve(); },
    key(key) { const event = new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }); window.document.dispatchEvent(event); return event; },
    advance(ms) { clock += ms; for (const [id, timer] of [...timers]) if (timer.at <= clock) { timers.delete(id); timer.callback(); } },
    motion(value) { reduced = value; for (const listener of [...listeners]) listener({ matches: value }); },
    visibility(value) { hidden = value; window.document.dispatchEvent(new window.Event('visibilitychange')); },
    close() { window.__econobenArrivalPreparation?.release('unmount'); assert.equal(timers.size, 0, 'Preparation releases its deadline'); assert.equal(listeners.size, 0, 'Preparation releases its motion listener'); dom.window.close(); },
  };
}
async function check(options, fn) { const f = await fixture(options); try { await fn(f); } finally { f.close(); } }

await check({}, async f => {
  assert.ok(f.active(), 'Eligible visits are covered before hydration');
  assert.equal(f.window.getComputedStyle(f.window.document.getElementById('arrival-preparation')).display, 'block');
  assert.equal(f.window.document.activeElement, f.button());
  f.window.document.getElementById('article').focus();
  assert.equal(f.window.document.activeElement, f.button(), 'Native focus containment prevents entering the covered page');
  assert.ok(f.key('Tab').defaultPrevented);
  f.advance(3999); assert.ok(f.active());
  f.button().click();
  assert.equal(f.active(), false); assert.ok(f.suppressed());
  assert.equal(f.window.sessionStorage.getItem(preparation.GREBE_ARRIVAL_SESSION_KEY), '1');
  assert.equal(f.timers.size, 0);
});
await check({ body: false }, async f => {
  assert.ok(f.active(), 'The head marker does not require a parsed body cover');
  f.key('Escape');
  await f.attach();
  assert.equal(f.active(), false, 'Escape before body attachment cannot be undone by late markup');
  assert.ok(f.suppressed());
  assert.notEqual(f.window.document.activeElement, f.button());
});
await check({ body: false, blockStorage: true }, async f => {
  f.advance(4000);
  assert.equal(f.active(), false, 'A missing hydration/markup phase fails open by four seconds');
  assert.ok(f.suppressed(), 'Document marker preserves the deadline decision when storage is blocked');
  await f.attach(); assert.equal(f.active(), false);
});
await check({}, async f => {
  f.window.__econobenArrivalPreparation.release('cancel');
  assert.equal(f.active(), false); assert.ok(f.suppressed(), 'Failed preparation suppresses later automatic starts in this document');
  assert.equal(f.window.sessionStorage.getItem(preparation.GREBE_ARRIVAL_SESSION_KEY), null, 'Asset failure does not consume an unseen session');
});
await check({}, async f => {
  const actorButton = f.window.document.createElement('button');
  actorButton.textContent = 'Active film skip'; f.window.document.body.append(actorButton);
  // The film removes native focus containment before transferring focus. Once
  // its own button owns focus, an idempotent release must not steal it back.
  f.window.__econobenArrivalPreparation.release('active'); actorButton.focus();
  f.window.__econobenArrivalPreparation.release('active');
  assert.equal(f.window.document.activeElement, actorButton);
  assert.equal(f.suppressed(), false); assert.equal(f.timers.size, 0);
});
await check({}, async f => { f.motion(true); assert.equal(f.active(), false); assert.ok(f.suppressed()); });
await check({ hidden: true }, async f => {
  f.advance(50000); assert.ok(f.active()); assert.equal(f.suppressed(), false);
  assert.equal(f.timers.size, 0, 'An initially hidden document does not run its visible preparation deadline');
  f.visibility(false); f.advance(3999); assert.ok(f.active());
  f.advance(1); assert.equal(f.active(), false); assert.ok(f.suppressed());
});
await check({}, async f => {
  f.advance(1000); f.visibility(true); f.advance(50000);
  assert.ok(f.active()); assert.equal(f.suppressed(), false, 'Hidden time cannot consume arrival eligibility');
  f.visibility(false); f.advance(2999); assert.ok(f.active(), 'Returning preserves the unused deadline');
  f.advance(1); assert.equal(f.active(), false);
});
for (const event of ['pagehide', 'popstate', 'hashchange']) await check({}, async f => { f.window.dispatchEvent(new f.window.Event(event)); assert.equal(f.active(), false); });
for (const options of [{ noJS: true }, { reduced: true }, { seen: true }, { navigation: 'back_forward' }, { scrollY: 500 }, { url: 'https://econoben.dev/book' }, { url: 'https://econoben.dev/#writing' }]) await check(options, async f => {
  assert.equal(f.active(), false, 'Ineligible and no-JavaScript documents remain readable');
  assert.equal(f.window.getComputedStyle(f.window.document.getElementById('arrival-preparation')).display, 'none');
  assert.equal(f.timers.size, 0);
  assert.equal(f.suppressed(), false);
});
console.log('Arrival preparation passed: pre-hydration cover, early Skip/Escape, focus containment, bounded fail-open, blocked storage, unchanged bypasses, native cleanup and no-JavaScript access.');
