import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const origin = new URL(process.env.SITE_URL ?? 'http://127.0.0.1:3111');
const fixtures = [
  ['/tags/LLM', '/tags/LLMs', 7],
  ['/tags/LLMs', '/tags/LLMs', 7],
  ['/tags/Agents', '/tags/AI%20Agents', 4],
  ['/tags/AI%20Agents', '/tags/AI%20Agents', 4],
  ['/tags/Career%20Journeys', '/tags/Career', 2],
];
const articlesByCanonical = new Map();
for (const [pathname, canonical, count] of fixtures) {
  const response = await fetch(new URL(pathname, origin));
  assert.equal(response.status, 200, `Existing topic URL resolves: ${pathname}`);
  const document = new JSDOM(await response.text()).window.document;
  assert.equal(new URL(document.querySelector('link[rel="canonical"]').href).pathname, canonical, `${pathname} identifies its normalized topic`);
  const articles = [...document.querySelectorAll('article h3')].map(heading => heading.textContent.trim());
  assert.equal(articles.length, count, `${pathname} retains the expected corpus entries`);
  assert.equal(new Set(articles).size, count, `${pathname} does not duplicate articles after merging aliases`);
  if (articlesByCanonical.has(canonical)) assert.deepEqual(articles, articlesByCanonical.get(canonical), 'Alias and canonical URLs show the same ordered articles');
  articlesByCanonical.set(canonical, articles);
}
console.log('Served topic aliases passed: all five existing URLs resolve with normalized canonicals, correct counts, no duplicates and identical alias content.');
