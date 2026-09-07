import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const compiled = ts.transpileModule(fs.readFileSync('app/api/subscribe/route.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const env = {}, calls = [], responses = [], logs = [];
const context = { exports: {}, URL, AbortSignal, process: { env },
  console: { log: (...args) => logs.push(args), error: (...args) => logs.push(args) },
  fetch: async (url, options) => { calls.push({ url, options }); const response = responses.shift(); if (response instanceof Error) throw response; return response; },
  require: () => ({ NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } }),
};
vm.runInNewContext(compiled, context);
const submit = email => context.exports.POST({ json: async () => ({ email }) });
assert.equal((await submit('bad')).status, 400);
assert.equal((await context.exports.POST({ json: async () => { throw new Error('bad JSON'); } })).status, 400);
assert.equal((await submit('reader@example.test')).status, 503, 'Unconfigured signup must not claim a saved subscription');
assert.equal(calls.length, 0);
assert.ok(!JSON.stringify(logs).includes('reader@example.test'), 'Do not log visitor email addresses');
env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test/exec';
const response = (status, body, location) => ({ status, ok: status >= 200 && status < 300, headers: new Headers(location ? { location } : {}), json: async () => body });
for (const status of ['success', 'already_subscribed']) {
  responses.push(response(302, null, 'https://script.googleusercontent.com/macros/echo?result=1'), response(200, { status }));
  assert.equal((await submit('reader@example.test')).status, 200);
  assert.equal(calls.at(-1).options.method, 'GET', 'Follow Apps Script output as GET, never resubmit');
}
responses.push(response(200, { status: 'error', message: 'Cannot append row' }));
assert.equal((await submit('reader@example.test')).status, 502, 'HTTP200 with upstream error must not claim signup succeeded');
responses.push(response(302, null));
assert.equal((await submit('reader@example.test')).status, 502, 'A redirect without confirmed result is not success');
responses.push(response(302, null, 'https://unrelated.example/result'));
assert.equal((await submit('reader@example.test')).status, 502, 'Do not follow unrelated redirects');
responses.push(response(200, { status: 'success' }));
assert.equal((await submit('reader@example.test')).status, 200, 'Direct confirmed JSON success also works');
responses.push(response(500, {}));
assert.equal((await submit('reader@example.test')).status, 502);
responses.push(new Error('timeout'));
assert.equal((await submit('reader@example.test')).status, 502);
console.log('Subscription contract passed: validation, missing configuration, confirmed success, duplicate success, upstream errors and redirect GET. No real requests sent.');
