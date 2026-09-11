import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const modules = new Map();
function load(file, overrides = {}) {
  const resolved = path.resolve(file);
  if (!Object.keys(overrides).length && modules.has(resolved)) return modules.get(resolved);
  const compiled = ts.transpileModule(fs.readFileSync(resolved, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const context = { exports: {}, URL, URLSearchParams, encodeURIComponent, require: (name) => {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (name.endsWith('.css')) return {};
    if (name.startsWith('.')) {
      const base = path.resolve(path.dirname(resolved), name);
      const dependency = ['.ts', '.tsx'].map(extension => `${base}${extension}`).find(candidate => fs.existsSync(candidate));
      assert.ok(dependency, `Resolve local dependency ${name}`);
      return load(dependency);
    }
    return require(name);
  }};
  vm.runInNewContext(compiled, context, { filename: resolved });
  if (!Object.keys(overrides).length) modules.set(resolved, context.exports);
  return context.exports;
}

const { bookReleaseSummary } = load('app/book/bookReleaseSummary.ts');
const part = (...statuses) => ({ chapters: statuses.map(status => ({ status })) });
assert.equal(bookReleaseSummary([]), 'No chapters available yet.');
assert.equal(bookReleaseSummary([part('submitted', 'writing', '')]), 'No chapters available yet.', 'A submitted or written chapter is not published');
assert.equal(bookReleaseSummary([part('live', 'writing')]), '1 chapter available now.');
assert.equal(bookReleaseSummary([part('live', 'writing'), part('live', '', 'live')]), '3 chapters available now.', 'Count live chapters across parts without inventing a contiguous range');
const release = [part('live', 'live', 'live'), part('writing', 'submitted')];
assert.equal(bookReleaseSummary(release), '3 chapters available now.');
release[1].chapters[0].status = 'live';
assert.equal(bookReleaseSummary(release), '4 chapters available now.', 'Publishing the next chapter must update the presentation without separate copy edits');

const book = load('app/book/bookData.ts');
function checkPresentation(data, component, style) {
  const dom = new JSDOM(renderToStaticMarkup(React.createElement(component, { style })));
  try {
    const feature = dom.window.document.querySelector('figure.arrival-book-feature');
    assert.ok(feature, 'Expose one presentation element for the parent choreography');
    assert.equal(feature.querySelector('h2').textContent, data.AGENT_MEMORY.title);
    for (const field of ['author', 'publisher', 'releaseLabel']) {
      assert.ok(feature.textContent.includes(data.AGENT_MEMORY[field]), `Use the canonical ${field}`);
    }
    assert.ok(feature.textContent.includes(bookReleaseSummary(data.chapters)), 'The release line comes from chapter statuses');
    const cover = feature.querySelector('img');
    assert.equal(cover.getAttribute('src'), data.AGENT_MEMORY.coverSrc, 'Keep the authoritative cover source');
    assert.equal(cover.getAttribute('alt'), data.AGENT_MEMORY.coverAlt);
    assert.equal(Number(cover.getAttribute('width')) / Number(cover.getAttribute('height')), 1080 / 1350, 'Keep the original cover image proportions');
    assert.equal(feature.querySelectorAll('a,button,input,[tabindex],[role="button"]').length, 0, 'The short presentation has no temporary interaction targets');
    assert.equal(feature.querySelectorAll('[aria-live]').length, 0, 'The decorative opening must not make an unexpected live announcement');
    if (style) {
      assert.equal(feature.style.left, style.left);
      assert.equal(feature.style.transform, style.transform);
      assert.equal(feature.style.opacity, String(style.opacity));
    } else {
      assert.equal(feature.getAttribute('style'), null, 'The component must not choose its own pose');
    }
  } finally {
    dom.window.close();
  }
}

const { ArrivalBookFeature } = load('app/components/ArrivalBookFeature.tsx');
checkPresentation(book, ArrivalBookFeature);
checkPresentation(book, ArrivalBookFeature, { left: '50%', transform: 'translate(-50%, -50%) rotate(2deg)', opacity: 0.75 });

// Change the authoritative data itself to catch presentation literals that drift
// from the book page after a new release or metadata correction.
const revised = {
  AGENT_MEMORY: { ...book.AGENT_MEMORY, title: 'Revised book title', author: 'Updated author', publisher: 'Updated publisher', releaseLabel: 'Updated release', coverSrc: '/assets/revised-cover.png', coverAlt: 'Revised canonical cover' },
  chapters: [part('live', 'submitted'), part('writing')],
};
const { ArrivalBookFeature: RevisedFeature } = load('app/components/ArrivalBookFeature.tsx', { '../book/bookData': revised });
checkPresentation(revised, RevisedFeature);
console.log('Arrival book feature passed: canonical cover and metadata, live-only release count across parts, future chapter release, singular/empty states, parent-owned pose, and no temporary controls.');
