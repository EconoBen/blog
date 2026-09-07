import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const code = ts.transpileModule(await readFile('app/pond-studies/useStudyWaterSound.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function fixture({ suspended = false, available = true, rejectResume = false, failBuffer = false, sampleRate = 8000 } = {}) {
  const hooks = [], cleanups = [], contexts = [], listeners = new Map(), resumes = [];
  let index = 0, mounted = false, visible = true, wallTime = 1000;
  const parameter = () => ({ events: [], setValueAtTime(value, time) { this.events.push({ type: 'set', value, time }); },
    linearRampToValueAtTime(value, time) { this.events.push({ type: 'linear', value, time }); },
    exponentialRampToValueAtTime(value, time) { assert.ok(value > 0); this.events.push({ type: 'exponential', value, time }); } });
  class Context {
    state = suspended ? 'suspended' : 'running'; currentTime = 10; sampleRate = sampleRate;
    destination = {}; nodes = []; sources = []; buffers = [];
    constructor() { contexts.push(this); }
    close() { this.state = 'closed'; return Promise.resolve(); }
    resume() {
      if (rejectResume) return Promise.reject(new Error('blocked'));
      return new Promise(resolve => resumes.push(() => { this.state = 'running'; resolve(); }));
    }
    node(kind, fields = {}) {
      const node = { kind, ...fields, connect(output) { this.output = output; }, disconnect() { this.disconnected = true; } };
      this.nodes.push(node); return node;
    }
    createGain() { return this.node('gain', { gain: parameter() }); }
    createBiquadFilter() { return this.node('filter', { frequency: parameter(), Q: parameter() }); }
    createBuffer(channels, length, rate) {
      if (failBuffer) throw new Error('unavailable');
      const data = new Float32Array(length);
      const buffer = { numberOfChannels: channels, length, duration: length / rate, getChannelData: () => data };
      this.buffers.push(buffer); return buffer;
    }
    source(kind, fields = {}) {
      const source = this.node(kind, { ...fields,
        start(time) { this.started = time; }, stop(time) { this.stopCalls ??= []; this.stopCalls.push(time); },
      });
      this.sources.push(source); return source;
    }
    createBufferSource() { return this.source('noise'); }
    createOscillator() { return this.source('oscillator', { frequency: parameter() }); }
  }
  const document = { get hidden() { return !visible; }, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) };
  const sandbox = { exports: {}, window: available ? { AudioContext: Context } : {}, document, performance: { now: () => wallTime }, Float32Array,
    require: () => ({
      useState: initial => { const key = index++; if (!(key in hooks)) hooks[key] = initial; return [hooks[key], value => { hooks[key] = value; }]; },
      useRef: initial => { const key = index++; return hooks[key] ??= { current: initial }; },
      useCallback: fn => { index++; return fn; },
      useEffect: fn => { index++; if (!mounted) cleanups.push(fn()); },
    }),
  };
  vm.runInNewContext(code, sandbox);
  const render = () => { index = 0; const sound = sandbox.exports.useStudyWaterSound(); mounted = true; return sound; };
  return { render, contexts, listeners, timing: sandbox.exports.STUDY_WATER_TIMING,
    hide: () => { visible = false; listeners.get('visibilitychange')?.(); },
    unmount: () => cleanups.forEach(fn => fn?.()),
    resume: async (elapsed = 0) => { wallTime += elapsed; resumes.splice(0).forEach(fn => fn()); await Promise.resolve(); await Promise.resolve(); },
  };
}

