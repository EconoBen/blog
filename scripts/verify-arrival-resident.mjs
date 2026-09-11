import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const modules = new Map();
const selected = { slug: 'fixture', title: 'A real article', summary: 'Article description.', date: '2026-09-01', readingTime: 4, href: '/posts/fixture' };
function load(filename) {
  filename = path.resolve(filename);
  if (modules.has(filename)) return modules.get(filename);
  const module = { exports: {} };
  modules.set(filename, module.exports);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('module', 'exports', 'require', code)(module, module.exports, id => {
    if (id.endsWith('.css')) return {};
    if (id === 'next/link') return { default: ({ children, ...props }) => React.createElement('a', props, children) };
    if (id === './FieldPondProvider') return { useFieldPond: () => ({ essays: [selected], selected, hasFound: false, selectionRevision: 0, discover() {} }) };
    if (id === './ReadingMemory') return { ReturningBookmark: () => null };
    if (id.startsWith('.')) {
      const stem = path.resolve(path.dirname(filename), id);
      return load(['.tsx', '.ts'].map(ext => stem + ext).find(file => fs.existsSync(file)));
    }
    return require(id);
  });
  return module.exports;
}
const { StudyScene } = load('app/pond-studies/StudyScene.tsx');
const { GrebePond } = load('app/components/GrebePond.tsx');
const { ARRIVAL_BODY_OUTLINE } = load('app/components/arrivalRig.ts');
const render = (component, props) => new JSDOM(renderToStaticMarkup(React.createElement(component, props))).window.document;
const master = '/assets/grebes/arrival/engraving-plate-v2.webp';
const original = '/assets/grebes/horned-grebe-engraving.webp';
for (const direction of ['dusk', 'atlas', 'cutaway', 'atlas-dusk']) {
  const document = render(StudyScene, { direction });
  assert.ok(document.querySelector(`image[href="${original}"]`), `${direction} keeps its original resident by default`);
  assert.equal(document.querySelector(`image[href="${master}"]`), null, 'Unrelated pond studies do not adopt the opening character');
}

const home = render(GrebePond);
assert.ok(home.querySelector(`image[href="${master}"]`), 'The homepage pond uses the same body master as the opening');
assert.equal(home.querySelector(`image[href="${original}"]`), null, 'The homepage reflection and main bird both use the new master');
assert.equal(home.querySelector('.field-pond-scene').getAttribute('aria-label'), 'Find an article');
assert.equal(home.querySelector('.field-pond-read').getAttribute('href'), selected.href);
const residents = [...home.querySelectorAll('.arrival-resident-engraving')];
assert.equal(residents.length, 2, 'The scene retains one resident and its reflection');
const ids = [...home.querySelectorAll('[id]')].map(node => node.id);
assert.equal(new Set(ids).size, ids.length, 'Main and reflection masks have distinct IDs');
for (const resident of residents) {
  assert.equal(resident.getAttribute('aria-hidden'), 'true');
  assert.equal(resident.getAttribute('focusable'), 'false');
  const [minX, minY, width, height] = resident.getAttribute('viewBox').split(/\s+/).map(Number);
  const scale = Number(resident.getAttribute('width')) / width;
  assert.ok(Math.abs(Number(resident.getAttribute('height')) / height - scale) < 1e-10, 'The engraving keeps the same scale on both axes');
  const contact = {
    x: Number(resident.getAttribute('x')) + (776 - minX) * scale,
    y: Number(resident.getAttribute('y')) + (850 - minY) * scale,
  };
  assert.ok(Math.abs(contact.x - 321) < 1e-8 && Math.abs(contact.y - 263) < 1e-8, 'The mirrored source contact lands at the existing pond water anchor');
  const mirror = resident.querySelector('g[transform="translate(1536 0) scale(-1 1)"]');
  assert.ok(mirror, 'The right-facing source is mirrored to match the resident direction');
  assert.ok(mirror.querySelector('.grebe-neck-look > .grebe-neck-motion'), 'The independent neck look and dive wrappers remain connected');
  assert.ok(mirror.querySelector('.grebe-neck-motion .study-carried-slip'), 'The carried note follows the articulated neck');
  assert.ok(resident.closest('.study-bird-motion')?.parentElement.classList.contains('study-bird-pointer'), 'Existing whole-body dive and pointer wrappers remain intact');
  for (const image of resident.querySelectorAll('image')) {
    assert.equal(image.getAttribute('href'), master);
    assert.equal(image.getAttribute('width'), '1536');
    assert.equal(image.getAttribute('height'), '1024');
    const clippingAncestors = [];
    for (let parent = image.parentElement; parent && parent !== resident; parent = parent.parentElement) {
      if (parent.hasAttribute('clip-path')) clippingAncestors.push(parent.getAttribute('clip-path'));
    }
    assert.ok(clippingAncestors.some(reference => {
      const id = reference.match(/^url\(#(.+)\)$/)?.[1];
      return id && home.getElementById(id)?.querySelector('path')?.getAttribute('d') === ARRIVAL_BODY_OUTLINE;
    }), 'Every engraving piece is clipped by the shared native silhouette, so the opaque plate cannot render outside the bird');
  }
}
const reflection = home.querySelector('.study-reflection');
assert.ok(reflection.querySelector('g[transform="translate(0 529) scale(1 -1)"] .arrival-resident-engraving'), 'The reflection retains the original waterline mirror transform');
assert.ok(home.querySelector('.study-water-rings') && home.querySelector('.study-near-waterline'), 'Existing contact-water layers remain present');
const { ArrivalResidentGrebe } = load('app/pond-studies/ArrivalResidentGrebe.tsx');
assert.equal(render(ArrivalResidentGrebe, { id: 'no-note' }).querySelector('.study-carried-slip'), null, 'The note remains optional');
console.log('Arrival resident passed: homepage-only shared master, exact mirrored landing anchor, clipped plate, unique reflection masks, retained neck/pointer/dive wrappers, optional note and article accessibility.');
