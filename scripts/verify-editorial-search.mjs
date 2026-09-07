import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

const require = createRequire(import.meta.url);
let query = 'memory';
const pending = [];
const dom = new JSDOM('<div id="root"></div>', { url: 'https://econoben.dev/search?q=memory' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.fetch = (url, options) => new Promise((resolve, reject) => pending.push({ url, options, resolve, reject }));
const source = fs.readFileSync('app/search/page.tsx', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const loaded = { exports: {} };
new Function('require', 'module', 'exports', compiled)((id) => {
  if (id.endsWith('.css')) return {};
  if (id === 'next/navigation') return { useRouter: () => ({ replace: () => {} }), useSearchParams: () => new URLSearchParams({ q: query }) };
  if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
  if (id.endsWith('/EditorialPageFrame')) return { EditorialPageFrame: ({ children }) => React.createElement('main', null, children) };
  return require(id);
}, loaded, loaded.exports);
const root = createRoot(document.getElementById('root'));
const render = () => act(async () => { root.render(React.createElement(loaded.exports.default)); });
const answer = (request, status, results = []) => act(async () => {
  request.resolve({ ok: status === 200, status, json: async () => ({ results }) });
});
try {
  await render();
  assert.notEqual(document.activeElement, document.querySelector('input'), 'Search must not force the mobile keyboard open');
  await answer(pending.shift(), 503);
  assert.match(document.body.textContent, /Search is unavailable/, 'Network failure must be distinct from no matches');
  assert.doesNotMatch(document.body.textContent, /No results for/);
  const retry = [...document.querySelectorAll('button')].find(button => button.textContent === 'Try again');
  assert.ok(retry, 'Search error provides a retry action');
  await act(async () => retry.click());
  await answer(pending.shift(), 200, [{ type: 'post', title: 'Memory essay', url: '/posts/memory' }]);
  assert.ok(document.querySelector('a[href="/posts/memory"]'), 'Retry displays recovered results');
  query = 'retrieval';
  await render();
  const stale = pending.shift();
  query = '';
  await render();
  assert.equal(stale.options.signal.aborted, true, 'Clearing the query aborts pending search');
  assert.doesNotMatch(document.body.textContent, /Searching/, 'Clearing the query resets loading');
  await answer(stale, 200, [{ type: 'post', title: 'Stale answer', url: '/posts/stale' }]);
  assert.equal(document.querySelector('a[href="/posts/stale"]'), null, 'A late response cannot repopulate a cleared search');
  query = 'nothing';
  await render();
  await answer(pending.shift(), 200);
  assert.match(document.body.textContent, /No results for/, 'Successful empty searches retain useful no-match guidance');
  assert.doesNotMatch(document.body.textContent, /Search is unavailable/);
  console.log('Editorial search passed: honest failures, retry recovery, clearing, stale responses and empty matches.');
} finally {
  await act(async () => root.unmount());
  dom.window.close();
}