const normal = fixture();
assert.equal(normal.render().enabled, false, 'Study defaults to silence');
normal.render().play();
assert.equal(normal.contexts.length, 0, 'Silent study does not create an audio context');
normal.render().toggle();
assert.equal(normal.render().enabled, true);
assert.equal(normal.contexts.length, 0, 'Enabling sound does not audition or autoplay');
normal.render().play();
const audio = normal.contexts[0];
assert.equal(audio.sources.filter(node => node.kind === 'noise').length, 3, 'Entry, submersion and return each have a filtered water texture');
assert.ok(audio.sources.filter(node => node.kind === 'oscillator').length >= 4, 'Use a scattered resonant droplet layer');
assert.ok(audio.nodes.filter(node => node.kind === 'filter').length >= 3);
const starts = audio.sources.filter(node => node.kind === 'noise').map(node => node.started - 10);
assert.ok(Math.abs(starts[0] - .5) < .01 && Math.abs(starts[1] - 1.2) < .01 && Math.abs(starts[2] - 2.1) < .01, 'Water phases follow the visual contact/submersion/crest-emergence timing');
assert.ok(audio.sources.every(node => node.started >= 10 && node.stopCalls[0] <= 14), 'The complete sequence is bounded to four seconds');
const envelopes = audio.nodes.filter(node => node.kind === 'gain').map(node => node.gain.events);
assert.ok(envelopes.every(events => events.every(event => Number.isFinite(event.value) && event.value >= 0 && event.value <= .4)), 'Keep the fuller water mix bounded');
assert.ok(envelopes.some(events => events.some(event => event.value >= .32)), 'The audition has a more substantial mix than the old light bubbles');
assert.ok(envelopes.filter(events => events.some(event => event.type === 'linear')).length >= 3, 'Water textures have soft attacks and releases');
assert.ok(audio.buffers[0].getChannelData(0).some(sample => sample !== 0), 'Water noise contains actual texture');
normal.render().play();
assert.equal(audio.state, 'closed');
assert.ok(audio.nodes.every(node => node.disconnected), 'Restart releases the previous entire graph');
assert.ok(audio.sources.every(node => node.stopCalls.length >= 2), 'Restart cancels every scheduled source');
const next = normal.contexts[1];
assert.notDeepEqual(Array.from(audio.buffers[0].getChannelData(0).slice(0, 16)), Array.from(next.buffers[0].getChannelData(0).slice(0, 16)), 'Each dive varies the water texture');
normal.render().stop();
assert.equal(next.state, 'closed');
assert.ok(next.nodes.every(node => node.disconnected));
normal.render().play();
normal.render().toggle();
assert.equal(normal.contexts[2].state, 'closed');
normal.render().play();
assert.equal(normal.contexts.length, 3, 'Muted activation creates no new graph');
normal.unmount();
assert.equal(normal.listeners.size, 0);

for (const cancel of ['toggle', 'hide', 'unmount', 'stop']) {
  const pending = fixture({ suspended: true }); pending.render().toggle(); pending.render().play();
  if (cancel === 'toggle' || cancel === 'stop') pending.render()[cancel](); else pending[cancel]();
  await pending.resume();
  assert.equal(pending.contexts[0].sources.length, 0, `A late audio resume must not play after ${cancel}`);
  pending.unmount();
}
const restarted = fixture({ suspended: true }); restarted.render().toggle(); restarted.render().play(); restarted.render().play();
await restarted.resume();
assert.equal(restarted.contexts[0].sources.length, 0, 'Stale resume cannot revive the replaced dive');
assert.ok(restarted.contexts[1].sources.length > 0); restarted.unmount();
const late = fixture({ suspended: true }); late.render().toggle(); late.render().play(); await late.resume(1800);
assert.ok(late.contexts[0].sources.every(node => node.started >= 10), 'Resume skips phases whose visual moment already passed');
assert.equal(late.contexts[0].sources.filter(node => node.kind === 'noise').length, 1, 'Late resume does not replay the entry or submersion wash'); late.unmount();
const expired = fixture({ suspended: true }); expired.render().toggle(); expired.render().play(); await expired.resume(4500);
assert.equal(expired.contexts[0].sources.length, 0, 'Expired dives stay silent'); expired.unmount();
for (const options of [{ available: false }, { suspended: true, rejectResume: true }, { failBuffer: true }]) {
  const unsupported = fixture(options); unsupported.render().toggle(); assert.doesNotThrow(() => unsupported.render().play());
  await Promise.resolve(); await Promise.resolve();
  assert.ok(unsupported.contexts.every(context => context.nodes.every(node => node.disconnected)), 'Failure releases any partial graph');
  unsupported.unmount();
}
const completed = fixture(); completed.render().toggle(); completed.render().play();
const finalAudio = completed.contexts[0];
for (const source of finalAudio.sources) source.onended?.();
assert.ok(finalAudio.nodes.every(node => node.disconnected), 'Natural completion releases the complete graph');
assert.equal(finalAudio.state, 'closed', 'Natural completion releases audio hardware');
completed.unmount();
console.log('Study water sound passed: silent default, explicit audition, phase timing, textured bounded mix, variation, cancellation/resume races, failures and full graph cleanup.');

