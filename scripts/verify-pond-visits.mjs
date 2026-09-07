import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const source = await readFile('app/components/pondSchedule.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
let now = 0, nextId = 0, visits = [], max = 0, encounters = 0;
const timers = new Map();
const clock = {
  set: (fn, delay) => { const id = ++nextId; timers.set(id, { fn, at: now + delay }); return id; },
  clear: id => timers.delete(id),
};
const context = { exports: {}, setTimeout: clock.set, clearTimeout: clock.clear };
vm.runInNewContext(code, context);
let seed = 42;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const stop = context.exports.startPondVisits(next => {
  visits = next; max = Math.max(max, visits.length);
  assert.ok(visits.length <= 2);
  assert.equal(new Set(visits.map(v => v.side)).size, visits.length);
  if (visits.some(v => v.encounter)) {
    assert.equal(visits.length, 2, 'Meetings must have exactly two grebes');
    assert.ok(visits.every(v => v.encounter && !v.reading));
    encounters++;
  }
}, random);
function advance(ms) {
  const target = now + ms;
  while (true) {
    const next = [...timers].sort((a,b) => a[1].at - b[1].at)[0];
    if (!next || next[1].at > target) break;
    now = next[1].at; timers.delete(next[0]); next[1].fn();
  }
  now = target;
}
assert.equal(visits.length, 1, 'One swimmer is already crossing when the scheduler starts');
const initial = visits[0];
assert.equal(initial.side, 'left');
assert.equal(initial.reading, false);
assert.ok(initial.duration >= 34 && initial.duration <= 49, 'The initial swimmer retains the normal crossing speed');
for (const width of [320, 390, 820, 1440]) {
  const left = -160 + (width + 320) * initial.headStart / initial.duration;
  assert.ok(left >= 0 && left + initial.size <= width, `The initial swimmer is already inside the ${width}px viewport`);
}
advance(1900);
assert.equal(visits.length, 1, 'The opposite arrival retains its existing delay');
advance(2200);
assert.ok(visits.some(v => v.side === 'right' && v.reading), 'Reader arrives within 4s');
advance(600000);
assert.equal(max, 2);
assert.ok(encounters > 0 && encounters < 10, 'Meetings should occur occasionally, not continuously');
stop();
assert.equal(timers.size, 0, 'Disposal must cancel every pending arrival/encounter');
console.log('Pond scheduling passed: one immediately visible swimmer, unchanged crossing speed and opposite arrival, two-bird cap, occasional meetings and cleanup.');
