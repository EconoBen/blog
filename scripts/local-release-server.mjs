import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

export async function availableLocalPort(requestedPort = 0) {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once('error', reject);
    probe.listen(requestedPort, '127.0.0.1', () => {
      const port = probe.address().port;
      probe.close(error => error ? reject(error) : resolve(port));
    });
  });
}

// A successful HTTP response alone could come from an older process on the same
// port. Wait for this child's readiness output first, and fail on its exit/error.
export function waitForLocalServer(server, origin, timeoutMs = 30_000) {
  return new Promise((resolve, reject) => {
    let output = '';
    let probing = false;
    let settled = false;
    let retry;
    const deadline = setTimeout(() => finish(new Error('Temporary server did not become ready before the deadline.')), timeoutMs);
    const onError = error => finish(error);
    const onExit = code => finish(new Error(`Temporary server exited (${code}) before readiness.`));
    function finish(error) {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      clearTimeout(retry);
      server.off('error', onError);
      server.off('exit', onExit);
      server.stdout.off('data', onOutput);
      error ? reject(error) : resolve();
    }
    async function probe() {
      if (settled) return;
      if ((server.exitCode !== null || server.signalCode !== null)) return onExit(server.exitCode);
      try {
        const response = await fetch(origin, { signal: AbortSignal.timeout(Math.min(timeoutMs, 1_000)) });
        if (response.ok && server.exitCode === null && server.signalCode === null) return finish();
      } catch {}
      if (!settled) retry = setTimeout(probe, 200);
    }
    function onOutput(chunk) {
      output = (output + chunk.toString()).slice(-4096);
      if (!probing && /Ready in\b/.test(output)) {
        probing = true;
        probe();
      }
    }
    server.on('error', onError);
    server.on('exit', onExit);
    server.stdout.on('data', onOutput);
    if ((server.exitCode !== null || server.signalCode !== null)) onExit(server.exitCode);
  });
}

export async function verifyLocalBuildIdentity(snapshot, origin) {
  const buildId = fs.readFileSync(path.join(snapshot, '.next/BUILD_ID'), 'utf8').trim();
  assert.match(buildId, /^[a-zA-Z0-9_-]+$/, 'Expected a framework-generated build identifier');
  const pathname = `/_next/static/${buildId}/_buildManifest.js`;
  const expected = fs.readFileSync(path.join(snapshot, '.next/static', buildId, '_buildManifest.js'));
  const response = await fetch(new URL(pathname, origin), { signal: AbortSignal.timeout(5_000) });
  assert.equal(response.status, 200, 'The temporary server must serve this snapshot’s exact build identifier');
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected, 'Served build manifest must match this snapshot byte-for-byte');
  return buildId;
}
