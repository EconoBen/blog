'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ARRIVAL_DURATION_MS, getArrivalPhase } from './arrivalTimeline';
import type { ArrivalPhase } from './arrivalTimeline';
import { isRestoredArrivalVisit } from './ArrivalVisitMarker';
import { ARRIVAL_PREPARATION_EVENT, GREBE_ARRIVAL_SESSION_KEY, isArrivalPreparationSuppressed, releaseArrivalPreparation } from './arrivalPreparationController';

export { GREBE_ARRIVAL_SESSION_KEY } from './arrivalPreparationController';
const ASSET_LOAD_TIMEOUT_MS = 2_500;
const MAX_AUTOPLAY_SCROLL_Y = 160;
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// A document-local fallback also covers browsers that refuse sessionStorage.
// Neither storage nor any other browser API is accessed during module evaluation.
let seenInThisDocument = false;

function hasSeenArrival(): boolean {
  if (seenInThisDocument) return true;
  try {
    seenInThisDocument = window.sessionStorage.getItem(GREBE_ARRIVAL_SESSION_KEY) !== null;
    return seenInThisDocument;
  } catch {
    return false;
  }
}

function markArrivalSeen(): void {
  seenInThisDocument = true;
  try {
    window.sessionStorage.setItem(GREBE_ARRIVAL_SESSION_KEY, '1');
  } catch {
    // An unavailable storage area must not block the page or repeat the film.
  }
}

type ArrivalState = { active: boolean; loading: boolean; elapsedMs: number };
type ArrivalControls = { skip: () => void; replay: () => void };
type ArrivalOptions = { assetUrls: string[]; durationMs?: number };

