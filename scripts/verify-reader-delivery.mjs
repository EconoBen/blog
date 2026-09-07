import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const origin = process.env.SITE_URL ?? 'http://127.0.0.1:3107';
const getDocument = async path => {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  return new JSDOM(await response.text()).window.document;
};
const tts = await getDocument('/posts/adding-text-to-speech-to-your-blog-openai-tts-pipeline');
assert.equal(tts.querySelectorAll('pre pre').length, 0, 'Fenced code must have a single scrollable pre, without nested wrappers');
assert.ok(tts.querySelectorAll('.code-block').length >= 10, 'All existing code samples remain rendered');
assert.equal(tts.querySelectorAll('.pipeline-diagram').length, 1, 'Custom TTS diagram survives server rendering');
assert.ok(tts.querySelector('.code-block .token'), 'Code keeps syntax highlighting before hydration');

const review = await getDocument('/posts/2025-year-in-review');
const photo = [...review.images].find(image => image.getAttribute('src')?.includes('florence_engagement'));
assert.ok(photo, 'Original article photo remains present');
assert.ok(Number(photo.getAttribute('width')) > 0 && Number(photo.getAttribute('height')) > 0, 'Article photo reserves its intrinsic aspect ratio');
assert.equal(photo.getAttribute('loading'), 'lazy', 'Below-fold media loads only as needed');
assert.ok(photo.getAttribute('src').startsWith('/_next/image?'), 'Large local media uses responsive optimization');

const prose = await getDocument('/posts/agent-memory-is-in-early-release');
const scripts = [...prose.querySelectorAll('script[src]:not([nomodule])')];
let scriptBytes = 0;
for (const script of scripts) {
  const response = await fetch(new URL(script.getAttribute('src'), origin));
  assert.equal(response.status, 200);
  scriptBytes += (await response.arrayBuffer()).byteLength;
}
assert.ok(scriptBytes < 750_000, `Prose must not ship Markdown/KaTeX/all-language parsing engines (${scriptBytes} bytes)`);
const localLinks = [...prose.querySelectorAll('#reading-content a')].filter(anchor => /^(?:\/|#)/.test(anchor.getAttribute('href') ?? ''));
assert.ok(localLinks.length > 0, 'Published prose provides a real internal-link sample');
assert.ok(localLinks.every(anchor => anchor.target !== '_blank'), 'Local reading links remain in this tab');
const legacy = await fetch(new URL('/posts/extending_%22GPTs_Are_GPTs%22_to_Firms', origin), { redirect: 'manual' });
assert.equal(legacy.status, 308, 'Previously published quoted-slug links redirect permanently');
assert.equal(legacy.headers.get('location'), '/posts/extending-gpts-are-gpts-to-firms');

for (const query of ['memory', 'python']) {
  const response = await fetch(new URL(`/api/search?q=${query}`, origin));
  const data = await response.json();
  assert.ok(data.results.length > 0, `${query} still returns matches`);
  assert.ok(data.posts.every(post => !('content' in post)), 'Search metadata must not include unused full article bodies');
}
console.log(`Reader delivery passed: server syntax/diagram rendering, bounded article JS (${scriptBytes} bytes), optimized dimensioned media, and lean search results.`);
