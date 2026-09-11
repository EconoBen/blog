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
  const flight = { exports: {} };
  const flightSource = ts.transpileModule(fs.readFileSync('app/pond-studies/flight/page.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  new Function('require', 'module', 'exports', flightSource)(id => {
    if (id === 'next/navigation') return { notFound: () => { throw unavailable; } };
    if (id === './FlightStudy') return { FlightStudy: () => null };
    return require(id);
  }, flight, flight.exports);
  process.env.VERCEL_ENV = 'production';
  assert.throws(() => flight.exports.default(), error => error === unavailable,
    'A parent page guard does not protect its child flight-study route');
  delete process.env.VERCEL_ENV;
  assert.ok(flight.exports.default(), 'The isolated anatomy study remains available locally');
  process.env.VERCEL_ENV = 'preview';
  assert.ok(flight.exports.default(), 'The flight study follows the existing comparison environment boundary');
  console.log('Study boundaries passed: pond comparisons and the child flight study are unavailable in Vercel production, with local review retained.');
} finally {
  if (originalEnvironment === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = originalEnvironment;
}
