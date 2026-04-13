import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(new URL('..', import.meta.url).pathname);
const read = (relativePath) => readFileSync(resolve(repoRoot, relativePath), 'utf8');

const codeToolsSource = read('app/utils/codeTools.ts');
const siteUrlSource = read('app/utils/siteUrl.ts');
const detailPageSource = read('app/code-ai/[id]/page.tsx');
const searchRouteSource = read('app/api/search/route.ts');
const sitemapSource = read('app/sitemap.ts');
const rssSource = read('app/rss.xml/route.ts');
const robotsSource = read('app/robots.ts');

assert.match(codeToolsSource, /getCodeToolsItems/);
assert.match(codeToolsSource, /getCodeToolsStaticParams/);
assert.match(codeToolsSource, /getCodeToolsItemById/);
assert.match(codeToolsSource, /getCodeToolsUrl/);

assert.match(siteUrlSource, /DEFAULT_SITE_URL/);
assert.match(siteUrlSource, /getAbsoluteUrl/);

assert.match(detailPageSource, /getCodeToolsStaticParams/);
assert.match(detailPageSource, /getCodeToolsItemById/);
assert.match(detailPageSource, /alternates:/);
assert.match(detailPageSource, /canonical:/);
assert.match(detailPageSource, /getSiteUrl/);

assert.match(searchRouteSource, /unifiedSearchService/);
assert.match(searchRouteSource, /results:/);
assert.match(searchRouteSource, /Cache-Control': 'no-store'/);

assert.match(sitemapSource, /getCodeToolsItems/);
assert.match(sitemapSource, /getCodeToolsLatestDate/);
assert.match(sitemapSource, /getCodeToolsUrl/);
assert.match(sitemapSource, /getSiteUrl/);

assert.match(rssSource, /escapeXml/);
assert.match(rssSource, /latestPostDate/);
assert.match(rssSource, /getSiteUrl/);

assert.match(robotsSource, /getSiteUrl/);

console.log('continuity smoke checks passed');
