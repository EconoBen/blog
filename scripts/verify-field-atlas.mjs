import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const source = await readFile('app/components/FieldAtlasExplorer.tsx', 'utf8');
const contentModule = { exports: {} };
new Function('exports', ts.transpileModule(await readFile('app/pond-studies/studyContent.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText)(contentModule.exports);
const provider = { exports: {} };
new Function('require', 'module', 'exports', ts.transpileModule(await readFile('app/components/FieldPondProvider.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
}).outputText)(require, provider, provider.exports);
const component = { exports: {} };
new Function('require', 'module', 'exports', ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
}).outputText)(id => {
  if (id.endsWith('.css')) return {};
  if (id === './FieldPondProvider') return provider.exports;
  if (id === '../pond-studies/studyContent') return contentModule.exports;
  if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
  return require(id);
}, component, component.exports);

const essays = ['A', 'B', 'C', 'D', 'E'].map(slug => ({
  slug, title: `The full title of essay ${slug}`, shortTitle: `Essay ${slug}`,
  summary: `A real summary of essay ${slug}.`, href: `/posts/${slug}`, date: '2026-01-01', tags: ['Memory'], readingTime: 5,
}));
const connections = ['B', 'C', 'D', 'E'].map(to => ({
  id: `topic-A-${to}`, from: 'A', to, kind: 'shared-topic',
  label: 'Both cover memory.', reverseLabel: 'Both cover memory.',
  evidence: { type: 'shared-tags', topics: ['Memory'], sourceSlugs: ['A', to] },
}));
const reportURL = 'https://www.oreilly.com/library/view/what-are-ai/9781098159726/';
const actualLabels = contentModule.exports.buildPondStudyContent([
  { slug: 'agent-memory-is-in-early-release', title: 'Agent Memory', date: '2026-01-01', tags: ['AI agents', 'publishing'], content: `That work became [*What Are AI Agents?*](${reportURL})` },
  { slug: 'what_are_ai_agents_an_introduction', title: 'What Are AI Agents?', date: '2025-01-01', tags: ['AI agents', 'publishing'], content: `you can find it [here](${reportURL})` },
]);
const topicReason = actualLabels.connections.find(item => item.kind === 'shared-topic');
const reportReason = actualLabels.connections.find(item => item.kind === 'explicit-reference');
assert.equal(topicReason.label, 'Both cover AI agents and publishing.', 'Shared-topic explanations name the actual subjects in readable language');
assert.match(reportReason.label, /Introduces the report “What Are AI Agents\?” cited in the selected article\./);
assert.match(reportReason.reverseLabel, /Cites the report “What Are AI Agents\?” introduced in the selected article\./);
assert.doesNotMatch(`${reportReason.label} ${reportReason.reverseLabel}`, /\bhere\b|\bthis report\b/, 'Report explanations work without an ambiguous spatial reference');
connections.push({
  id: 'reference-A-B', from: 'A', to: 'B', kind: 'explicit-reference',
  label: 'Introduces Report, which the selected article cites.', reverseLabel: 'Cites Report, which the selected article introduces.',
  evidence: { type: 'shared-publication-reference', sourceSlug: 'A', targetSlug: 'B', href: 'https://example.org/report', resourceTitle: 'Report', excerpt: 'A cites the report.', targetExcerpt: 'B introduces the report.' },
});

const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let current;
let selectionRevision;
function Harness() {
  const value = provider.exports.useFieldPond();
  current = value.selected;
  selectionRevision = value.selectionRevision;
  return React.createElement(React.Fragment, null,
    React.createElement('button', { id: 'hero-discovery', onClick: value.discover }, 'Find an essay'),
    React.createElement(component.exports.FieldAtlasExplorer));
}
const root = createRoot(document.getElementById('root'));
try {
  await act(async () => root.render(React.createElement(provider.exports.FieldPondProvider, { essays, connections }, React.createElement(Harness))));
  assert.equal(document.getElementById('field-atlas-title').textContent, 'Related articles', 'The section says directly what it offers');
  assert.equal(document.querySelector('.field-atlas-location').textContent, 'Selected article');
  assert.equal(document.querySelector('.field-atlas-channels'), null, 'Results use a clear list, without a decorative branch diagram');
  assert.doesNotMatch(document.querySelector('#field-atlas').textContent, /follow a thought|field atlas|place to begin|places to begin|you are here|your path|opens onto/i, 'Interface copy avoids figurative navigation');
  assert.equal(document.querySelectorAll('.field-atlas-neighbor').length, 3, 'At most three connected essays are shown');
  const first = document.querySelector('.field-atlas-neighbor');
  assert.ok(first.textContent.includes('Introduces Report, which the selected article cites.'), 'Verified reference names its report and describes its direction');
  assert.match(first.querySelector('.field-atlas-reason').textContent, /Why related/);
  assert.equal(first.querySelector('button').textContent.trim(), 'View related articles');
  assert.equal(first.querySelector('a').textContent.trim(), 'Read article');
  assert.match(first.querySelector('button').getAttribute('aria-label'), /^View related articles for /, 'Accessible actions include their visible labels and identify the article');
  const resultRegion = document.getElementById(first.querySelector('button').getAttribute('aria-controls'));
  assert.ok(resultRegion.contains(document.querySelector('.field-atlas-selected')) && resultRegion.contains(first), 'Related-article controls identify the selected article and the results they update');
  assert.equal(document.querySelector('.field-atlas-index summary').textContent, `Browse these ${essays.length} articles`, 'The index describes this curated selection, not the complete blog');
  assert.equal(document.querySelector('.field-atlas-index button').getAttribute('aria-controls'), resultRegion.id);
  assert.equal(document.querySelector('.field-atlas-selected h3').textContent, essays[0].title, 'The selected title is canonical, not the map abbreviation');
  assert.equal(document.querySelector('.field-atlas-selected a').getAttribute('href'), '/posts/A');
  assert.equal(document.querySelectorAll('.field-atlas-neighbor a').length, 3, 'Every displayed neighbor has a direct article link');
  const beforeReselection = selectionRevision;
  await act(async () => document.querySelector('.field-atlas-index button').click());
  assert.equal(current.slug, 'A');
  assert.equal(selectionRevision, beforeReselection + 1, 'Explicitly choosing the current essay still cancels an unfinished hero discovery');
  assert.equal(document.activeElement, document.querySelector('.field-atlas-selected h3'));
  const follow = first.querySelector('button');
  follow.focus();
  await act(async () => follow.click());
  assert.equal(current.slug, 'B', 'Following a connection updates shared selection');
  assert.equal(document.activeElement, document.querySelector('.field-atlas-selected h3'), 'Selection moves keyboard focus to the new preview instead of losing it with the removed button');
  assert.equal(window.location.pathname, '/', 'Choosing an essay previews it without navigating');
  assert.match(document.querySelector('.field-atlas-neighbor').textContent, /Cites Report, which the selected article introduces\./, 'Reverse traversal describes the named reference accurately');
  assert.equal(document.querySelector('.field-atlas-trail').getAttribute('aria-label'), 'Previous selections');
  assert.equal(document.querySelectorAll('.field-atlas-trail li').length, 1, 'Selection history shows the previous article without claiming it was read');
  await act(async () => document.querySelector('.field-atlas-trail button').click());
  assert.equal(current.slug, 'A');
  assert.equal(document.querySelector('.field-atlas-trail'), null, 'Returning to the path root removes later steps');
  const hero = document.getElementById('hero-discovery');
  hero.focus();
  await act(async () => hero.click());
  assert.equal(document.querySelector('.field-atlas-selected h3').textContent, essays[1].title, 'The atlas reflects hero selection');
  assert.equal(document.activeElement, hero, 'External discovery does not steal keyboard focus');
  assert.equal(document.querySelector('.field-atlas-trail'), null, 'An unrelated external discovery does not invent a reading-path edge');
  assert.equal(document.querySelectorAll('.field-atlas-index a').length, essays.length, 'The complete collection remains available as normal article links');
  await act(async () => document.querySelectorAll('.field-atlas-index button')[2].click());
  assert.equal(current.slug, 'C', 'The full index can start an independent reading path');
  assert.equal(document.activeElement, document.querySelector('.field-atlas-selected h3'));
  assert.equal(document.querySelector('.field-atlas-trail'), null);
  await act(async () => root.render(React.createElement(provider.exports.FieldPondProvider, {
    essays: [essays[0]], connections: [],
  }, React.createElement(component.exports.FieldAtlasExplorer))));
  assert.equal(document.querySelectorAll('.field-atlas-neighbor').length, 0, 'An isolated essay never receives an invented connection');
  assert.match(document.querySelector('.field-atlas-empty').textContent, /No related articles in this selection/);
  await act(async () => root.render(React.createElement(provider.exports.FieldPondProvider, {
    essays: [], connections: [],
  }, React.createElement(component.exports.FieldAtlasExplorer))));
  assert.equal(document.querySelector('#field-atlas'), null, 'An empty collection is handled without a broken preview');
  console.log('Related articles passed: clear actions and layout, specific directional reasons, bounded results, shared selection, native focus, direct links and truthful selection history.');
} finally {
  await act(async () => root.unmount());
  dom.window.close();
}
