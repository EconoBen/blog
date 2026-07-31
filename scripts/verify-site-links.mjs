import assert from 'node:assert/strict';
import process from 'node:process';
import { JSDOM } from 'jsdom';

const base = new URL(process.env.SITE_URL ?? 'http://127.0.0.1:3021');
const seedPaths = [
  '/',
  '/book',
  '/posts',
  '/talks',
  '/publications',
  '/code-ai',
  '/about',
  '/tags',
  '/search',
  '/archive',
  '/robots.txt',
  '/sitemap.xml',
  '/rss.xml',
];
const skippedSchemes = /^(?:mailto|tel|javascript|data):/i;
const queue = [...seedPaths];
const queued = new Set(queue);
const checked = new Map();
const broken = [];

const enqueueLinks = (html, sourcePath) => {
  const document = new JSDOM(html).window.document;

  for (const anchor of document.querySelectorAll('a[href]')) {
    const href = (anchor.getAttribute('href') ?? '').trim();
    if (!href || href.startsWith('#') || skippedSchemes.test(href)) {
      continue;
    }

    let target;
    try {
      target = new URL(href, new URL(sourcePath, base));
    } catch {
      broken.push({ sourcePath, href, status: 'invalid URL' });
      continue;
    }

    if (target.origin !== base.origin || target.pathname.startsWith('/api/')) {
      continue;
    }

    const normalized = `${target.pathname}${target.search}`;
    if (!queued.has(normalized)) {
      queued.add(normalized);
      queue.push(normalized);
    }
  }
};

while (queue.length) {
  assert.ok(checked.size < 400, 'Link crawl exceeded the 400-route safety limit');
  const path = queue.shift();
  if (!path || checked.has(path)) {
    continue;
  }

  try {
    const response = await fetch(new URL(path, base), { redirect: 'follow' });
    checked.set(path, response.status);
    if (!response.ok) {
      broken.push({ sourcePath: path, href: path, status: response.status });
      continue;
    }

    if (response.headers.get('content-type')?.includes('text/html')) {
      enqueueLinks(await response.text(), path);
    }
  } catch (error) {
    checked.set(path, 'request failed');
    broken.push({
      sourcePath: path,
      href: path,
      status: error instanceof Error ? error.message : 'request failed',
    });
  }
}

assert.deepEqual(
  broken,
  [],
  `Broken internal links:\n${broken
    .map(({ sourcePath, href, status }) => `- ${sourcePath} -> ${href} (${status})`)
    .join('\n')}`,
);

console.log(`Internal link crawl passed across ${checked.size} routes.`);
