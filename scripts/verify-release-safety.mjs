import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

const root = process.cwd();
const require = createRequire(import.meta.url);
const compiled = ts.transpileModule(fs.readFileSync('next.config.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
const module = { exports: {} };
new Function('require', 'module', 'exports', '__dirname', compiled)(require, module, module.exports, root);
const nextHeaders = await module.exports.default.headers();
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const cacheHeader = rule => rule.headers.find(header => header.key.toLowerCase() === 'cache-control')?.value;

test('mutable article and media URLs revalidate without a competing Vercel policy', () => {
  for (const source of ['/posts/:path*', '/assets/:path*', '/audio/:path*', '/api/og']) {
    const value = cacheHeader(nextHeaders.find(rule => rule.source === source) ?? { headers: [] });
    assert.ok(value, `Explicit mutable policy for ${source}`);
    assert.doesNotMatch(value, /immutable|(?:^|[,\s])max-age=[1-9]/i, `${source} is editable at the same URL`);
    assert.match(value, /max-age=0|no-store|no-cache/);
  }
  assert.ok(!(vercel.headers ?? []).some(cacheHeader), 'Next owns cache policies; Vercel must not override them');
});

test('framework fingerprinted assets retain the framework cache policy', () => {
  for (const rule of [...nextHeaders, ...(vercel.headers ?? [])]) {
    assert.ok(!(rule.source.includes('_next/static') && cacheHeader(rule)), 'Do not override framework immutable assets');
  }
});

test('post-build reporting preserves original images, videos and built output byte-for-byte', () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'econoben-preserve-'));
  const files = ['public/assets/originals/source.jpg', 'public/assets/demo.mp4', 'public/assets/nested/clip.mov', 'public/videos/demo.mp4', '.next/static/media/clip.mp4'];
  try {
    fs.mkdirSync(path.join(fixture, 'scripts'));
    fs.copyFileSync(path.join(root, 'scripts/post-build-cleanup.js'), path.join(fixture, 'scripts/post-build-cleanup.js'));
    for (const file of files) {
      fs.mkdirSync(path.dirname(path.join(fixture, file)), { recursive: true });
      fs.writeFileSync(path.join(fixture, file), `preserve ${file}`);
    }
    const result = spawnSync(process.execPath, ['scripts/post-build-cleanup.js'], { cwd: fixture, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    for (const file of files) {
      assert.ok(fs.existsSync(path.join(fixture, file)), `${file} was deleted by a normal build`);
      assert.equal(fs.readFileSync(path.join(fixture, file), 'utf8'), `preserve ${file}`);
    }
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

const { availableLocalPort, waitForLocalServer, verifyLocalBuildIdentity } = await import('./local-release-server.mjs');
const { createServer } = await import('node:http');
const { spawn } = await import('node:child_process');

test('an occupied port or an older HTTP200 server cannot satisfy release readiness', async () => {
  let requests = 0;
  const oldServer = createServer((request, response) => { requests++; response.end('older build'); });
  await new Promise(resolve => oldServer.listen(0, '127.0.0.1', resolve));
  const port = oldServer.address().port;
  let child;
  try {
    await assert.rejects(availableLocalPort(port), { code: 'EADDRINUSE' });
    child = spawn(process.execPath, ['-e', 'setTimeout(() => process.exit(1), 50)'], { stdio: ['ignore', 'pipe', 'pipe'] });
    await assert.rejects(waitForLocalServer(child, `http://127.0.0.1:${port}`, 1_000), /exited/);
    assert.equal(requests, 0, 'Never probe a listener until this child announces readiness');
  } finally {
    if (child?.exitCode === null) child.kill();
    oldServer.closeAllConnections();
    await new Promise(resolve => oldServer.close(resolve));
  }
});

test('an unresponsive listener cannot keep readiness waiting past its deadline', async () => {
  const hangingServer = createServer(() => {});
  await new Promise(resolve => hangingServer.listen(0, '127.0.0.1', resolve));
  const child = spawn(process.execPath, ['-e', 'console.log("Ready in 1ms");setInterval(() => {}, 1000)'], { stdio: ['ignore', 'pipe', 'pipe'] });
  const started = Date.now();
  try {
    await assert.rejects(waitForLocalServer(child, `http://127.0.0.1:${hangingServer.address().port}`, 250), /deadline/);
    assert.ok(Date.now() - started < 1_000, 'Readiness deadline is bounded even when HTTP never responds');
  } finally {
    child.kill();
    hangingServer.closeAllConnections();
    await new Promise(resolve => hangingServer.close(resolve));
  }
});

test('the served build identifier and manifest must match the prepared snapshot', async () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'econoben-build-identity-'));
  const manifest = Buffer.from('this exact prepared build');
  fs.mkdirSync(path.join(fixture, '.next/static/prepared-build'), { recursive: true });
  fs.writeFileSync(path.join(fixture, '.next/BUILD_ID'), 'prepared-build');
  fs.writeFileSync(path.join(fixture, '.next/static/prepared-build/_buildManifest.js'), manifest);
  let served = Buffer.from('older build');
  const server = createServer((request, response) => response.end(served));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    await assert.rejects(verifyLocalBuildIdentity(fixture, origin), /byte-for-byte/);
    served = manifest;
    assert.equal(await verifyLocalBuildIdentity(fixture, origin), 'prepared-build');
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
