import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import matter from 'gray-matter';

const source = await readFile('app/pond-studies/studyContent.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { buildPondStudyContent, connectionsFor } = context.exports;
const posts = await Promise.all((await readdir('src/posts')).filter(file => file.endsWith('.md')).map(async file => {
  const { data, content } = matter(await readFile(`src/posts/${file}`, 'utf8'));
  return { slug: file.slice(0, -3), title: data.title, date: new Date(data.date), summary: data.summary, tags: data.tags, content, readingTime: Math.ceil(content.split(/\s+/).length / 200) };
}));
const { essays, connections } = buildPondStudyContent(posts);
assert.equal(essays.length, 7, 'Every study gets the same seven real essays');
assert.equal(new Set(essays.map(essay => essay.slug)).size, 7);
assert.deepEqual(JSON.parse(JSON.stringify(buildPondStudyContent([...posts].reverse()))), JSON.parse(JSON.stringify({ essays, connections })), 'Input order must not change the comparison');
const originals = new Map(posts.map(post => [post.slug, post]));
for (const essay of essays) {
  const original = originals.get(essay.slug);
  assert.equal(essay.title, original.title, 'Display titles preserve author content');
  assert.ok(essay.shortTitle.length <= 32 && essay.shortTitle.length > 0);
  assert.ok(essay.summary.length < 210 && essay.summary.length > 40);
  assert.equal(essay.href, `/posts/${encodeURIComponent(essay.slug)}`);
  assert.ok(!('content' in essay), 'Client studies receive metadata, not complete articles');
  assert.ok(Number.isFinite(Date.parse(essay.date)));
}
const normalized = tags => tags.map(tag => tag.trim().toLowerCase());
assert.ok(connections.some(connection => connection.kind === 'explicit-reference'), 'Include the verified earlier-report reference');
assert.ok(connections.some(connection => connection.kind === 'shared-topic'));
for (const connection of connections) {
  assert.ok(essays.some(essay => essay.slug === connection.from));
  assert.ok(essays.some(essay => essay.slug === connection.to));
  assert.notEqual(connection.from, connection.to);
  const from = originals.get(connection.from), to = originals.get(connection.to);
  if (connection.kind === 'shared-topic') {
    assert.equal(connection.evidence.type, 'shared-tags');
    assert.ok(connection.evidence.topics.length > 0);
    for (const tag of connection.evidence.topics) {
      assert.ok(normalized(from.tags).includes(tag.toLowerCase()));
      assert.ok(normalized(to.tags).includes(tag.toLowerCase()));
    }
  } else {
    assert.equal(connection.evidence.type, 'shared-publication-reference');
    assert.ok(from.content.includes(connection.evidence.excerpt));
    assert.ok(to.content.includes(connection.evidence.targetExcerpt));
    assert.ok(connection.evidence.excerpt.includes(connection.evidence.href));
    assert.ok(connection.evidence.targetExcerpt.includes(connection.evidence.href));
    assert.notEqual(connection.label, connection.reverseLabel);
    assert.equal(connectionsFor(connection.from, essays, connections).find(item => item.essay.slug === connection.to).label, connection.label);
    assert.equal(connectionsFor(connection.to, essays, connections).find(item => item.essay.slug === connection.from).label, connection.reverseLabel, 'Reverse exploration must preserve reference direction');
  }
}
for (const essay of essays) {
  const neighbors = connectionsFor(essay.slug, essays, connections);
  assert.ok(neighbors.length > 0, `No invented solitary island: ${essay.slug} has a real connection`);
  assert.equal(neighbors.length, new Set(neighbors.map(item => item.essay.slug)).size, 'A neighbor must not be duplicated for different evidence types');
  assert.ok(neighbors.every(item => item.essay.slug !== essay.slug));
}
const noReferences = buildPondStudyContent(posts.map(post => ({ ...post, content: '' })));
assert.equal(noReferences.connections.filter(connection => connection.kind === 'explicit-reference').length, 0, 'A missing source reference cannot survive as a curated claim');
const noTopics = buildPondStudyContent(posts.map(post => ({ ...post, tags: [] })));
assert.equal(noTopics.connections.filter(connection => connection.kind === 'shared-topic').length, 0, 'Thematic proximity alone cannot create a shared-topic connection');
const missing = buildPondStudyContent(posts.filter(post => post.slug !== essays[0].slug));
assert.equal(missing.essays.length, 6);
assert.ok(missing.connections.every(connection => connection.from !== essays[0].slug && connection.to !== essays[0].slug), 'Deleted essays leave no dangling links');
assert.equal(buildPondStudyContent([]).essays.length, 0);
assert.equal(connectionsFor('missing', essays, connections).length, 0);
assert.ok(Buffer.byteLength(JSON.stringify({ essays, connections })) < 14000, 'Study content stays a small metadata payload');
console.log(`Pond study content passed: ${essays.length} real essays, ${connections.length} evidence-backed connections, deterministic ordering, directional labels and source-removal checks.`);
