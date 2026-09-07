import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const origin = process.env.SITE_URL ?? 'http://127.0.0.1:3107';
const articles = fs.readdirSync('src/posts').filter(name => name.endsWith('.md'));
const broken = [];
let checked = 0;
for (const filename of articles) {
  const path = `/posts/${encodeURIComponent(filename.slice(0, -3))}`;
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  const document = new JSDOM(await response.text()).window.document;
  for (const anchor of document.querySelectorAll('#reading-content a[href^="#"]')) {
    const fragment = anchor.getAttribute('href').slice(1);
    if (!fragment) continue;
    checked++;
    if (!document.getElementById(decodeURIComponent(fragment))) broken.push(`${path} → #${fragment}`);
    assert.notEqual(anchor.target, '_blank', `In-page reading link must remain in the current tab: ${path}#${fragment}`);
  }
}
assert.deepEqual(broken, [], 'Every published table-of-contents and footnote link needs a real rendered destination');
assert.ok(checked >= 27, 'Exercise the actual long-form TOC and footnote articles');
console.log(`Article fragments passed: ${checked} in-page links across ${articles.length} published articles.`);
