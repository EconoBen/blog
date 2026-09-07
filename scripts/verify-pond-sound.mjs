import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const code = ts.transpileModule(await readFile('app/components/usePondSound.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function fixture({ suspended = false, available = true, rejectResume = false } = {}) {
  const hooks = [], effects = [], contexts = [], listeners = new Map();
  let index = 0, mounted = false, visible = true, finishResume;
  class AudioContext {
    state = suspended ? 'suspended' : 'running';
    currentTime = 10;
    destination = {};
    oscillators = [];
    gains = [];
    constructor() { contexts.push(this); }
    resume() {
      if (rejectResume) return Promise.reject(new Error('Blocked'));
      return new Promise(resolve => { finishResume = () => { this.state = 'running'; resolve(); }; });
    }
    close() { this.state = 'closed'; return Promise.resolve(); }
    createOscillator() {
      const oscillator = {
        frequency: { setValueAtTime() {}, exponentialRampToValueAtTime(value) { assert.ok(value > 0); } },
        connect() {}, disconnect() { this.disconnected = true; },
        start(time) { this.started = time; }, stop() { this.stopped = true; },
      };
      this.oscillators.push(oscillator);
      return oscillator;
    }
    createGain() {
      const gain = { gain: {
        setValueAtTime() {}, exponentialRampToValueAtTime(value) { assert.ok(value > 0 && value <= .05); },
      }, connect() {}, disconnect() { this.disconnected = true; } };
      this.gains.push(gain);
      return gain;
    }
  }
  const document = {
    get hidden() { return !visible; },
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: name => listeners.delete(name),
  };
  const sandbox = { exports: {}, window: available ? { AudioContext } : {}, document,
    require: () => ({
      useState: initial => { const key = index++; if (!(key in hooks)) hooks[key] = initial; return [hooks[key], value => { hooks[key] = value; }]; },
      useRef: initial => { const key = index++; return hooks[key] ??= { current: initial }; },
      useCallback: fn => { index++; return fn; },
      useEffect: fn => { index++; if (!mounted) effects.push(fn()); },
    }),
  };
  vm.runInNewContext(code, sandbox);
  const render = () => { index = 0; const sound = sandbox.exports.usePondSound(); mounted = true; return sound; };
  return {
    render, contexts, listeners,
    hide: () => { visible = false; listeners.get('visibilitychange')?.(); },
    unmount: () => effects.forEach(cleanup => cleanup?.()),
    resume: async () => { finishResume?.(); await Promise.resolve(); await Promise.resolve(); },
  };
}

const normal = fixture();
assert.equal(normal.render().enabled, true);
assert.equal(normal.contexts.length, 0, 'Mount must not create audio or autoplay');
normal.render().play();
assert.equal(normal.contexts.length, 1);
assert.deepEqual(normal.contexts[0].oscillators.map(node => node.started), [10.05, 11.25, 12.1]);
normal.render().toggle();
assert.equal(normal.render().enabled, false);
assert.ok(normal.contexts[0].oscillators.every(node => node.stopped && node.disconnected));
assert.ok(normal.contexts[0].gains.every(node => node.disconnected));
normal.render().play();
assert.equal(normal.contexts.length, 1, 'Muted play must not create another context');
normal.render().toggle();
assert.equal(normal.contexts.length, 1, 'Unmute must not start playback');
normal.render().play();
normal.hide();
assert.equal(normal.contexts[1].state, 'closed');
normal.unmount();
assert.equal(normal.listeners.size, 0);

for (const cancel of ['toggle', 'hide', 'unmount']) {
  const pending = fixture({ suspended: true });
  pending.render().play();
  if (cancel === 'toggle') pending.render().toggle();
  else pending[cancel]();
  await pending.resume();
  assert.equal(pending.contexts[0].oscillators.length, 0, `Late resume must not play after ${cancel}`);
  pending.unmount();
}
const blocked = fixture({ suspended: true, rejectResume: true });
blocked.render().play();
await Promise.resolve(); await Promise.resolve();
assert.equal(blocked.contexts[0].oscillators.length, 0);
blocked.unmount();
const resumed = fixture({ suspended: true });
resumed.render().play();
assert.equal(resumed.contexts[0].oscillators.length, 0, 'Suspended context must await gesture resume');
await resumed.resume();
assert.equal(resumed.contexts[0].oscillators.length, 3);
resumed.render().play();
assert.ok(resumed.contexts[0].oscillators.slice(0, 3).every(node => node.disconnected), 'Repeated activation cancels older bubbles');
resumed.unmount();
assert.equal(resumed.contexts[0].state, 'closed');
assert.ok(resumed.contexts[0].oscillators.every(node => node.disconnected));
const absent = fixture({ available: false });
assert.doesNotThrow(() => absent.render().play());
absent.unmount();
console.log('Pond sound passed: gesture-only playback, bubble timing, mute, hidden/unmount cleanup, unavailable audio and late resume cancellation.');
