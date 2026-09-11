import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import http from 'node:http';
import https from 'node:https';

// Node fetch adds Cache-Control: no-cache when If-None-Match is supplied,
// intentionally bypassing freshness and yielding200. A normal conditional
// request exercises the server's returning-reader304 behavior directly.
function conditionalStatus(url, etag) {
  return new Promise((resolve, reject) => {
    const request = (url.protocol === 'https:' ? https : http).get(url, { headers: { 'If-None-Match': etag } }, response => {
      response.resume();
      response.on('end', () => resolve(response.statusCode));
    });
    request.on('error', reject);
    request.setTimeout(5_000, () => request.destroy(new Error('Conditional request timed out')));
  });
}

const origin = new URL(process.env.SITE_URL ?? 'http://127.0.0.1:3111');
const mutable = [
  '/posts/agent-memory-is-in-early-release',
  '/assets/agent-memory-cover-early-release.png',
  '/social/ben-labaschin-agent-memory-v3.png',
  '/icons/grebe-v1.svg',
  '/favicon.ico',
  '/manifest.json',
  '/rss.xml',
];
let document;
for (const pathname of mutable) {
  const response = await fetch(new URL(pathname, origin));
  assert.equal(response.status, 200, pathname);
  const policy = response.headers.get('cache-control') ?? '';
  assert.doesNotMatch(policy, /immutable|(?:^|[,\s])max-age=[1-9]/i, `${pathname}: ${policy}`);
  assert.match(policy, /(?:max-age=0|no-cache|no-store)/, `${pathname} must revalidate`);
  const body = await response.arrayBuffer();
  if (pathname.startsWith('/posts/')) document = new JSDOM(Buffer.from(body).toString()).window.document;
  const etag = response.headers.get('etag');
  if (etag) {
    const status = await conditionalStatus(new URL(pathname, origin), etag);
    assert.equal(status, 304, `${pathname}: an unchanged representation supports returning-reader revalidation`);
  }
}
const hashedAsset = document.querySelector('script[src^="/_next/static/"]')?.getAttribute('src');
assert.ok(hashedAsset, 'The built article references a fingerprinted framework asset');
const asset = await fetch(new URL(hashedAsset, origin));
assert.equal(asset.status, 200);
assert.match(asset.headers.get('cache-control') ?? '', /max-age=31536000.*immutable/, 'Framework assets keep long-lived fingerprint caching');
console.log('Served cache checks passed: editable URLs revalidate, unchanged responses support conditional requests, and fingerprinted assets stay immutable.');
