import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import sharp from 'sharp';
import { JSDOM } from 'jsdom';

// Evaluate the actual metadata exports while substituting only their data/UI
// dependencies. This exercises fallback decisions without building every page.
const require = createRequire(import.meta.url);
const root = process.cwd();
const title = 'Ben Labaschin — AI Engineering & Agent Memory';
const imageUrl = 'https://econoben.dev/social/ben-labaschin-agent-memory-v1.png';
const ui = { default: () => null };
function load(file, stubs = {}) {
  const filename = path.resolve(root, file);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled)(id => {
    if (id in stubs) return stubs[id];
    if (id.endsWith('.css') || id.includes('/components/') || id === './TalkRedirect') return ui;
    if (['next/link', 'next/navigation', '@vercel/analytics/react', 'react-markdown', 'remark-gfm', 'react-syntax-highlighter', 'react-syntax-highlighter/dist/esm/styles/prism'].includes(id)) return ui;
    if (id.startsWith('.')) {
      const target = path.resolve(path.dirname(filename), id);
      if (target.endsWith('.json')) return JSON.parse(fs.readFileSync(target, 'utf8'));
      const source = ['.ts', '.tsx'].map(extension => target + extension).find(fs.existsSync);
      assert.ok(source, `Resolve actual metadata dependency: ${id}`);
      return load(source, stubs);
    }
    return require(id);
  }, module, module.exports);
  return module.exports;
}

