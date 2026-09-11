import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const esm = new Map(await Promise.all(['react-markdown', 'remark-gfm', 'remark-math', 'rehype-raw', 'rehype-katex'].map(async id => [id, { __esModule: true, ...await import(id) }])));
const loaded = new Map();
function load(file) {
  const filename = path.resolve(file);
  if (loaded.has(filename)) return loaded.get(filename).exports;
  const module = { exports: {} }; loaded.set(filename, module);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const localRequire = id => {
    if (id.endsWith('.css')) return {};
    if (esm.has(id)) return esm.get(id);
    if (id.endsWith('/components/EditorialPageFrame')) return { EditorialPageFrame: () => null };
    if (id === 'next/navigation') return { notFound: () => { throw new Error('NOT_FOUND'); } };
    if (id === './CodeBlock') return { __esModule: true, default: ({ code }) => React.createElement('pre', {}, code) };
    if (id === './TTSPipelineDiagram') return { __esModule: true, default: () => null };
    if (id === './ArticleImage') return { ArticleImage: props => React.createElement('img', props) };
    if (id === 'next/link') return { __esModule: true, default: ({ children, ...props }) => React.createElement('a', props, children) };
    if (id.startsWith('.')) {
      const base = path.resolve(path.dirname(filename), id);
      if (base.endsWith('.json')) return JSON.parse(fs.readFileSync(base, 'utf8'));
      const candidate = [base, `${base}.ts`, `${base}.tsx`].find(name => fs.existsSync(name) && fs.statSync(name).isFile());
      if (candidate) return load(candidate);
    }
    return require(id);
  };
  new Function('require', 'module', 'exports', compiled)(localRequire, module, module.exports);
  return module.exports;
}

const { canonicalTopic, normalizeTopics, countTopics, topicDescription, topicFromRoute } = load('app/lib/topics.ts');
assert.equal(canonicalTopic(' LLM '), 'LLMs');
assert.equal(canonicalTopic('llms'), 'LLMs');
assert.equal(canonicalTopic('Agents'), 'AI Agents');
assert.equal(topicFromRoute('AI%20Agents'), 'AI Agents');
assert.equal(topicFromRoute('AI Agents'), 'AI Agents');
assert.equal(topicFromRoute('50%'), '50%');
assert.equal(canonicalTopic('Career Journeys'), 'Career');
assert.notEqual(canonicalTopic('Memory'), canonicalTopic('Agent Memory'), 'A personal memory is not the book topic');
assert.notEqual(canonicalTopic('Developer Experience'), canonicalTopic('Developer Tooling'), 'Neighboring disciplines remain separate');
assert.deepEqual(normalizeTopics(['LLM', 'LLMs', 'llms', ' Agents ', 'AI Agents', 'Niche Runtime']), ['LLMs', 'AI Agents', 'Niche Runtime']);
assert.deepEqual(countTopics([{ tags: ['LLM', 'LLMs', 'Agents'] }, { tags: ['llms', 'AI Agents'] }]), [{ tag: 'AI Agents', count: 2 }, { tag: 'LLMs', count: 2 }], 'Count posts, not duplicate aliases within a post');
assert.doesNotMatch(topicDescription('LLMs'), /chapters? [1-4]/i, 'Topic copy must not repeat an undated launch status');

const tagPage = load('app/tags/[tag]/page.tsx');
const percentMetadata = await tagPage.generateMetadata({ params: Promise.resolve({ tag: '50%' }) });
assert.equal(percentMetadata.title, '50% | Tags | ECONOBEN.DEV', 'Literal percent signs in decoded route parameters must survive');
assert.equal(percentMetadata.alternates.canonical, 'https://econoben.dev/tags/50%25');
await assert.rejects(tagPage.default({ params: Promise.resolve({ tag: '50%' }) }), error => error.message === 'NOT_FOUND', 'An unknown percent-containing topic must be a normal 404, not a URIError');

const { getArticleStructure, sectionIndexFor } = load('app/lib/articleStructure.ts');
const { default: MarkdownRenderer } = load('app/components/MarkdownRenderer.tsx');
const fixture = `# First **heading**\n\n## First heading\n\n## First heading-2\n\n## First heading\n\nSetext & punctuation!\n----\n\n### A [link](/posts/destination?from=article#part) and \`code\`\n\n\`\`\`md\n## Not a section\n[not a reference](/posts/fake)\n\`\`\`\n\n<h2>HTML <em>heading</em></h2>\n\n## 🪶\n\n![not a reference](/posts/image.png)\n`;
const structure = getArticleStructure(fixture);
const document = new JSDOM(renderToStaticMarkup(React.createElement(MarkdownRenderer, { content: fixture }))).window.document;
const rendered = [...document.querySelectorAll('h2[id],h3[id]')].map(heading => ({ id: heading.id, text: heading.textContent, depth: Number(heading.tagName.slice(1)) }));
assert.deepEqual(structure.headings, rendered, 'Index and renderer must use precisely the same fragments and visible text');
assert.equal(new Set(rendered.map(heading => heading.id)).size, rendered.length, 'Duplicate and naturally suffixed headings must still have unique IDs');
assert.deepEqual(rendered.slice(0, 4).map(heading => heading.id), ['first-heading', 'first-heading-2', 'first-heading-2-2', 'first-heading-3']);
assert.ok(!rendered.some(heading => heading.text === 'Not a section'));
assert.deepEqual(structure.links.map(link => link.href), ['/posts/destination?from=article#part'], 'Only real text references count; code and images do not');
assert.equal(sectionIndexFor(structure.headings, 2).length, 0, 'Short posts need no section index');
assert.equal(sectionIndexFor(structure.headings.slice(0, 2), 12).length, 0, 'Long posts without enough sections need no empty index');
assert.ok(sectionIndexFor(structure.headings, 12).length >= 3);
assert.equal(getArticleStructure('<div id="existing"></div>\n\n## Existing').headings[0].id, 'existing-2', 'Heading IDs cannot collide with an authored HTML anchor');

