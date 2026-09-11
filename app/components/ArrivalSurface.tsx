import type { ReactNode } from 'react';
import { ARRIVAL_BEATS as BEATS } from './arrivalTimeline';

type ArrivalSurfaceProps = {
  elapsedMs: number;
  /** The resting hero's viewport center and waterline, held fixed during takeoff. */
  x: number;
  y: number;
  size: number;
};

const unit = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = unit(value); return p * p * (3 - 2 * p); };
const seed = (index: number) => { const n = Math.sin(index * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };

/** Slightly uneven contours keep the water from looking like concentric vector targets. */
function contour(radius: number, depth: number, top: number, from: number, to: number, phase: number) {
  return Array.from({ length: 37 }, (_, i) => {
    const angle = from + (to - from) * i / 36;
    const x = Math.cos(angle) * radius + Math.sin(angle * 3 + phase) * 1.4;
    const y = top + Math.sin(angle) * depth + Math.sin(angle * 5 + phase) * .9;
    return `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
}

function droplets(time: number, launching: boolean): ReactNode[] {
  const count = launching ? 12 : 18;
  return Array.from({ length: count }, (_, i) => {
    const variation = seed(i + (launching ? 91 : 17));
    const start = launching
      ? BEATS.liftStart + i * 24
      : BEATS.wakeEnd + 70 + i / (count - 1) * (BEATS.shakeEnd - BEATS.wakeEnd - 620);
    const duration = launching ? 490 + variation * 190 : 350 + variation * 170;
    const p = (time - start) / duration;
    if (p <= 0) return null;

    const side = i % 2 ? 1 : -1;
    const originX = launching ? side * (27 + variation * 66) : (seed(i + 41) - .5) * 430;
    const originY = launching ? 0 : -100 - seed(i + 67) * 180;
    const distance = launching ? side * (64 + seed(i + 82) * 142) : side * (25 + variation * 72);
    const rise = launching ? 35 + variation * 88 : 10 + variation * 16;
    const impact = (time - start - duration) / 630;
    if (impact >= 1) return null;

    // Every drop lands at y=0. The following ripple starts at that exact point
    // and instant instead of being a separate decorative particle animation.
    if (impact >= 0) {
      const radius = 2 + Math.pow(impact, .7) * (launching ? 23 : 13);
      const opacity = smooth(impact * 14) * Math.pow(1 - impact, 1.7) * (launching ? .45 : .3);
      return <g key={i} data-impact={launching ? 'launch' : 'shake'} transform={`translate(${originX + distance} 0)`} opacity={opacity}>
        <ellipse rx={radius} ry={radius * .17} stroke="#397a6c" strokeWidth=".9" />
        <path d={contour(radius + 1.5, radius * .17, 1.5, .1, Math.PI * .91, time / 1200)} stroke="#edf0d9" strokeWidth="1.2" />
      </g>;
    }

    const x = originX + distance * p;
    const y = originY * (1 - p * p) - 4 * rise * p * (1 - p);
    const velocityY = -2 * originY * p - 4 * rise * (1 - 2 * p);
    const angle = Math.atan2(velocityY, distance) * 180 / Math.PI - 90;
    const opacity = smooth(p / .1) * (1 - smooth((p - .84) / .16));
    const radius = launching ? 1.4 + variation * 1.5 : 1.1 + variation * 1.2;
    return <g key={i} data-drop={launching ? 'launch' : 'shake'} opacity={opacity} transform={`translate(${x} ${y}) rotate(${angle})`}>
      <ellipse rx={radius} ry={radius * (launching ? 1.7 : 1.35)} fill="#eef1d9" fillOpacity=".79" stroke="#477d70" strokeOpacity=".56" strokeWidth=".65" />
      <path d={`M${-radius * .25} ${-radius * .8}q${-radius * .3} ${radius * .35} 0 ${radius * .9}`} stroke="#fff7e5" strokeWidth=".8" fill="none" />
    </g>;
  });
}

/** Foreground water at the original resting position, driven only by the shared timeline. */
export function ArrivalSurface({ elapsedMs, x, y, size }: ArrivalSurfaceProps) {
  if (![elapsedMs, x, y, size].every(Number.isFinite) || size <= 0 || elapsedMs >= BEATS.launchEnd) return null;
  const time = Math.max(0, elapsedMs);
  const phase = time / 950;
  const resting = 1 - smooth((time - BEATS.liftStart) / (BEATS.liftClear - BEATS.liftStart));
  const fade = 1 - smooth((time - (BEATS.launchEnd - 550)) / 550);
  const compression = Math.sin(Math.PI * unit((time - BEATS.shakeEnd) / (BEATS.liftStart - BEATS.shakeEnd)));
  const push = smooth((time - BEATS.liftStart) / 150) * (1 - smooth((time - BEATS.liftClear) / 420));
  const breath = Math.sin(time / 800) * 1.1;

  return <svg
    aria-hidden="true"
    focusable="false"
    className="arrival-surface"
    viewBox="-600 -500 1200 700"
    fill="none"
    style={{ position: 'absolute', left: x - size * .6, top: y - size * .5, width: size * 1.2, height: size * .7, overflow: 'visible', pointerEvents: 'none', opacity: fade }}
  >
    <g data-surface="rest" opacity={resting} strokeLinecap="round" strokeLinejoin="round">
      {/* A transparent, curved meniscus softens the body's clipped waterline. */}
      <path d={`M-237 ${1 + breath}C-165 ${-4 + breath} -122 5 -54 2S67 -4 130 1 211 3 259 0C207 11 139 16 56 15S-153 16 -237 ${1 + breath}Z`} fill="#91b9a5" fillOpacity=".2" />
      <path d={`M-241 ${breath}C-190 -3 -151 4 -108 2M-61 1Q-24 -1 13 1T115 1M151 2Q211 4 252 ${breath}`} stroke="#dbe5c9" strokeWidth="1.35" strokeOpacity=".46" />
      <path d="M-222 5C-167 10 -111 10 -68 7M13 8C54 5 82 8 110 7M147 9C189 9 222 6 246 4" stroke="#477e6e" strokeWidth="1" strokeOpacity=".5" />

      {[0, 1, 2].map((i) => {
        const radius = 261 + i * 35 + Math.sin(phase + i) * 2 - compression * (5 - i);
        const depth = 20 + i * 13 + compression * 2;
        const top = 1 + i * 1.7;
        return <g key={i} opacity={1 - i * .23}>
          <path d={contour(radius, depth, top, .025, Math.PI - .02, phase + i)} stroke="#467e70" strokeWidth={i ? 1 : 1.5} strokeOpacity=".5" />
          <path d={contour(radius - 3, depth - 1.7, top + 3, .19, Math.PI * .92, phase + i)} stroke="#e0e7c9" strokeWidth={i ? 1.2 : 1.6} strokeOpacity=".46" />
          {/* Only the exposed ends of rear arcs appear in front of the body. */}
          <path d={contour(radius, depth * .48, top, Math.PI * 1.01, Math.PI * 1.14, phase + i)} stroke="#5b8f7b" strokeWidth=".9" strokeOpacity=".34" />
          <path d={contour(radius, depth * .48, top, Math.PI * 1.87, Math.PI * 1.99, phase + i)} stroke="#5b8f7b" strokeWidth=".9" strokeOpacity=".3" />
        </g>;
      })}

      {/* Broken reflections carry the bird's copper and dark feathers into the pond. */}
      {[0, 1, 2, 3].map((i) => {
        const drift = Math.sin(phase * 1.4 + i * 1.7) * (2 + i);
        const top = 14 + i * 10;
        return <g key={i} transform={`translate(${drift} ${top})`} opacity={.32 - i * .06}>
          <path d={`M${44 - i * 6} 0q${21 + i * 2} ${-2 + Math.sin(phase + i) * 2} ${45 + i * 5} 0t${22 + i * 3} 1`} stroke="#ad783d" strokeWidth={2.8 - i * .25} />
          <path d={`M${-108 - i * 4} 1q24 3 ${52 + i * 7} -1m12 1q13 -2 27 0`} stroke="#355d50" strokeWidth="1.4" />
        </g>;
      })}
    </g>

    {push > 0 && <g data-surface="push" opacity={push} fill="#d5e4cd" fillOpacity=".28" stroke="#4e8979" strokeOpacity=".32" strokeWidth=".8">
      <path d={`M-61 3C-64 ${-push * 5} -94 ${-push * 16} -119 ${-push * 22}Q-116 ${-push * 17} -104 ${-push * 14}C-84 ${-push * 7} -68 ${-push * 2} -28 5Z`} />
      <path d={`M43 5C67 ${-push * 3} 82 ${-push * 13} 106 ${-push * 15}Q101 ${-push * 11} 91 ${-push * 8}C81 ${-push * 4} 70 3 43 5Z`} />
      <path d="M-98 5Q-24 19 81 5" stroke="#eaf0d4" strokeOpacity=".7" strokeWidth="2.2" fill="none" />
    </g>}
    {time >= BEATS.liftStart && <g strokeLinecap="round">
      {[0, 1].map((i) => {
        const p = unit((time - BEATS.liftStart - i * 150) / (BEATS.launchEnd - BEATS.liftStart));
        if (!p) return null;
        const radius = 146 + Math.pow(p, .78) * 275;
        const alpha = Math.sin(Math.PI * p) * .44;
        return <g key={i} opacity={alpha}>
          <path d={contour(radius, radius * .115, 3 + p * 7, .03, Math.PI * .98, phase + i)} stroke="#3b7a6a" strokeWidth="1.3" />
          <path d={contour(radius - 4, radius * .115, 5 + p * 7, .16, Math.PI * .9, phase + i)} stroke="#e9eed2" strokeWidth="1.8" />
        </g>;
      })}
    </g>}
    {droplets(time, false)}
    {droplets(time, true)}
  </svg>;
}
