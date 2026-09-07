'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ReadingGrebe } from './ReadingGrebe';
import { startPondVisits, type PondVisit } from './pondSchedule';

type GrebeFieldVariant = 'home' | 'book' | 'site';

function CuriousPeeker() {
  const peeker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let last = { x: 0, y: 0, time: 0 }, retreatUntil = 0;
    let recovery: ReturnType<typeof setTimeout>;
    const follow = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || reducedMotion.matches || !peeker.current) return;
      const time = performance.now();
      const distance = Math.hypot(event.clientX - last.x, event.clientY - last.y);
      const speed = last.time ? distance / Math.max(1, time - last.time) : 0;
      const nearby = event.clientX < 170 && Math.abs(event.clientY - innerHeight * .38 - 50) < 120;
      if (nearby && speed > 1.1) {
        retreatUntil = time + 1500;
        clearTimeout(recovery);
        recovery = setTimeout(() => {
          if (peeker.current?.dataset.mood === 'shy') peeker.current.dataset.mood = 'curious';
        }, 1500);
      }
      peeker.current.dataset.mood = nearby ? (time < retreatUntil ? 'shy' : 'curious') : 'idle';
      last = { x: event.clientX, y: event.clientY, time };
    };
    const leave = () => { clearTimeout(recovery); if (peeker.current) peeker.current.dataset.mood = 'idle'; };
    window.addEventListener('pointermove', follow, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => { clearTimeout(recovery); window.removeEventListener('pointermove', follow); document.documentElement.removeEventListener('pointerleave', leave); };
  }, []);
  return <span ref={peeker} className="pond-peeker"><span className="pond-sprite pond-sprite--peek" /></span>;
}

/** Transparent decoration never catches clicks; the scheduler owns exactly two slots. */
export function GrebeField({ variant }: { variant: GrebeFieldVariant }) {
  const [visits, setVisits] = useState<Array<PondVisit & { session: number }>>([]);
  const session = useRef(0);
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let stop = () => {};
    const reset = () => {
      stop(); setVisits([]);
      if (!document.hidden && !reducedMotion.matches) {
        // Batched resets need fresh DOM keys to restart the CSS animation clock.
        const currentSession = ++session.current;
        stop = startPondVisits(next => setVisits(next.map(visit => ({ ...visit, session: currentSession }))));
      }
    };
    reset();
    document.addEventListener('visibilitychange', reset);
    reducedMotion.addEventListener('change', reset);
    return () => { stop(); document.removeEventListener('visibilitychange', reset); reducedMotion.removeEventListener('change', reset); };
  }, []);
  return (
    <div className={`grebe-field pond-drift-field grebe-field--${variant} pointer-events-none`} aria-hidden="true">
      {visits.map(visit => (
        <span key={`${visit.session}-${visit.id}`} className={`pond-swimmer pond-swimmer--${visit.side}${visit.encounter ? ' pond-swimmer--meeting' : ''}`}
          style={{ '--visit-duration': `${visit.duration}s`, '--visit-height': `${visit.height}vh`, '--visit-size': `${visit.size}px`, animationDelay: `-${visit.headStart}s` } as CSSProperties}>
          {visit.reading ? <ReadingGrebe /> : (
            <span className={`pond-heading pond-heading--${visit.side}`}><span className="pond-sprite pond-sprite--swim" /></span>
          )}
        </span>
      ))}
      <CuriousPeeker />
    </div>
  );
}