export function useGrebeArrival({ assetUrls, durationMs = ARRIVAL_DURATION_MS }: ArrivalOptions):
  ArrivalState & ArrivalControls & { phase: ArrivalPhase } {
  const pathname = usePathname();
  // Keep the pond paused until eligibility is known. The native preparation
  // cover protects eligible first visits before this controller hydrates.
  const [state, setState] = useState<ArrivalState>({ active: false, loading: true, elapsedMs: 0 });
  const controls = useRef<ArrivalControls | null>(null);
  const restoredPath = useRef<string | null>(null);
  const preparationEffect = useRef(0);
  const skip = useCallback(() => controls.current?.skip(), []);
  const replay = useCallback(() => controls.current?.replay(), []);
  // Frame updates must not restart loading when a caller creates an equivalent array.
  const assetKey = JSON.stringify(assetUrls);
  const duration = Number.isFinite(durationMs) && durationMs > 0 ? durationMs : ARRIVAL_DURATION_MS;

  useBrowserLayoutEffect(() => {
    if (state.active) releaseArrivalPreparation('active');
  }, [state.active]);

  useEffect(() => {
    const effect = ++preparationEffect.current;
    if (restoredPath.current !== pathname) restoredPath.current = null;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let generation = 0;
    let frameId: number | null = null;
    let deadlineId: number | null = null;
    let images: HTMLImageElement[] = [];
    let running = false;
    let preparing = false;
    let ready = false;
    let manual = false;
    let elapsed = 0;
    let lastVisibleTime = 0;

    const onHome = () => pathname === '/' && window.location.pathname === '/';
    const canAutoplay = () => {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      return onHome() && !window.location.hash && window.scrollY <= MAX_AUTOPLAY_SCROLL_Y
        && navigation?.type !== 'back_forward' && restoredPath.current !== pathname
        && !isRestoredArrivalVisit(pathname) && !isArrivalPreparationSuppressed() && !hasSeenArrival();
    };
    const clearFrame = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
    };
    const clearAssets = () => {
      if (deadlineId !== null) window.clearTimeout(deadlineId);
      deadlineId = null;
      for (const image of images) {
        image.onload = null;
        image.onerror = null;
      }
      images = [];
    };
    const cancel = (publish = true, retainPreparation = false) => {
      generation += 1;
      clearFrame();
      clearAssets();
      running = false;
      preparing = false;
      ready = false;
      if (!retainPreparation) releaseArrivalPreparation('cancel');
      if (publish && !disposed) setState({ active: false, loading: false, elapsedMs: elapsed });
    };
    const finish = () => {
      running = false;
      clearFrame();
      setState({ active: false, loading: false, elapsedMs: elapsed });
    };
    const advanceClock = (now: number) => {
      elapsed = Math.min(duration, elapsed + Math.max(0, now - lastVisibleTime));
      lastVisibleTime = now;
    };
    const tick = (now: number) => {
      frameId = null;
      if (!running || disposed) return;
      if (!onHome() || motion.matches) { cancel(); return; }
      if (document.hidden) return;
      advanceClock(now);
      if (elapsed >= duration) { finish(); return; }
      setState({ active: true, loading: false, elapsedMs: elapsed });
      frameId = window.requestAnimationFrame(tick);
    };
    const startWhenVisible = () => {
      if (!ready || disposed) return;
      if (!onHome() || motion.matches || (!manual && !canAutoplay())) { cancel(); return; }
      if (document.hidden) return;
      ready = false;
      running = true;
      elapsed = 0;
      lastVisibleTime = window.performance.now();
      markArrivalSeen();
      setState({ active: true, loading: false, elapsedMs: 0 });
      frameId = window.requestAnimationFrame(tick);
    };
    const prepare = (requested: boolean) => {
      cancel(true, true);
      elapsed = 0;
      manual = requested;
      if (!onHome() || motion.matches || (!manual && !canAutoplay())) { releaseArrivalPreparation('cancel'); return; }
      preparing = true;
      const attempt = generation;
      setState({ active: false, loading: true, elapsedMs: 0 });
      deadlineId = window.setTimeout(() => {
        if (!disposed && generation === attempt) cancel();
      }, ASSET_LOAD_TIMEOUT_MS);

      const urls = [...new Set(JSON.parse(assetKey) as string[])];
      Promise.all(urls.map(url => new Promise<void>((resolve, reject) => {
        const image = new window.Image();
        images.push(image);
        let settled = false;
        const loaded = () => {
          if (settled || disposed || generation !== attempt) return;
          settled = true;
          if (image.naturalWidth === 0) { reject(new Error('Arrival artwork is empty')); return; }
          if (typeof image.decode === 'function') image.decode().then(() => resolve(), reject);
          else resolve();
        };
        image.onload = loaded;
        image.onerror = () => {
          if (settled || disposed || generation !== attempt) return;
          settled = true;
          reject(new Error('Arrival artwork failed to load'));
        };
        image.src = url;
        if (image.complete && image.naturalWidth > 0) loaded();
      }))).then(() => {
        if (disposed || generation !== attempt) return;
        clearAssets();
        preparing = false;
        ready = true;
        setState({ active: false, loading: false, elapsedMs: 0 });
        startWhenVisible();
      }).catch(() => {
        if (!disposed && generation === attempt) cancel();
      });
    };

    const onVisibility = () => {
      if (!running) { if (!document.hidden) startWhenVisible(); return; }
      if (document.hidden) {
        advanceClock(window.performance.now());
        clearFrame();
        if (elapsed >= duration) finish();
        else setState({ active: true, loading: false, elapsedMs: elapsed });
      } else {
        lastVisibleTime = window.performance.now();
        clearFrame();
        frameId = window.requestAnimationFrame(tick);
      }
    };
    const onMotion = () => { if (motion.matches) cancel(); };
    const onDeparture = () => cancel();
    const onPreparationDismiss = () => cancel();
    const onHistory = () => {
      restoredPath.current = window.location.pathname;
      cancel();
    };
    const onScroll = () => {
      if (!manual && (preparing || ready) && window.scrollY > MAX_AUTOPLAY_SCROLL_Y) cancel();
    };
    controls.current = {
      skip: () => { markArrivalSeen(); cancel(); },
      replay: () => prepare(true),
    };
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);
    window.addEventListener('pagehide', onDeparture);
    window.addEventListener('popstate', onHistory);
    window.addEventListener('hashchange', onDeparture);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener(ARRIVAL_PREPARATION_EVENT, onPreparationDismiss);
    prepare(false);

    return () => {
      disposed = true;
      cancel(false, true);
      // React StrictMode immediately installs a replacement effect. Only a
      // real unmount should release a still-pending native cover.
      queueMicrotask(() => { if (preparationEffect.current === effect) releaseArrivalPreparation('unmount'); });
      controls.current = null;
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotion);
      window.removeEventListener('pagehide', onDeparture);
      window.removeEventListener('popstate', onHistory);
      window.removeEventListener('hashchange', onDeparture);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener(ARRIVAL_PREPARATION_EVENT, onPreparationDismiss);
    };
  }, [assetKey, duration, pathname]);

  return { ...state, phase: state.active ? getArrivalPhase(state.elapsedMs) : 'done', skip, replay };
}
