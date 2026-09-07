import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

const require = createRequire(import.meta.url);
const source = fs.readFileSync(new URL('../app/components/ReadingMemory.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const componentModule = { exports: {} };
new Function('require', 'module', 'exports', compiled)((id) => {
  if (id.endsWith('.css')) return {};
  if (id === './ReadingGrebe') return { ReadingGrebe: () => null };
  if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
  return require(id);
}, componentModule, componentModule.exports);
const { parseReadingBookmark, readingPosition, ReadingProgress, ReturningBookmark, READING_MEMORY_KEY } = componentModule.exports;
const bookmark = { version: 1, slug: 'an-essay', title: 'An essay', position: 0.42, savedAt: Date.now() };
const encode = value => JSON.stringify(value);
assert.deepEqual(parseReadingBookmark(encode(bookmark)), bookmark);
const actualSlugs = fs.readdirSync(new URL('../posts/', import.meta.url)).filter(name => name.endsWith('.md')).map(name => name.slice(0, -3));
for (const slug of actualSlugs) {
  assert.equal(parseReadingBookmark(encode({ ...bookmark, slug }))?.slug, slug, `Real article slug must support reading memory: ${slug}`);
}
for (const corrupt of [null, 'oops', '{}', encode({ ...bookmark, slug: '../book' }), encode({ ...bookmark, slug: 'https://evil.test' }), encode({ ...bookmark, title: '' }), encode({ ...bookmark, position: '0.5' }), encode({ ...bookmark, position: -1 }), encode({ ...bookmark, position: 1 }), encode({ ...bookmark, savedAt: 0 }), encode({ ...bookmark, savedAt: Date.now() + 120_000 })]) {
  assert.equal(parseReadingBookmark(corrupt), null, `Reject corrupt bookmark ${corrupt}`);
}
assert.equal(readingPosition(1000, 4000, 100, 800), 0);
assert.equal(readingPosition(1000, 4000, 2400, 800), 0.4);
assert.equal(readingPosition(1000, 4000, 10000, 800), 1);
assert.equal(readingPosition(1000, 0, 10000, 800), 0);

const dom = new JSDOM('<div id="root"></div><div id="reading-content" tabindex="-1"></div>', { url: 'https://econoben.dev/posts/an-essay', pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.Event = dom.window.Event;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const article = document.getElementById('reading-content');
Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
Object.defineProperty(window, 'scrollY', { value: 2400, writable: true });
article.getBoundingClientRect = () => ({ top: 1000 - window.scrollY, bottom: 5000 - window.scrollY, height: 4000 });
const scrolls = [];
window.scrollTo = value => { scrolls.push(value); window.scrollY = value.top; };
const intervals = new Set();
const originalSetInterval = globalThis.setInterval;
const originalClearInterval = globalThis.clearInterval;
globalThis.setInterval = callback => { intervals.add(callback); return callback; };
globalThis.clearInterval = callback => intervals.delete(callback);
const root = createRoot(document.getElementById('root'));
const mount = async (element) => act(async () => { root.render(element); });
const tick = async (count) => act(async () => { for (let i = 0; i < count; i += 1) for (const callback of intervals) callback(); });
const progress = () => React.createElement(ReadingProgress, { slug: 'an-essay', title: 'An essay' });
try {
  window.localStorage.setItem(READING_MEMORY_KEY, encode(bookmark));
  await mount(progress());
  await tick(15);
  assert.equal(window.localStorage.getItem(READING_MEMORY_KEY), encode(bookmark), 'Passive visit must not overwrite memory');
  assert.equal(scrolls.length, 0, 'Ordinary visits must not restore position');
  window.dispatchEvent(new Event('wheel'));
  await tick(1);
  assert.equal(parseReadingBookmark(window.localStorage.getItem(READING_MEMORY_KEY)).position, 0.4);
  window.history.replaceState({}, '', '/');
  window.scrollY = 4900;
  await tick(1);
  assert.ok(window.localStorage.getItem(READING_MEMORY_KEY), 'Route reset must not erase previous reading');
  await mount(null);
  assert.equal(intervals.size, 0, 'Unmount cleans up timers');

  window.history.replaceState({}, '', '/posts/an-essay?resume=reading');
  window.scrollY = 0;
  await mount(React.createElement(React.StrictMode, null, progress()));
  assert.equal(scrolls.length, 1, 'Explicit continue restores position once');
  assert.equal(scrolls[0].top, 2400);
  assert.equal(window.location.search, '', 'Resume request is consumed');
  window.scrollY = 4300;
  await tick(12);
  assert.equal(window.localStorage.getItem(READING_MEMORY_KEY), null, 'Completing the current article clears its bookmark');
  await mount(null);

  window.localStorage.setItem(READING_MEMORY_KEY, encode({ ...bookmark, slug: 'another-essay' }));
  await mount(progress());
  window.dispatchEvent(new Event('wheel'));
  await tick(12);
  assert.equal(parseReadingBookmark(window.localStorage.getItem(READING_MEMORY_KEY)).slug, 'another-essay', 'Completion does not erase a different article');
  await mount(null);
  await mount(React.createElement(ReturningBookmark));
  assert.match(document.getElementById('root').textContent, /Reading bookmark/);
  assert.equal(document.querySelector('a').getAttribute('href'), '/posts/another-essay?resume=reading');
  await act(async () => { document.querySelector('button').click(); });
  assert.equal(window.localStorage.getItem(READING_MEMORY_KEY), null);
  assert.equal(document.getElementById('root').textContent, '');

  for (const slug of actualSlugs.filter(value => /[^a-zA-Z0-9_-]/.test(value))) {
    await mount(null);
    window.localStorage.setItem(READING_MEMORY_KEY, encode({ ...bookmark, slug }));
    await mount(React.createElement(ReturningBookmark));
    assert.equal(document.querySelector('a').getAttribute('href'), `/posts/${encodeURIComponent(slug)}?resume=reading`);
    await mount(null);
    window.history.replaceState({}, '', `/posts/${encodeURIComponent(slug)}?resume=reading`);
    const previousScrolls = scrolls.length;
    window.scrollY = 0;
    await mount(React.createElement(ReadingProgress, { slug, title: 'Legacy article' }));
    assert.equal(scrolls.length, previousScrolls + 1, 'Encoded legacy paths must resume');
    window.scrollY = 2500;
    await tick(12);
    assert.equal(parseReadingBookmark(window.localStorage.getItem(READING_MEMORY_KEY)).position, 0.425, 'Encoded legacy paths must save new progress');
  }

  Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); }, configurable: true });
  await mount(null);
  await mount(progress());
  window.dispatchEvent(new Event('wheel'));
  await tick(12);
  await mount(React.createElement(ReturningBookmark));
  assert.equal(document.getElementById('root').textContent, '', 'Unavailable storage degrades quietly');
} finally {
  await act(async () => { root.unmount(); });
  globalThis.setInterval = originalSetInterval;
  globalThis.clearInterval = originalClearInterval;
  dom.window.close();
}
console.log('Reading memory passed: validation, deliberate reading, explicit resume, completion, route cleanup, dismiss, and blocked storage.');
