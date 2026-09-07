'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Seconds from the visitor's dive activation, shared with the study animation. */
export const STUDY_WATER_TIMING = {
  entry: 0.5,
  submerged: 1.2,
  submergedEnd: 2.2,
  resurface: 2.1,
  duration: 3.65,
} as const;

/** An optional audition; mounting and enabling it are both silent. */
export function useStudyWaterSound() {
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  const mounted = useRef(false);
  const context = useRef<AudioContext | null>(null);
  const nodes = useRef(new Set<AudioNode>());
  const sources = useRef(new Set<AudioScheduledSourceNode>());
  const generation = useRef(0);

  const stop = useCallback(() => {
    generation.current += 1;
    for (const source of sources.current) {
      source.onended = null;
      try { source.stop(); } catch { /* It may have ended, or failed before starting. */ }
    }
    sources.current.clear();
    for (const node of nodes.current) node.disconnect();
    nodes.current.clear();
    const previous = context.current;
    context.current = null;
    if (previous && previous.state !== 'closed') void previous.close().catch(() => {});
  }, []);

  useEffect(() => {
    mounted.current = true;
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', hide);
    return () => {
      mounted.current = false;
      document.removeEventListener('visibilitychange', hide);
      stop();
    };
  }, [stop]);

  const toggle = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    setEnabled(enabledRef.current);
    if (!enabledRef.current) stop();
  }, [stop]);

  // Call only from the same explicit activation that starts the visual dive.
  const play = useCallback(() => {
    if (!enabledRef.current || !mounted.current || document.hidden) return;
    stop();
    const request = generation.current;
    const activatedAt = performance.now();
    const Audio = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Audio) return;

    try {
      const audio = new Audio();
      context.current = audio;
      const current = () => request === generation.current && context.current === audio && mounted.current && enabledRef.current && !document.hidden;
      const schedule = () => {
        if (!current() || audio.state !== 'running') return;
        const elapsed = Math.max(0, (performance.now() - activatedAt) / 1000);
        if (elapsed >= STUDY_WATER_TIMING.duration) { stop(); return; }

        try {
          const own = <T extends AudioNode>(node: T): T => { nodes.current.add(node); return node; };
          const ownSource = <T extends AudioScheduledSourceNode>(source: T): T => {
            own(source);
            sources.current.add(source);
            source.onended = () => {
              source.onended = null;
              sources.current.delete(source);
              if (current() && sources.current.size === 0) stop();
            };
            return source;
          };
          const base = audio.currentTime - elapsed;
          const master = own(audio.createGain());
          master.gain.setValueAtTime(0.35, audio.currentTime);
          master.connect(audio.destination);

          // Colored noise supplies the moving water; resonant droplets sit within it.
          // One short buffer is shared by three filtered washes, then fully released.
          const texture = audio.createBuffer(1, Math.ceil(audio.sampleRate * 1.1), audio.sampleRate);
          const samples = texture.getChannelData(0);
          let smooth = 0;
          for (let index = 0; index < samples.length; index += 1) {
            const white = Math.random() * 2 - 1;
            smooth = smooth * 0.78 + white * 0.22;
            samples[index] = Math.max(-1, Math.min(1, smooth * 1.55 + white * 0.25));
          }
          const variation = () => 0.93 + Math.random() * 0.14;
          const envelope = (gain: GainNode, start: number, duration: number, peak: number, attack: number, sustain = false) => {
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(peak, start + attack);
            if (sustain) gain.gain.linearRampToValueAtTime(peak * 0.62, start + duration * 0.56);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration - 0.025);
            gain.gain.linearRampToValueAtTime(0, start + duration);
          };
          const wash = (offset: number, duration: number, from: number, to: number, peak: number) => {
            // A slow audio resume must not replay a splash after its visual moment.
            if (offset < elapsed) return;
            const start = base + offset;
            const source = ownSource(audio.createBufferSource());
            const filter = own(audio.createBiquadFilter());
            const gain = own(audio.createGain());
            source.buffer = texture;
            filter.type = 'bandpass';
            filter.Q.setValueAtTime(0.8, start);
            filter.frequency.setValueAtTime(from * variation(), start);
            filter.frequency.exponentialRampToValueAtTime(to * variation(), start + duration);
            envelope(gain, start, duration, peak * variation(), Math.min(0.11, duration * 0.16), true);
            source.connect(filter); filter.connect(gain); gain.connect(master);
            source.start(start); source.stop(start + duration);
          };
          wash(STUDY_WATER_TIMING.entry, 0.64, 1050, 440, 0.34);
          wash(STUDY_WATER_TIMING.submerged, 1, 390, 220, 0.23);
          wash(STUDY_WATER_TIMING.resurface, 0.88, 580, 1450, 0.34);

          const droplets = [
            [0.68, 0.16, 520], [0.91, 0.13, 720],
            [1.33, 0.22, 390], [1.64, 0.19, 310], [2.02, 0.16, 470],
            [2.46, 0.14, 810], [2.95, 0.18, 580],
          ];
          for (const [offset, duration, pitch] of droplets) {
            const onset = offset + (Math.random() - 0.5) * 0.04;
            if (onset < elapsed) continue;
            const start = base + onset;
            const oscillator = ownSource(audio.createOscillator());
            const gain = own(audio.createGain());
            const frequency = pitch * variation();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, start);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.58, start + duration);
            envelope(gain, start, duration, 0.06 * variation(), 0.012);
            oscillator.connect(gain); gain.connect(master);
            oscillator.start(start); oscillator.stop(start + duration);
          }
          if (sources.current.size === 0) stop();
        } catch {
          if (current()) stop();
        }
      };

      // Resume is requested within the gesture; the continuation checks cancellation
      // and elapsed visual time before creating any scheduled sound sources.
      if (audio.state !== 'running') {
        void audio.resume().then(schedule).catch(() => { if (current()) stop(); });
      } else schedule();
    } catch {
      stop();
    }
  }, [stop]);

  return { enabled, toggle, play, stop };
}