// Optional offline audition of the actual captured graph. This mirrors the
// mono buffer, sine sources, bandpass filters, and parameter envelopes in DSP;
// it is an approximation of browser Web Audio, without altering mix loudness.
// Usage: node scripts/verify-study-water-sound.mjs --render /tmp/study-water.wav
const renderFlag = process.argv.indexOf('--render');
if (renderFlag !== -1) {
  const destination = process.argv[renderFlag + 1];
  assert.ok(destination?.endsWith('.wav'), 'Provide a WAV output path after --render');
  const audition = fixture({ sampleRate: 44_100 });
  audition.render().toggle(); audition.render().play();
  const graph = audition.contexts[0], rate = graph.sampleRate;
  const samples = new Float64Array(Math.ceil(audition.timing.duration * rate));
  const parameterAt = (parameter, time) => {
    let previous = { time: 0, value: 0 };
    for (const event of parameter.events) {
      if (time < event.time) {
        const portion = Math.max(0, Math.min(1, (time - previous.time) / (event.time - previous.time)));
        if (event.type === 'linear') return previous.value + (event.value - previous.value) * portion;
        if (event.type === 'exponential' && previous.value > 0) return previous.value * (event.value / previous.value) ** portion;
        return previous.value;
      }
      previous = event;
    }
    return previous.value;
  };
  for (const source of graph.sources) {
    const filter = source.kind === 'noise' ? source.output : null;
    const envelope = filter ? filter.output : source.output;
    const master = envelope.output;
    const first = Math.ceil((source.started - graph.currentTime) * rate);
    const last = Math.min(samples.length, Math.ceil((source.stopCalls[0] - graph.currentTime) * rate));
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0, phase = 0;
    for (let index = Math.max(0, first); index < last; index += 1) {
      const time = graph.currentTime + index / rate;
      let sample;
      if (filter) {
        const input = source.buffer.getChannelData(0)[index - first] ?? 0;
        const frequency = parameterAt(filter.frequency, time);
        const q = parameterAt(filter.Q, time);
        const omega = 2 * Math.PI * frequency / rate;
        const alpha = Math.sin(omega) / (2 * q);
        const denominator = 1 + alpha;
        sample = alpha / denominator * input - alpha / denominator * x2 + 2 * Math.cos(omega) / denominator * y1 - (1 - alpha) / denominator * y2;
        x2 = x1; x1 = input; y2 = y1; y1 = sample;
      } else {
        sample = Math.sin(phase);
        phase += 2 * Math.PI * parameterAt(source.frequency, time) / rate;
      }
      samples[index] += sample * parameterAt(envelope.gain, time) * parameterAt(master.gain, time);
    }
  }
  let peak = 0, sumSquares = 0;
  for (const sample of samples) { assert.ok(Number.isFinite(sample)); peak = Math.max(peak, Math.abs(sample)); sumSquares += sample * sample; }
  assert.ok(peak > .005 && peak < .4, `Offline mix remains audible-sized and far below clipping (${peak})`);
  const bytes = samples.length * 2;
  const wav = Buffer.alloc(44 + bytes);
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + bytes, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28);
  wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(bytes, 40);
  samples.forEach((sample, index) => wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), 44 + index * 2));
  await writeFile(destination, wav);
  audition.unmount();
  console.log(`Offline audition exported: ${destination}; ${(20 * Math.log10(peak)).toFixed(1)} dBFS peak, ${(20 * Math.log10(Math.sqrt(sumSquares / samples.length))).toFixed(1)} dBFS RMS. Listening is still required for subjective judgment.`);
}
