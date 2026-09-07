import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const imports = new Map();
for (const name of ['react-markdown', 'remark-gfm', 'remark-math', 'rehype-raw', 'rehype-katex']) {
  imports.set(name, { __esModule: true, ...await import(name) });
}
const load = (relative, mocks = {}) => {
  const filename = path.resolve(relative);
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, esModuleInterop: true,
  } }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled)(id => {
    if (id in mocks) return mocks[id];
    if (imports.has(id)) return imports.get(id);
    if (id.startsWith('react-syntax-highlighter/dist/esm/')) return require(id.replace('/esm/', '/cjs/'));
    if (id.endsWith('.css') || id === 'server-only') return {};
    if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), `${id}.tsx`), mocks);
    return require(id);
  }, module, module.exports);
  return module.exports;
};

const { default: MarkdownRenderer } = load('app/components/MarkdownRenderer.tsx', {
  './ArticleImage': { ArticleImage: ({ src, alt }) => React.createElement('img', { src, alt }) },
  './CopyCodeButton': { CopyCodeButton: () => React.createElement('button', null, 'Copy') },
});
const content = [
  '# A heading',
  'Some `inline_code` with **strong text** and $x^2$.',
  '[Local](/book#subscribe), [section](#a-heading), [website](https://example.org).',
  '[Own website](https://econoben.dev/posts/an-article?source=reading#section).',
  '```python\nprint("hello")\n```',
  '```\na one-line example\n```',
  'A footnote.[^1]',
  '[^1]: The footnote text.',
  '```tts-pipeline-diagram\n```',
].join('\n\n');
const html = renderToStaticMarkup(React.createElement(MarkdownRenderer, { content }));
const document = new JSDOM(html).window.document;
assert.equal(document.querySelectorAll('pre pre').length, 0);
assert.equal(document.querySelectorAll('.code-block').length, 2, 'Single-line unlabelled fences are still blocks');
assert.equal(document.querySelectorAll('.code-block pre').length, 2);
assert.match(document.querySelector('.code-block code').textContent, /print\("hello"\)/);
assert.ok(document.querySelector('.code-block .token'), 'Syntax colors are generated before hydration');
assert.ok(document.querySelector('p > code'), 'Inline code remains inline');
assert.ok(document.querySelector('.katex'), 'Mathematical notation remains rendered');
assert.equal(document.querySelector('h2').id, 'a-heading');
assert.ok(document.querySelector('#user-content-fn-1'), 'Footnote destination survives');
assert.equal(document.querySelector('a[href="#a-heading"]').target, '');
assert.equal(document.querySelector('a[href="/book#subscribe"]').target, '');
assert.equal(document.querySelector('a[href="https://example.org"]').target, '_blank');
assert.ok(document.querySelector('a[href="/posts/an-article?source=reading#section"]'), 'Own-domain links stay in the current site/preview');
assert.equal(document.querySelectorAll('.pipeline-diagram').length, 1);

const { ArticleImage } = load('app/components/ArticleImage.tsx', { 'next/image': { __esModule: true, default: 'next-image' } });
const photo = await ArticleImage({ src: '/assets/2026/01/florence_engagement.jpeg', alt: 'Florence' });
assert.equal(photo.type, 'next-image');
assert.ok(photo.props.width > 1000 && photo.props.height > 1000);
assert.equal(photo.props.loading, 'lazy');
assert.equal(photo.props.alt, 'Florence');
const remote = await ArticleImage({ src: 'https://example.org/photo.jpg', width: 640, height: 480 });
assert.equal(remote.type, 'img', 'Unknown remote media remains a supported fallback');
assert.equal(remote.props.width, 640);
const missing = await ArticleImage({ src: '/assets/not-present.png' });
assert.equal(missing.type, 'img', 'A missing legacy image cannot fail the whole article build');
console.log('Article rendering passed: server code, inline code, math, footnotes, anchors, TTS diagram, intrinsic local dimensions, and remote/missing-media fallbacks.');