const { metadata } = load('app/layout.tsx');
assert.equal(metadata.title, title, 'The homepage must identify its author and book in the browser and share title');
assert.equal(metadata.openGraph.title, title);
assert.equal(metadata.twitter.title, title);
assert.equal(metadata.authors[0].name, 'Ben Labaschin');
assert.match(metadata.description, /Ben Labaschin.*Agent Memory.*O[’']Reilly/);
assert.equal(metadata.openGraph.description, metadata.description);
assert.equal(metadata.twitter.description, metadata.description);
assert.equal(metadata.metadataBase.href, 'https://econoben.dev/');
assert.equal(metadata.openGraph.url, 'https://econoben.dev');
assert.equal(metadata.openGraph.images[0].url, imageUrl);
assert.equal(metadata.openGraph.images[0].width, 1200);
assert.equal(metadata.openGraph.images[0].height, 630);
assert.match(metadata.openGraph.images[0].alt, /Ben Labaschin.*Agent Memory.*grebe/i);
assert.equal(metadata.twitter.images[0], imageUrl);
assert.equal(metadata.twitter.card, 'summary_large_image');
assert.equal(metadata.manifest, '/manifest.json');
assert.ok(metadata.icons.icon.some(icon => icon.url === '/icons/grebe-v1.svg' && icon.type === 'image/svg+xml' && icon.sizes === 'any'));
assert.ok(metadata.icons.icon.some(icon => icon.url === '/icons/grebe-v1-32.png' && icon.type === 'image/png' && icon.sizes === '32x32'));
assert.ok(metadata.icons.apple.some(icon => icon.url === '/icons/grebe-v1-180.png' && icon.type === 'image/png' && icon.sizes === '180x180'));

let post = { title: 'A specific article', slug: 'a-specific-article', summary: 'The article’s own summary.', content: 'Article text', date: new Date('2026-09-01'), tags: ['AI'], coverImage: '/assets/custom-cover.png' };
const posts = load('app/posts/[slug]/page.tsx', { '../../services/PostService': { postService: { getPostBySlug: async () => post } } });
for (const cover of ['/assets/custom-cover.png', 'https://example.org/specific-cover.png', undefined]) {
  post = { ...post, coverImage: cover };
  const result = await posts.generateMetadata({ params: Promise.resolve({ slug: post.slug }) });
  assert.equal(result.title, 'A specific article | Posts | ECONOBEN.DEV');
  assert.equal(result.openGraph.title, post.title);
  assert.equal(result.twitter.title, post.title);
  assert.equal(result.description, post.summary);
  assert.equal(result.openGraph.type, 'article');
  const expectedImage = cover ? (cover.startsWith('http') ? cover : `https://econoben.dev${cover}`) : imageUrl;
  assert.equal(typeof result.openGraph.images[0] === 'string' ? result.openGraph.images[0] : result.openGraph.images[0].url, expectedImage, 'Only articles without a custom image use the site fallback');
  assert.equal(result.twitter.images[0], expectedImage);
}

let talk = { title: 'A specific talk', event: 'Example event', description: 'The talk’s own summary.', date: '2026-09-01', topics: ['AI'], youtubeId: 'video-id' };
const talks = load('app/talks/[id]/page.tsx', {
  '../../config/talksConfig': { findTalk: () => talk, getTalkSlug: () => 'specific-talk' },
  '../../utils/siteUrl': { getSiteUrl: () => 'https://econoben.dev' },
});
for (const youtubeId of ['video-id', undefined]) {
  talk = { ...talk, youtubeId };
  const result = await talks.generateMetadata({ params: Promise.resolve({ id: 'specific-talk' }) });
  assert.equal(result.openGraph.title, 'A specific talk (Example event)');
  assert.equal(result.description, talk.description);
  assert.equal(result.openGraph.images[0].url, youtubeId ? 'https://img.youtube.com/vi/video-id/maxresdefault.jpg' : imageUrl);
  assert.equal(result.openGraph.images[0].width, youtubeId ? 1280 : 1200);
  assert.equal(result.openGraph.images[0].height, youtubeId ? 720 : 630);
}

const item = { title: 'A specific tool', description: 'The tool’s own summary.', tags: ['AI'] };
const code = load('app/code-ai/[id]/page.tsx', {
  '../../utils/codeTools': { getCodeToolsItemById: () => item, getCodeToolsUrl: () => '/code-ai/specific-tool' },
  '../../utils/siteUrl': { getSiteUrl: () => 'https://econoben.dev' },
});
const tool = await code.generateMetadata({ params: Promise.resolve({ id: 'specific-tool' }) });
assert.equal(tool.openGraph.title, item.title);
assert.equal(tool.twitter.title, item.title);
assert.equal(tool.description, item.description);
assert.equal(tool.openGraph.images[0].url, imageUrl);
assert.equal(tool.twitter.images[0], imageUrl);
const book = load('app/book/page.tsx').metadata;
assert.equal(book.title, 'Agent Memory | Early Release | ECONOBEN.DEV');
assert.equal(book.openGraph.images[0].url, '/assets/agent-memory-cover-early-release.png', 'The book keeps its specific cover');
assert.equal(book.twitter.images[0], book.openGraph.images[0].url);

const manifest = JSON.parse(fs.readFileSync('public/manifest.json', 'utf8'));
assert.equal(manifest.name, 'Ben Labaschin | econoben.dev');
assert.equal(manifest.short_name, 'Ben Labaschin');
assert.equal(manifest.theme_color, '#176b69');
assert.equal(manifest.background_color, '#f7f2e8');
const maskable = manifest.icons.filter(icon => icon.purpose === 'maskable');
const ordinary = manifest.icons.filter(icon => icon.purpose === 'any');
assert.equal(maskable.length, 1);
assert.equal(maskable[0].src, '/icons/grebe-v1-maskable-512.png');
assert.deepEqual(ordinary.map(icon => icon.sizes).sort(), ['192x192', '512x512']);
assert.ok(ordinary.every(icon => icon.src !== maskable[0].src), 'Maskable artwork must use its own safe-zone export');
console.log('Social metadata passed: author/book identity, explicit icons, manifest and preserved content-specific previews.');

if (!process.argv.includes('--metadata-only')) {
  for (const [pathname, width, height] of [
    ['/social/ben-labaschin-agent-memory-v1.png', 1200, 630],
    ['/icons/grebe-v1-32.png', 32, 32], ['/icons/grebe-v1-180.png', 180, 180],
    ...manifest.icons.map(icon => [icon.src, ...icon.sizes.split('x').map(Number)]),
  ]) {
    const asset = await sharp(path.join('public', pathname)).metadata();
    assert.equal(asset.format, 'png', pathname);
    assert.deepEqual([asset.width, asset.height], [width, height], pathname);
  }
  const svg = new JSDOM(fs.readFileSync('public/icons/grebe-v1.svg', 'utf8'), { contentType: 'image/svg+xml' });
  assert.equal(svg.window.document.documentElement.localName, 'svg');
  assert.ok(svg.window.document.documentElement.hasAttribute('viewBox'));
  assert.equal(svg.window.document.querySelector('script, foreignObject, image'), null, 'Browser icon must remain a self-contained vector');
  svg.window.close();
  const ico = fs.readFileSync('public/favicon.ico');
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  const sizes = Array.from({ length: ico.readUInt16LE(4) }, (_, index) => ico[6 + index * 16] || 256);
  for (const size of [16, 32, 48]) assert.ok(sizes.includes(size), `Conventional favicon includes ${size}px`);
  console.log('Social assets passed: actual PNG dimensions, self-contained SVG and multi-size ICO.');
}

// Optional production-server check: SITE_URL=http://localhost:3107 node scripts/verify-social-identity.mjs
if (process.env.SITE_URL) {
  const origin = new URL(process.env.SITE_URL);
  const response = await fetch(origin, { headers: { 'User-Agent': 'LinkedInBot/1.0', 'Cache-Control': 'no-cache' } });
  assert.equal(response.status, 200);
  const dom = new JSDOM(await response.text());
  const document = dom.window.document;
  const meta = (name, key = 'property') => document.querySelector(`head meta[${key}="${name}"]`)?.content;
  assert.equal(document.title, title);
  assert.equal(meta('og:title'), title);
  assert.equal(meta('og:image'), imageUrl);
  assert.equal(meta('og:image:width'), '1200');
  assert.equal(meta('og:image:height'), '630');
  assert.equal(meta('twitter:image', 'name'), imageUrl);
  for (const [rel, href] of [['icon', '/icons/grebe-v1.svg'], ['icon', '/icons/grebe-v1-32.png'], ['apple-touch-icon', '/icons/grebe-v1-180.png'], ['manifest', '/manifest.json']]) {
    assert.ok(document.querySelector(`head link[rel="${rel}"][href="${href}"]`), `Server emits ${rel} ${href}`);
  }
  for (const pathname of [new URL(imageUrl).pathname, '/icons/grebe-v1.svg', '/icons/grebe-v1-32.png', '/icons/grebe-v1-180.png', '/favicon.ico', '/manifest.json', ...manifest.icons.map(icon => icon.src)]) {
    const asset = await fetch(new URL(pathname, origin));
    assert.equal(asset.status, 200, `Crawlers can fetch ${pathname}`);
    assert.ok(!asset.headers.get('content-type')?.includes('text/html'), `${pathname} must not return an HTML fallback`);
  }
  dom.window.close();
  console.log(`Served LinkedIn crawler metadata and all identity assets passed at ${origin.origin}.`);
}
