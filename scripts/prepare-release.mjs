#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawn, spawnSync, execFileSync } from 'node:child_process';
import { availableLocalPort, waitForLocalServer, verifyLocalBuildIdentity } from './local-release-server.mjs';

const root = process.cwd();
const args = process.argv.slice(2);
const value = name => { const index = args.indexOf(name); return index < 0 ? undefined : args[index + 1]; };
if (args.includes('--help')) {
  console.log('Local verification only. No deployment, Git push, or Vercel mutation.\nUsage: npm run release:prepare -- --rollback-url https://<ready-deployment>.vercel.app --rollback-source <40-character-commit> [--port 3111]');
  process.exit(0);
}
const rollbackUrl = value('--rollback-url');
const rollbackSource = value('--rollback-source');
if (!rollbackUrl || !/^https:\/\/[a-z0-9-]+\.vercel\.app\/?$/.test(rollbackUrl) || !/^[a-f0-9]{40}$/.test(rollbackSource ?? '')) {
  throw new Error('Supply the verified Ready production deployment URL and its source commit. See docs/releasing.md.');
}
if (Number(process.versions.node.split('.')[0]) !== 22) {
  throw new Error(`Use Node 22 (the version in .nvmrc, matching production). Current runtime: ${process.version}. No work was performed.`);
}
const requestedPort = value('--port') ? Number(value('--port')) : undefined;
if (requestedPort !== undefined && (!Number.isInteger(requestedPort) || requestedPort < 1024 || requestedPort > 65535)) throw new Error('Local port must be an integer from 1024 to 65535.');
if (requestedPort !== undefined) await availableLocalPort(requestedPort);
const git = (...gitArgs) => execFileSync('git', ['-c', 'core.fsmonitor=false', ...gitArgs], { cwd: root, encoding: 'utf8' }).trim();
const excluded = file => file.split('/').some(part => ['node_modules', '.git', '.next', '.next-review', '.vercel', 'release-artifacts'].includes(part) || part === '.env' || part.startsWith('.env.')) || file.endsWith('.tsbuildinfo') || file === 'next-env.d.ts';
const files = [...new Set(git('ls-files', '-z', '--cached', '--others', '--exclude-standard').split('\0'))].filter(file => file && !excluded(file) && fs.existsSync(path.join(root, file))).sort();
const fingerprint = (directory, file) => createHash('sha256').update(fs.readFileSync(path.join(directory, file))).digest('hex');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'econoben-release-'));
const snapshot = path.join(temp, 'source');
fs.mkdirSync(snapshot);
const manifest = files.map(file => {
  const source = path.join(root, file);
  if (!fs.lstatSync(source).isFile()) throw new Error(`Source snapshot accepts regular files only: ${file}`);
  const target = path.join(snapshot, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  return { path: file, sha256: fingerprint(snapshot, file) };
});
const manifestHash = createHash('sha256').update(JSON.stringify(manifest)).digest('hex');
const evidence = {
  status: 'verification-in-progress',
  deploymentAuthorized: false,
  createdAt: new Date().toISOString(),
  baseCommit: git('rev-parse', 'HEAD'),
  branch: git('branch', '--show-current'),
  sourceChanges: git('status', '--short', '--untracked-files=normal'),
  sourceManifestSha256: manifestHash,
  snapshot,
  runtime: { node: process.version, npm: execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim() },
  rollback: { url: rollbackUrl, sourceCommit: rollbackSource, verification: 'Supplied by operator after read-only production inspection; reconfirm before any approved deployment.' },
  checks: [],
};
const recordPath = path.join(temp, 'release-record.json');
const persist = () => fs.writeFileSync(recordPath, JSON.stringify(evidence, null, 2) + '\n');
fs.writeFileSync(path.join(temp, 'source-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
persist();
console.log(`Verification snapshot: ${snapshot}\nRelease record: ${recordPath}`);
const env = { ...process.env, VERCEL_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' };
delete env.SITE_URL;
delete env.BLOG_BUILD_DIR;
// Secrets remain outside the snapshot. Verification never submits forms, calls
// publishing commands, or copies .vercel linkage into an uploadable directory.
function run(label, command, commandArgs, additions = {}) {
  console.log(`\n${label}`);
  const started = Date.now();
  const result = spawnSync(command, commandArgs, { cwd: snapshot, env: { ...env, ...additions }, encoding: 'utf8', timeout: 600_000, maxBuffer: 20 * 1024 * 1024 });
  const log = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  const logFile = `${String(evidence.checks.length + 1).padStart(2, '0')}-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.log`;
  fs.writeFileSync(path.join(temp, logFile), log);
  evidence.checks.push({ label, passed: result.status === 0, durationMs: Date.now() - started, logFile });
  persist();
  if (result.status !== 0) throw new Error(`${label} failed. ${result.error?.message ?? ''}\n${log.slice(-10_000)}\nFull log: ${path.join(temp, logFile)}`);
  console.log(`Passed (${((Date.now() - started) / 1000).toFixed(1)}s)`);
}
let server;
try {
  run('Install locked dependencies', 'npm', ['ci', '--no-audit', '--no-fund']);
  run('Source regressions', 'npm', ['test']);
  run('Type checking', 'npm', ['run', 'typecheck']);
  run('Production build', 'npm', ['run', 'build']);
  for (const file of manifest) {
    if (!fs.existsSync(path.join(snapshot, file.path)) || fingerprint(snapshot, file.path) !== file.sha256) throw new Error(`Build changed source: ${file.path}`);
  }
  evidence.checks.push({ label: 'Source files preserved byte-for-byte by install and build', passed: true, files: manifest.length });
  persist();
  const port = await availableLocalPort(requestedPort);
  const origin = `http://127.0.0.1:${port}`;
  const serverLogPath = path.join(temp, 'local-server.log');
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], { cwd: snapshot, env, stdio: ['ignore', 'pipe', 'pipe'] });
  for (const stream of [server.stdout, server.stderr]) stream.on('data', chunk => fs.appendFileSync(serverLogPath, chunk));
  await waitForLocalServer(server, origin);
  evidence.buildId = await verifyLocalBuildIdentity(snapshot, origin);
  evidence.checks.push({ label: 'Owned local server serves the prepared build manifest byte-for-byte', passed: true, buildId: evidence.buildId });
  persist();
  for (const file of ['verify-served-cache', 'verify-social-identity', 'verify-reader-delivery', 'verify-served-topics', 'verify-article-fragments', 'verify-site-links']) {
    run(file, process.execPath, [`scripts/${file}.mjs`], { SITE_URL: origin });
  }
  evidence.localOrigin = origin;
  evidence.status = 'verified-awaiting-review-and-deployment-approval';
  console.log(`\nAll local checks passed. Nothing was deployed.\nReview evidence: ${recordPath}\nSnapshot retained for local visual review: ${snapshot}`);
} catch (error) {
  evidence.status = 'verification-failed';
  evidence.failure = error.message;
  process.exitCode = 1;
  console.error(error.message);
} finally {
  if (server && server.exitCode === null && server.signalCode === null) {
    server.kill('SIGTERM');
    await new Promise(resolve => {
      const timer = setTimeout(() => { if (server.exitCode === null && server.signalCode === null) server.kill('SIGKILL'); }, 5_000);
      server.once('close', () => { clearTimeout(timer); resolve(); });
    });
  }
  persist();
}
