import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const modules = new Map();
function load(name) {
  if (modules.has(name)) return modules.get(name);
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(`app/components/${name}.ts`, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('module', 'exports', 'require', source)(module, module.exports, path => load(path.replace('./', '')));
  modules.set(name, module.exports);
  return module.exports;
}
const { flightWingPoint, flightWingFrame, flightBodyPoint } = load('arrivalFlightRig');
const { birdAnatomy } = load('arrivalRig');
const { arrivalPose } = load('arrivalChoreography');
const { ARRIVAL_BEATS: B } = load('arrivalTimeline');
const root = { x: 120, y: 150 };
const feathers = [{ x: 460, y: 175 }, { x: 850, y: 300 }, { x: 1450, y: 260 }];
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0));
const relative = (p, origin) => ({ x: p.x - origin.x, y: p.y - origin.y });
const views = [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 844, height: 390 }];
function stateAt(time, view) {
  const pose = arrivalPose(time, view, { x: view.width * .7, y: view.height * .6, width: 180 });
  return birdAnatomy(time, time < B.launchEnd ? pose.hero : time >= B.secondPassEnd
    ? { awake: 1, wings: pose.returning.wings, flight: 1 - pose.returning.upright }
    : { awake: 1, wings: 1, flight: 1 });
}

// Exercise the actual hero and landing control envelopes with the production
// perspective rig. A 3-D feather surface may turn edge-on; the previous planar
// rig's constant winding/breadth assumptions cannot establish its continuity.
let samples = 0;
for (const view of views) for (const near of [true, false]) {
  for (const [start, end] of [[3000, B.launchEnd], [B.firstPassStart, B.firstPassEnd], [B.secondPassStart, B.landEnd]]) {
    for (let time = start; time <= end; time += 4) {
      const state = stateAt(time, view), frame = flightWingFrame(state, near);
      const shoulder = flightWingPoint(root, state, near);
      assert.ok(distance(shoulder, flightBodyPoint(frame.attachment, state)) < 1e-8, 'The actual control envelope keeps each shoulder attached');
      frame.joints.slice(1).forEach((joint, i) => assert.ok(Math.abs(distance(joint, frame.joints[i]) - frame.lengths[i]) < 1e-8, 'Opening and landing fold full-length bones instead of scaling a complete wing'));
      const next = stateAt(time + 1, view), nextRoot = flightWingPoint(root, next, near);
      for (const feather of feathers) {
        const p = flightWingPoint(feather, state, near), q = flightWingPoint(feather, next, near);
        assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), 'All rendered feather coordinates remain finite');
        assert.ok(distance(relative(p, shoulder), relative(q, nextRoot)) < 30, `No feather position snap at ${time} ms`);
      }
      samples++;
    }
  }
  // Both first-stroke onsets and completion of the final fold must have a
  // continuous position and velocity under the real deployment envelope.
  for (const time of [3100, near ? 3750 : 3765, 4150, B.waterContact - 720, B.waterContact - 280, B.waterContact - 160, B.landEnd]) {
    for (const feather of feathers) {
      const at = t => { const state = stateAt(t, view); return relative(flightWingPoint(feather, state, near), flightWingPoint(root, state, near)); };
      const [a, b, c] = [time - .1, time, time + .1].map(at);
      assert.ok(distance(a, c) < 3, `The ${near ? 'near' : 'far'} wing joins continuously at ${time} ms`);
      assert.ok(distance(relative(b, a), relative(c, b)) < .1, `The wing velocity joins continuously at ${time} ms`);
    }
  }
  const cycle = Array.from({ length: 43 }, (_, i) => {
    const state = stateAt(B.firstPassStart + i * 10, view);
    const frame = flightWingFrame(state, near);
    return { tip: relative(flightWingPoint(feathers[2], state, near), flightWingPoint(root, state, near)), recovery: frame.recovery };
  });
  assert.ok(Math.max(...cycle.map(p => p.tip.y)) - Math.min(...cycle.map(p => p.tip.y)) > 400, 'Each cycle includes a substantial powered stroke, not a stationary repeated pose');
  const spread = cycle.filter(p => p.recovery < .01), folded = cycle.filter(p => p.recovery > .9);
  assert.ok(spread.length && folded.length, 'A complete cycle includes spread and folded recovery phases');

  // Verify two complete powered/recovery cycles with the actual first-pass
  // controls. The hidden interval must not restart either wing's clock.
  for (const time of [B.firstPassStart + 80, B.firstPassStart + 190, B.firstPassStart + 300]) {
    const poses = [time, time + 420, time + 840].map(t => {
      const state = stateAt(t, view);
      return relative(flightWingPoint(feathers[2], state, near), flightWingPoint(root, state, near));
    });
    assert.ok(distance(poses[0], poses[1]) < 1e-7 && distance(poses[1], poses[2]) < 1e-7, 'Consecutive full strokes share the uninterrupted visible-time clock');
  }
}
console.log(`Arrival wings passed: ${samples} actual opening, pass and landing poses; attached full-size joints, continuous unfolding/recovery, smooth first-stroke joins and two uninterrupted complete cycles.`);
