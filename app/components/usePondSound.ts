'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Bubble = { oscillator: OscillatorNode; gain: GainNode };

/** Call play only from the visitor's explicit dive activation. */
export function usePondSound() {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);
  const mounted = useRef(false);
  const context = useRef<AudioContext | null>(null);
  const bubbles = useRef(new Set<Bubble>());
  const generation = useRef(0);

  const stop = useCallback((close = false) => {
    generation.current += 1;
    for (const { oscillator, gain } of bubbles.current) {
      oscillator.onended = null;
      try { oscillator.stop(); } catch { /* Already ended. */ }
      oscillator.disconnect();
      gain.disconnect();
    }
    bubbles.current.clear();
    if (close && context.current) {
      const previous = context.current;
      context.current = null;
      void previous.close().catch(() => {});
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    const hide = () => { if (document.hidden) stop(true); };
    document.addEventListener('visibilitychange', hide);
    return () => {
      mounted.current = false;
      document.removeEventListener('visibilitychange', hide);
      stop(true);
    };
  }, [stop]);

  const toggle = useCallback(() => {
    enabledRef.current = !enabledRef.current;
    setEnabled(enabledRef.current);
    if (!enabledRef.current) stop(true);
  }, [stop]);

  const play = useCallback(() => {
    if (!enabledRef.current || !mounted.current || document.hidden) return;
    stop();
    const request = generation.current;
    const Audio = window.AudioContext ?? (window as Window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;
    if (!Audio) return;
    try {
      if (!context.current || context.current.state === 'closed') context.current = new Audio();
      const audio = context.current;
      const schedule = () => {
        if (generation.current !== request || !mounted.current || !enabledRef.current ||
          document.hidden || context.current !== audio || audio.state !== 'running') return;
        try {
          [0.05, 1.25, 2.1].forEach((delay, index) => {
            const oscillator = audio.createOscillator();
            const gain = audio.createGain();
            const bubble = { oscillator, gain };
            bubbles.current.add(bubble);
            const start = audio.currentTime + delay;
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(210 + index * 65, start);
            oscillator.frequency.exponentialRampToValueAtTime(470 + index * 100, start + 0.13);
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(0.032 - index * 0.004, start + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
            oscillator.connect(gain);
            gain.connect(audio.destination);
            oscillator.onended = () => {
              oscillator.disconnect();
              gain.disconnect();
              bubbles.current.delete(bubble);
            };
            oscillator.start(start);
            oscillator.stop(start + 0.18);
          });
        } catch { stop(true); }
      };
      // Resume stays inside the activation call; its continuation is cancellation-safe.
      if (audio.state === 'suspended') void audio.resume().then(schedule).catch(() => {});
      else schedule();
    } catch {
      // Audio is an optional flourish; unsupported browsers still get the full dive.
      stop(true);
    }
  }, [stop]);

  return { enabled, toggle, play };
}
