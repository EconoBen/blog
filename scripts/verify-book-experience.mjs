import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { JSDOM } from 'jsdom';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const modules = new Map();
function load(file, overrides = {}) {
  if (!Object.keys(overrides).length && modules.has(file)) return modules.get(file);
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const context = { exports: {}, URL, URLSearchParams, encodeURIComponent, require: (name) => {
    if (overrides[name]) return overrides[name];
    if (name.endsWith('.css')) return {};
    if (name.startsWith('.')) {
      const path = new URL(name, new URL(file, `file://${process.cwd()}/`)).pathname;
      return load(`${path}.ts`);
    }
    return require(name);
  }};
  vm.runInNewContext(compiled, context, { filename: file });
  if (!Object.keys(overrides).length) modules.set(file, context.exports);
  return context.exports;
}

const book = load('app/book/bookData.ts');
assert.equal(typeof book.chapterFeedbackHref, 'function', 'Provide a chapter-specific email action');
const { CONTACT_EMAIL } = load('app/config/contact.ts');
const allChapters = book.chapters.flatMap(part => part.chapters);
assert.deepEqual(Array.from(allChapters.filter(chapter => chapter.status === 'live'), chapter => chapter.num), ['01', '02', '03']);
assert.equal(allChapters.find(chapter => chapter.status !== 'live').num, '04');
for (const chapter of allChapters) {
  const feedback = new URL(book.chapterFeedbackHref(chapter));
  assert.equal(feedback.protocol, 'mailto:');
  assert.equal(feedback.pathname, CONTACT_EMAIL, 'Use the canonical public contact');
  assert.ok(feedback.searchParams.get('subject').includes(`Chapter ${Number(chapter.num)}`));
  assert.ok(feedback.searchParams.get('subject').includes(chapter.title));
  assert.ok(feedback.searchParams.get('body').includes(chapter.title));
  if (chapter.status === 'live') {
    const destination = new URL(chapter.readHref);
    assert.equal(destination.hostname, 'www.oreilly.com');
    assert.equal(destination.pathname, `/library/view/agent-memory/0642572370473/ch${chapter.num}.html`);
  } else {
    assert.equal(chapter.readHref, undefined, 'Never invent read destinations for unpublished chapters');
  }
}
const tricky = new URL(book.chapterFeedbackHref({ num: '06', title: 'Evidence & correction? #1 + more' }));
assert.ok(tricky.href.includes('%20'), 'Mailto spaces use percent encoding for email clients');
assert.ok(!tricky.search.includes('+'), 'A literal plus is encoded; spaces must not become plus signs');
assert.equal(tricky.searchParams.get('subject'), 'Agent Memory — Chapter 6: Evidence & correction? #1 + more');
assert.equal(tricky.searchParams.size, 2, 'Punctuation must not create extra mail fields');

// Render initial and confirmed states with controlled hooks; no request is sent.
for (const status of ['idle', 'success']) {
  for (const variant of ['light', 'dark']) {
    let stateCall = 0;
    const { SubscribeForm } = load('app/components/SubscribeForm.tsx', {
      react: { ...React, useState: () => [stateCall++ === 0 ? '' : status, () => {}], useId: () => 'test-error', useRef: () => ({ current: null }), useEffect: () => {} },
      '@vercel/analytics/react': { track: () => {} },
    });
    const html = renderToStaticMarkup(React.createElement(SubscribeForm, { context: 'book', variant }));
    assert.match(html, /chapter/i, 'Book signup must identify chapter updates');
    assert.match(html, /occasional/i);
    assert.match(html, /writing/i, 'Book signup must disclose the shared writing subscription');
    assert.match(html, /talks/i, 'Book signup must disclose talk updates');
    assert.doesNotMatch(html, /book.only|chapter.only/i);
  }
}

const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/book' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import('react-dom/client');
const { ChapterShoreline } = load('app/components/ChapterShoreline.tsx', {
  './TrackedAction': { TrackedAction: ({ eventName, eventProperties, ...props }) => React.createElement('a', props) },
});
const root = createRoot(document.getElementById('root'));
try {
  await React.act(async () => root.render(React.createElement(ChapterShoreline)));
  const selected = () => document.querySelector('[aria-pressed="true"]');
  const feedback = () => new URL(document.querySelector('.chapter-shoreline-feedback').href);
  const read = () => document.querySelector('.chapter-shoreline-actions a');
  assert.match(selected().getAttribute('aria-label'), /^Chapter 3:/, 'Select the newest published chapter initially');
  assert.match(read().href, /ch03\.html/);
  assert.match(feedback().searchParams.get('subject'), /Chapter 3:/);
  const buttons = [...document.querySelectorAll('.chapter-shoreline-stop')];
  assert.equal(buttons.length, 10, 'All chapters remain available to keyboard users');
  await React.act(async () => buttons[0].click());
  assert.match(read().href, /ch01\.html/);
  assert.match(feedback().searchParams.get('subject'), /Chapter 1: The Work of Remembering/);
  await React.act(async () => buttons[3].click());
  assert.match(document.querySelector('.chapter-shoreline-position').textContent, /Next release/);
  assert.equal(read().getAttribute('href'), '#subscribe', 'A planned chapter cannot masquerade as a published read link');
  assert.match(feedback().searchParams.get('subject'), /Chapter 4: How Memory Gets Written/);
} finally {
  await React.act(async () => root.unmount());
  dom.window.close();
}
console.log('Book experience passed: canonical feedback encoding, three verified chapter links, ten selectable chapters, updated read/feedback actions, and truthful signup/confirmation in both variants. No requests sent.');