const { relatedReadingFor } = load('app/services/readingDiscovery.ts');
const post = (slug, tags, content = '', date = '2026-01-01') => ({ slug, title: slug, tags, content, date: new Date(date), readingTime: 8 });
const origin = post('origin', ['LLMs', 'AI Agents'], '[Read the source](/posts/cited?ref=test#detail)');
const source = post('cited', ['Economics']);
const inbound = post('inbound', ['Personal'], '[My source](https://econoben.dev/posts/origin)');
const shared = post('shared', ['LLM', 'Agents']);
const adjacent = post('adjacent', ['Grief'], '', '2026-01-02');
const links = relatedReadingFor(origin, [origin, shared, adjacent, source, inbound]);
assert.deepEqual(links.map(item => item.post.slug), ['cited', 'inbound', 'shared'], 'References outrank tags; chronological proximity alone is not a relation');
assert.match(links[0].reason, /cited in this article/i);
assert.match(links[1].reason, /cites this article/i);
assert.match(links[2].reason, /LLMs/);
assert.match(links[2].reason, /AI Agents/);
assert.equal(relatedReadingFor(adjacent, [origin, adjacent, source]).length, 0, 'Never invent filler related articles');
assert.equal(relatedReadingFor(origin, [origin, post('impostor', ['Economics'], '[same path elsewhere](https://other.test/posts/origin)')]).length, 0);

const { postService } = load('app/services/PostService.ts');
const posts = await postService.getAllPosts();
assert.equal(load('services/PostService.ts').postService, postService, 'Sitemap and search must share the canonical post service');
const tags = await postService.getAllTags();
const llms = await postService.getPostsByTag('LLMs');
assert.equal(llms.length, 7, 'Real corpus contains seven LLM articles after merging singular and plural');
assert.deepEqual((await postService.getPostsByTag('LLM')).map(post => post.slug), llms.map(post => post.slug), 'Old singular topic URL must keep resolving');
assert.equal((await postService.getPostsByTag('Agents')).length, 4);
const routeNames = await postService.getTagRouteNames();
for (const name of ['LLM', 'LLMs', 'Agents', 'AI Agents', 'Career Journeys', 'Career']) assert.ok(routeNames.includes(name), `Preserve authored alias route ${name}`);
assert.equal((await postService.getPostsByTag('Career Journeys')).length, 2);
assert.equal(tags.find(({ tag }) => tag === 'Year in Review')?.count, 4);
for (const { tag, count } of tags) assert.equal((await postService.getPostsByTag(tag)).length, count, `Index/route counts agree for ${tag}`);
const historical = posts.find(post => post.slug === 'agent-memory-is-in-early-release');
assert.match(historical.summary, /Chapters 1 and 2/);
assert.match(historical.content, /Chapters 1 and 2/);
const realConnections = relatedReadingFor(historical, posts);
assert.ok(realConnections.some(item => item.post.slug === 'what_are_ai_agents_an_introduction' && /report/.test(item.reason)), 'Verified shared report reference preserves the honest article relationship');
assert.ok(relatedReadingFor(posts.find(post => post.slug === '2025-year-in-review'), posts).some(item => item.post.slug === 'extending-gpts-are-gpts-to-firms' && item.kind === 'reference'), 'A real article reference using the old redirected slug remains a citation');
for (const post of posts) {
  const structure = getArticleStructure(post.content);
  assert.equal(new Set(structure.headings.map(heading => heading.id)).size, structure.headings.length, `Unique fragments in ${post.slug}`);
}
const articleSource = fs.readFileSync('app/posts/[slug]/page.tsx', 'utf8');
assert.equal((articleSource.match(/<AudioPlayer\b/g) || []).length, 1, 'Render existing audio exactly once');
assert.ok(articleSource.indexOf('<AudioPlayer') < articleSource.indexOf('id="reading-content"'), 'Listening must be offered before article text');
assert.match(articleSource, /ArticleSectionIndex/);
assert.match(articleSource, /ChronologicalNavigation/);
console.log(`Reading discovery passed: conservative aliases (${tags.length} topics / ${posts.length} articles), old routes, honest references, unique rendered fragments, long-post index and one early audio player.`);
