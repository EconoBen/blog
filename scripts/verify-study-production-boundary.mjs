import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const source = fs.readFileSync('app/pond-studies/page.tsx', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const route = { exports: {} };
const unavailable = new Error('not found');
let contentLoads = 0;
new Function('require', 'module', 'exports', compiled)(id => {
  if (id === 'next/navigation') return { notFound: () => { throw unavailable; } };
  if (id === '../services/PostService') return { postService: { getAllPosts: async () => { contentLoads++; return []; } } };
  if (id === './studyContent') return { buildPondStudyContent: () => ({ essays: [], connections: [] }) };
  if (id === './PondStudies') return { PondStudies: () => null };
  return require(id);
}, route, route.exports);
const originalEnvironment = process.env.VERCEL_ENV;
try {
  process.env.VERCEL_ENV = 'production';
  await assert.rejects(route.exports.default(), error => error === unavailable);
  assert.equal(contentLoads, 0, 'Production does not load comparison content');
  delete process.env.VERCEL_ENV;
  assert.ok(await route.exports.default(), 'Local production builds retain the comparison');
  process.env.VERCEL_ENV = 'preview';
  assert.ok(await route.exports.default(), 'Review deployments retain the comparison');
  assert.equal(contentLoads, 2);
  console.log('Study boundary passed: unavailable in Vercel production; local and preview comparisons remain accessible.');
} finally {
  if (originalEnvironment === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = originalEnvironment;
}
