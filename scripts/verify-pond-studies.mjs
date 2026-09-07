import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import matter from 'gray-matter';

const require = createRequire(import.meta.url);
const compile = filename => ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2020 },
}).outputText;
// Read the production component first: the initial regression run fails until it exists.
const code = compile('app/pond-studies/PondStudies.tsx');
const contentModule = { exports: {} };
new Function('require', 'module', 'exports', compile('app/pond-studies/studyContent.ts'))(require, contentModule, contentModule.exports);
const { buildPondStudyContent, connectionsFor } = contentModule.exports;
const content = buildPondStudyContent(fs.readdirSync('src/posts').filter(name => name.endsWith('.md')).map(name => {
  const post = matter(fs.readFileSync(`src/posts/${name}`, 'utf8'));
  return { slug: name.slice(0, -3), title: post.data.title, date: post.data.date, tags: post.data.tags ?? [], content: post.content };
}));
assert.ok(content.essays.length >= 3 && content.connections.length > 0, 'Use the actual shared study essays and their evidenced connections');

const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost:3107/pond-studies', pretendToBeVisual: true });
globalThis.window = dom.window; globalThis.document = dom.window.document; globalThis.Event = dom.window.Event;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let hidden = false, reduced = false, now = 0, timerId = 0, frameId = 0, soundEnabled = false, played = 0, playAttempts = 0, stopped = 0;
const timers = new Map(), frames = new Map(), mediaListeners = new Set();
Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => hidden ? 'hidden' : 'visible' });
window.matchMedia = query => ({ get matches() { return query.includes('prefers-reduced-motion') ? reduced : false; },
  addEventListener: (_name, fn) => mediaListeners.add(fn), removeEventListener: (_name, fn) => mediaListeners.delete(fn),
});
const originalTimers = { setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout, requestAnimationFrame: globalThis.requestAnimationFrame, cancelAnimationFrame: globalThis.cancelAnimationFrame };
// Let jsdom's zero-delay selection/focus events retain their native behavior.
globalThis.setTimeout = window.setTimeout = (fn, delay = 0) => {
  if (delay === 0) return originalTimers.setTimeout(fn, 0);
  timers.set(++timerId, { fn, at: now + delay, delay }); return timerId;
};
globalThis.clearTimeout = window.clearTimeout = id => { if (!timers.delete(id)) originalTimers.clearTimeout(id); };
globalThis.requestAnimationFrame = window.requestAnimationFrame = fn => { frames.set(++frameId, fn); return frameId; };
globalThis.cancelAnimationFrame = window.cancelAnimationFrame = id => frames.delete(id);
// The real hook's actions are stable callbacks; preserve that effect contract.
const soundActions = { toggle: () => { soundEnabled = !soundEnabled; if (!soundEnabled) stopped++; }, play: () => { playAttempts++; if (soundEnabled) played++; }, stop: () => { stopped++; } };
const mockSound = () => ({ enabled: soundEnabled, ...soundActions });
const loaded = { exports: {} };
new Function('require', 'module', 'exports', code)(id => {
  if (id.endsWith('.css')) return {};
  if (id === './studyContent') return contentModule.exports;
  if (id === './StudyScene') return { StudyScene: ({ direction }) => React.createElement('svg', { 'aria-hidden': true, 'data-study-direction': direction }) };
  if (id === './useStudyWaterSound') return { useStudyWaterSound: mockSound, STUDY_WATER_TIMING: { entry: .5, submerged: 1.2, submergedEnd: 2.2, resurface: 2.1, duration: 3.65 } };
  if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
  return require(id);
}, loaded, loaded.exports);
const { createRoot } = await import('react-dom/client');
const root = createRoot(document.getElementById('root'));
const frame = async () => act(async () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now)); });
const render = async () => { await act(async () => root.render(React.createElement(loaded.exports.PondStudies, content))); await frame(); };
const label = button => (button.getAttribute('aria-label') ?? button.textContent).replace(/\s+/g, ' ').trim();
const button = name => { const found = [...document.querySelectorAll('button')].find(element => label(element) === name || label(element).includes(name)); assert.ok(found, `Missing accessible button: ${name}`); return found; };
const click = async name => { await act(async () => button(name).click()); await frame(); };
const selectedHeading = () => [...document.querySelectorAll('article h3')].find(heading => content.essays.some(essay => essay.title === heading.textContent.trim()));
const selectedTitle = () => { const heading = selectedHeading(); assert.ok(heading, 'The selected essay has a real article heading'); return heading.textContent.trim(); };
const isBusy = () => button('Find an article').disabled || button('Find an article').getAttribute('aria-disabled') === 'true';
const advance = async elapsed => {
  const until = now + elapsed;
  while (true) {
    const next = [...timers].sort((left, right) => left[1].at - right[1].at)[0];
    if (!next || next[1].at > until) break;
    now = next[1].at; timers.delete(next[0]); await act(async () => next[1].fn()); await frame();
  }
  now = until;
};
try {
  await render();
  assert.equal(played, 0, 'Study arrival is silent');
  assert.equal(timers.size, 0, 'Study arrival starts no dive timers');
  const initial = selectedTitle();
  for (const name of ['Pond at dusk', 'Field atlas', 'Below the surface', 'Full width', 'Phone']) button(name);
  assert.equal(button('Find an article').getAttribute('aria-label'), 'Find an article');
  await act(async () => { button('Find an article').click(); button('Find an article').click(); });
  assert.equal(isBusy(), true);
  assert.deepEqual([...timers.values()].map(timer => timer.delay).sort((a, b) => a - b), [2100, 3150, 3800], 'Rapid repeat activation cannot queue another dive');
  await advance(2099);
  assert.equal(selectedTitle(), initial, 'The essay is not swapped before resurfacing');
  assert.match(button('Find an article').textContent, /Finding an article/);
  await advance(1);
  assert.match(button('Find an article').textContent, /Retrieving an article/, 'Resurfacing begins when the grebe emerges at 2.1 seconds');
  assert.equal(selectedTitle(), initial, 'The returning grebe keeps its discovery concealed until it reaches the bank');
  assert.equal(document.querySelector('.study-field-note').getAttribute('aria-busy'), 'true');
  await advance(1049);
  assert.equal(selectedTitle(), initial, 'The essay remains unchanged through the return to the bank');
  await advance(1);
  const discovered = selectedTitle();
  assert.notEqual(discovered, initial, 'Discovery avoids an immediate repeat when alternatives exist');
  assert.ok(document.querySelector('.study-world.is-revealing'), 'The article reveals at 3.15 seconds');
  assert.equal(document.querySelector('.study-field-note').getAttribute('aria-busy'), 'false', 'The newly revealed essay is ready to read');
  assert.equal(isBusy(), true, 'The reveal precedes the end of the motion');
  await advance(649);
  assert.equal(isBusy(), true, 'A new dive waits until the return motion finishes');
  await advance(1);
  assert.equal(isBusy(), false);
  assert.equal(document.querySelector('.study-world.is-diving'), null);
  assert.equal(document.querySelector('.study-world.is-revealing'), null);
  await click('Replay animation');
  await advance(3800);
  assert.equal(selectedTitle(), discovered, 'Replay preserves the current essay for comparison');

  soundEnabled = true;
  await render();
  await click('Find an article');
  assert.ok(played > 0, 'An enabled explicit dive auditions the water');
  await advance(600);
  const stopsBeforeDirection = stopped;
  await click('Field atlas');
  assert.equal(button('Field atlas').getAttribute('aria-pressed'), 'true');
  assert.equal(document.querySelector('[data-study-direction]').getAttribute('data-study-direction'), 'atlas', 'The scene actually changes with the direction control');
  assert.equal(timers.size, 0, 'Changing direction cancels pending reveal and finish timers');
  assert.ok(stopped > stopsBeforeDirection, 'Changing direction stops the sound audition');
  assert.equal(selectedTitle(), discovered, 'Changing art direction retains the same selected essay');
  await advance(5000);
  assert.equal(selectedTitle(), discovered, 'A cancelled dive cannot replace the retained essay later');
  for (const [direction, scene] of [['Below the surface', 'cutaway'], ['Pond at dusk', 'dusk']]) {
    await click(direction); assert.equal(selectedTitle(), discovered);
    assert.equal(button(direction).getAttribute('aria-pressed'), 'true');
    assert.equal(document.querySelector('[data-study-direction]').getAttribute('data-study-direction'), scene);
  }
  await click('Phone');
  assert.equal(button('Phone').getAttribute('aria-pressed'), 'true');
  assert.equal(selectedTitle(), discovered, 'Phone comparison uses the same essay');
  await click('Full width');
  assert.equal(button('Full width').getAttribute('aria-pressed'), 'true');

  const current = content.essays.find(essay => essay.title === discovered);
  const neighbors = connectionsFor(current.slug, content.essays, content.connections);
  assert.ok(neighbors.length > 0, 'The chosen article has a real neighboring article');
  const related = [...document.querySelectorAll('button')].find(element => neighbors.some(({ essay, label: reason }) => element.textContent.includes(reason) && (element.textContent.includes(essay.title) || element.textContent.includes(essay.shortTitle))));
  assert.ok(related, 'A neighboring essay shows the actual connection reason');
  const neighbor = neighbors.find(({ essay, label: reason }) => related.textContent.includes(reason) && (related.textContent.includes(essay.title) || related.textContent.includes(essay.shortTitle))).essay;
  await act(async () => related.click()); await frame();
  assert.equal(selectedTitle(), neighbor.title);
  assert.ok(document.activeElement === selectedHeading(), 'Selecting a neighbor moves native DOM focus to the new essay heading');
  assert.equal(selectedHeading().tabIndex, -1);

  const essayList = document.querySelector('.study-all-essays');
  essayList.open = true;
  const anotherEssay = [...essayList.querySelectorAll('button')].find(element => element.textContent.trim() !== selectedTitle());
  const listedTitle = anotherEssay.textContent.trim();
  anotherEssay.focus();
  await act(async () => anotherEssay.click()); await frame();
  assert.equal(selectedTitle(), listedTitle, 'Selecting an essay from the full list changes the article');
  assert.ok(document.activeElement === selectedHeading(), 'Selecting a different listed essay focuses its new heading');
  const sameEssay = [...essayList.querySelectorAll('button')].find(element => element.textContent.trim() === selectedTitle());
  sameEssay.focus();
  await act(async () => sameEssay.click()); await frame();
  assert.equal(selectedTitle(), listedTitle);
  assert.ok(document.activeElement === selectedHeading(), 'Reselecting the current listed essay focuses its heading immediately');
  const discoveryControl = button('Find an article');
  discoveryControl.focus();
  await click('Find an article');
  await advance(3150);
  assert.notEqual(selectedTitle(), listedTitle, 'A later dive can still discover a new essay');
  assert.ok(document.activeElement === discoveryControl, 'Discovery does not inherit stale focus from a repeated essay selection');
  await advance(650);
  assert.ok(document.activeElement === discoveryControl, 'Finishing the dive preserves focus on its initiating control');

  reduced = true;
  await act(async () => mediaListeners.forEach(fn => fn({ matches: true })));
  const attemptsBeforeReduced = playAttempts;
  const beforeReduced = selectedTitle();
  await click('Find an article');
  assert.notEqual(selectedTitle(), beforeReduced, 'Reduced motion reveals another essay immediately');
  assert.equal(playAttempts, attemptsBeforeReduced, 'Reduced motion omits the sound audition');
  assert.equal(timers.size, 0);
  assert.equal(isBusy(), false);
  reduced = false;
  await act(async () => mediaListeners.forEach(fn => fn({ matches: false })));
  await click('Find an article');
  const beforeHide = selectedTitle(), stopsBeforeHide = stopped;
  hidden = true;
  await act(async () => document.dispatchEvent(new Event('visibilitychange')));
  assert.equal(timers.size, 0, 'Hiding the study cancels its pending reveal');
  assert.ok(stopped > stopsBeforeHide, 'Hiding the study stops audition audio');
  await advance(5000);
  assert.equal(selectedTitle(), beforeHide);
  hidden = false;
  await act(async () => document.dispatchEvent(new Event('visibilitychange')));
  await click('Find an article');
  const stopsBeforeUnmount = stopped;
  await act(async () => root.unmount());
  assert.equal(timers.size, 0, 'Unmount clears pending reveal and finish timers');
  assert.ok(stopped > stopsBeforeUnmount, 'Unmount stops the audition');
  assert.equal(frames.size, 0, 'Unmount clears pending pointer/focus frames');
  assert.equal(mediaListeners.size, 0, 'Unmount removes the motion-preference listener');
  console.log('Pond studies passed: real essay discovery, three-stage reveal timing, repeat/replay, direction and size comparison, connection and repeated-selection focus, reduced motion, hidden and unmount cleanup.');
} finally {
  if (document.getElementById('root')?.hasChildNodes()) await act(async () => root.unmount());
  Object.assign(globalThis, originalTimers);
  dom.window.close();
}
