'use client';

import { useEffect, useRef } from 'react';
import { ARRIVAL_BEATS as BEATS } from './arrivalTimeline';

interface ArrivalPondProps {
  elapsedMs: number;
  width?: never;
  className?: string;
  onReady?: () => void;
}

type Surface = CanvasRenderingContext2D;
const PAPER = '#f7f2e8';
const MAX_BUFFER_PIXELS = 4_000_000;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => { const x = clamp(value); return x * x * (3 - 2 * x); };
const seed = (index: number) => { const n = Math.sin(index * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };

function sizeBuffer(canvas: HTMLCanvasElement, width: number, height: number, dpr = 1) {
  // Release the old height first so rotating a large viewport cannot briefly
  // combine the new width with the previous, taller buffer.
  canvas.height = 1;
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));
}

function ellipse(ctx: Surface, x: number, y: number, radius: number, flatten: number, alpha: number, color = '53,111,98') {
  if (radius < .1 || alpha <= 0) return;
  ctx.strokeStyle = `rgba(${color},${alpha})`;
  ctx.beginPath();
  ctx.ellipse(x, y, radius, Math.max(.3, radius * flatten), -.018, .08, Math.PI * 1.96);
  ctx.stroke();
}

function reeds(ctx: Surface, x: number, y: number, height: number, side: number, count: number, offset: number, time: number) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const variation = seed(i + offset);
    const rise = height * (.3 + variation * .7);
    const rootX = x + (seed(i + offset + 20) - .5) * height * .26;
    const sway = Math.sin(time * .48 + i * .64) * height * .011;
    const tipX = rootX + side * (seed(i + offset + 40) - .27) * height * .57 + sway;
    const tipY = y - rise;
    const bend = (rootX + tipX) / 2;
    ctx.lineWidth = .65 + variation * .8;
    ctx.strokeStyle = `rgba(37,76,62,${.3 + variation * .25})`;
    ctx.beginPath();
    ctx.moveTo(rootX, y);
    ctx.bezierCurveTo(rootX, y - rise * .34, bend, tipY + rise * .3, tipX, tipY);
    ctx.stroke();
    if (i % 3 === 0) {
      ctx.fillStyle = `rgba(107,100,64,${.38 + variation * .13})`;
      ctx.beginPath();
      ctx.ellipse(tipX, tipY + rise * .09, Math.max(1.1, height * .009), rise * .055, (tipX - rootX) / rise, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const leafY = y - rise * .35;
      const reach = side * height * (.16 + variation * .18) + sway * .65;
      ctx.fillStyle = `rgba(60,94,70,${.25 + variation * .17})`;
      ctx.beginPath();
      ctx.moveTo(rootX, leafY);
      ctx.quadraticCurveTo(rootX + reach * .25, leafY - rise * .36, rootX + reach, leafY - rise * .3);
      ctx.quadraticCurveTo(rootX + reach * .32, leafY - rise * .23, rootX, leafY);
      ctx.fill();
    }
    // A broken, compressed reflection gives the stems a place in the water.
    ctx.strokeStyle = 'rgba(35,79,67,.1)';
    ctx.lineWidth = 1.2;
    for (let j = 0; j < 6; j++) {
      const reflectionY = y + j * height * .025;
      const reflectionX = rootX + (rootX - tipX) * j * .023 + Math.sin(time * .6 + j) * 1.5;
      ctx.beginPath();
      ctx.moveTo(reflectionX - 3 - j, reflectionY);
      ctx.lineTo(reflectionX + 3 + j, reflectionY);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function makeLandscape(width: number, height: number, dpr: number, image: HTMLImageElement | null) {
  const layer = document.createElement('canvas');
  sizeBuffer(layer, width, height, dpr);
  const ctx = layer.getContext('2d');
  if (!ctx) { sizeBuffer(layer, 1, 1); return null; }
  ctx.scale(dpr, dpr);

  // Warm, low-contrast distance gives way to cooler, deeper water toward us.
  const water = ctx.createLinearGradient(0, 0, 0, height);
  water.addColorStop(0, PAPER);
  water.addColorStop(.27, '#f1edda');
  water.addColorStop(.38, '#dce3ce');
  water.addColorStop(.58, '#adcabb');
  water.addColorStop(.79, '#80aaa0');
  water.addColorStop(1, '#5d8e82');
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, width, height);

  if (image?.naturalWidth) {
    const panorama = document.createElement('canvas');
    sizeBuffer(panorama, layer.width, layer.height);
    const art = panorama.getContext('2d');
    if (art) {
      art.scale(dpr, dpr);
      // Move the shore farther back. Its engraving frames the open water rather
      // than placing a dense horizontal band through the bird's chest.
      const pictureWidth = Math.max(width * 1.13, height * 1.45);
      const pictureHeight = pictureWidth * image.naturalHeight / image.naturalWidth;
      const top = height * .35 - pictureHeight * .4;
      art.drawImage(image, (width - pictureWidth) / 2, top, pictureWidth, pictureHeight);
      art.globalCompositeOperation = 'destination-in';
      const edge = art.createLinearGradient(0, Math.max(0, top), 0, Math.min(height, top + pictureHeight));
      edge.addColorStop(0, 'rgba(0,0,0,0)');
      edge.addColorStop(.19, 'rgba(0,0,0,.65)');
      edge.addColorStop(.4, '#000');
      edge.addColorStop(.78, '#000');
      edge.addColorStop(1, 'rgba(0,0,0,0)');
      art.fillStyle = edge;
      art.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = .61;
      ctx.drawImage(panorama, 0, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    sizeBuffer(panorama, 1, 1);
  }

  // Low morning haze merges the reflected shore with the water, without a
  // sharp horizon. The lower foreground keeps its deeper teal color.
  const mist = ctx.createLinearGradient(0, height * .11, 0, height * .62);
  mist.addColorStop(0, 'rgba(247,242,232,0)');
  mist.addColorStop(.32, 'rgba(247,242,232,.3)');
  mist.addColorStop(.47, 'rgba(247,242,226,.63)');
  mist.addColorStop(.7, 'rgba(237,236,210,.25)');
  mist.addColorStop(1, 'rgba(247,242,232,0)');
  ctx.fillStyle = mist;
  ctx.fillRect(0, height * .11, width, height * .51);

  // An elongated reflection of the pale sky leaves the center calm and gives
  // the copper plumage a consistent source of warm light.
  ctx.save();
  ctx.translate(width * .53, height * .59);
  ctx.scale(width * .39, height * .55);
  const light = ctx.createRadialGradient(0, -.45, .025, 0, 0, 1);
  light.addColorStop(0, 'rgba(250,242,210,.42)');
  light.addColorStop(.4, 'rgba(241,237,203,.2)');
  light.addColorStop(1, 'rgba(239,238,213,0)');
  ctx.fillStyle = light;
  ctx.fillRect(-1, -1.2, 2, 2.4);
  ctx.restore();

  // Broken ink contours establish perspective but leave the main subject room.
  ctx.lineWidth = .65;
  for (let i = 0; i < 15; i++) {
    const depth = (i + 1) / 16;
    const y = height * (.46 + Math.pow(depth, 1.5) * .54);
    const side = i % 2 ? 1 : -1;
    const from = side < 0 ? -width * .08 : width * (.65 + seed(i + 701) * .12);
    const span = width * (.18 + seed(i + 721) * .2);
    ctx.strokeStyle = `rgba(39,83,72,${.035 + depth * .08})`;
    ctx.beginPath();
    ctx.moveTo(from, y);
    ctx.bezierCurveTo(from + span * .3, y - depth * height * .018, from + span * .68, y + depth * height * .023, from + span, y + depth * height * .006);
    ctx.stroke();
  }

  // Near-bank shadows sit underneath the moving reeds and anchor the frame.
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side < 0 ? 0 : width, height * .99);
    ctx.scale(Math.min(width * .18, height * .3), height * .25);
    const bank = ctx.createRadialGradient(0, .3, .03, 0, 0, 1);
    bank.addColorStop(0, 'rgba(31,72,59,.28)');
    bank.addColorStop(.48, 'rgba(41,84,67,.13)');
    bank.addColorStop(1, 'rgba(41,84,67,0)');
    ctx.fillStyle = bank;
    ctx.fillRect(-1, -1, 2, 2);
    ctx.restore();
  }

  const upperPaper = ctx.createLinearGradient(0, 0, 0, height * .3);
  upperPaper.addColorStop(0, 'rgba(247,242,232,.76)');
  upperPaper.addColorStop(1, 'rgba(247,242,232,0)');
  ctx.fillStyle = upperPaper;
  ctx.fillRect(0, 0, width, height * .3);
  return layer;
}

function drawWater(ctx: Surface, width: number, height: number, elapsedMs: number) {
  const time = elapsedMs / 1000;
  const centerX = width * .5;
  const waterline = height * .63;
  const scale = Math.min(width / 1200, height / 760);
  const heroSize = Math.min(width * 1.5, height * 1.1, 1100);
  ctx.save();
  ctx.lineCap = 'round';

  // Long reflected bands drift across the perspective of the pond. These are
  // continuous water features, not twinkling points that could read as stars.
  for (let i = 0; i < 23; i++) {
    const depth = (i + 1) / 24;
    const y = height * (.395 + Math.pow(depth, 1.7) * .6);
    const sway = Math.sin(time * .43 + i * .74);
    const center = width * (.52 + Math.sin(i * 1.93) * .095) + sway * (2 + depth * 5);
    const half = width * (.018 + depth * .11) * (.6 + seed(i + 450) * .65);
    const amplitude = (1 + depth * 4) * Math.max(.6, scale);
    ctx.strokeStyle = `rgba(246,243,215,${.07 + depth * .055})`;
    ctx.lineWidth = (.55 + depth * 1.25) * Math.max(.65, scale);
    ctx.beginPath();
    ctx.moveTo(center - half, y);
    ctx.bezierCurveTo(center - half * .38, y + sway * amplitude, center + half * .24, y - amplitude * .8, center + half, y + amplitude * .18);
    ctx.stroke();
    if (i % 3 === 0) {
      ctx.strokeStyle = `rgba(36,88,76,${.045 + depth * .04})`;
      ctx.beginPath();
      ctx.moveTo(center - half * .75, y + 3 + depth * 3);
      ctx.quadraticCurveTo(center, y + 4 + depth * 5, center + half * .72, y + 3 + depth * 3);
      ctx.stroke();
    }
  }

  // Broad reflected body weight persists until the feet clear the water. The
  // foreground SVG owns the meniscus and droplets so the two layers agree.
  const contact = 1 - ease((elapsedMs - BEATS.liftStart) / (BEATS.liftClear - BEATS.liftStart));
  if (contact > 0) {
    ctx.fillStyle = `rgba(29,76,63,${.07 * contact})`;
    ctx.beginPath();
    ctx.ellipse(centerX, waterline + 5 * scale, heroSize * .22, heroSize * .026, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // The push-off travels outward as a small set of widening wakes. Their rear
  // arcs stay behind the bird; the foreground layer draws the near-side crest.
  for (let i = 0; i < 3; i++) {
    const start = BEATS.liftStart + i * 150;
    const end = BEATS.featherContact - 550 + i * 90;
    const progress = (elapsedMs - start) / (end - start);
    if (progress <= 0 || progress >= 1) continue;
    const radius = heroSize * (.17 + Math.pow(progress, .78) * .47);
    const alpha = (.25 - i * .035) * ease(progress * 9) * Math.pow(1 - progress, 1.35);
    ctx.lineWidth = Math.max(.75, scale * 1.15);
    ellipse(ctx, centerX + progress * 7 * scale, waterline + progress * 9 * scale, radius, .12, alpha);
    ctx.lineWidth = Math.max(1, scale * 1.65);
    ellipse(ctx, centerX + progress * 7 * scale, waterline + progress * 9 * scale + 2 * scale, radius + 3 * scale, .12, alpha * .7, '244,244,215');
  }

  // A feather displaces very little water. Its first contact is distinct, then
  // the rings travel together and soften into the existing surface.
  for (let i = 0; i < 3; i++) {
    const start = BEATS.featherContact + i * 150;
    const progress = (elapsedMs - start) / (BEATS.rippleEnd - BEATS.featherContact + 700);
    if (progress <= 0 || progress >= 1) continue;
    const radius = (4 + Math.pow(progress, .8) * 66) * Math.max(.65, scale);
    const alpha = .37 * ease(progress * 12) * Math.pow(1 - progress, 1.5);
    ctx.lineWidth = Math.max(.8, scale);
    ellipse(ctx, width * .54, waterline, radius, .2, alpha);
    ellipse(ctx, width * .54, waterline + scale * 1.6, radius - 1.5 * scale, .2, alpha * .6, '244,245,218');
  }

  const reedHeight = Math.min(height * .29, width * .5);
  reeds(ctx, width * .008, height * .963, reedHeight, 1, 13, 30, time);
  reeds(ctx, width * .992, height * .979, reedHeight * .94, -1, 15, 80, time);
  ctx.restore();
}

/** The parent supplies every frame; mounting this surface never starts a clock. */
export function ArrivalPond({ elapsedMs, className = '', onReady }: ArrivalPondProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(elapsedMs);
  const draw = useRef<(() => void) | null>(null);
  const readyCallback = useRef(onReady);
  const announced = useRef(false);
  useEffect(() => { readyCallback.current = onReady; }, [onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ready = () => {
      if (!announced.current) { announced.current = true; readyCallback.current?.(); }
    };
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) { ready(); return; }
    let disposed = false;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let background: HTMLCanvasElement | null = null;
    let artLoaded = false;
    const art = new Image();
    const rebuildBackground = () => {
      if (background) sizeBuffer(background, 1, 1);
      background = width >= 2 && height >= 2
        ? makeLandscape(width, height, dpr, artLoaded && art.naturalWidth ? art : null)
        : null;
    };
    const paint = () => {
      if (disposed || width < 2 || height < 2) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (background) ctx.drawImage(background, 0, 0, width, height);
      else { ctx.fillStyle = PAPER; ctx.fillRect(0, 0, width, height); }
      drawWater(ctx, width, height, Number.isFinite(elapsed.current) ? Math.max(0, elapsed.current) : 0);
      if (artLoaded) ready();
    };
    const resize = () => {
      if (disposed) return;
      const box = canvas.getBoundingClientRect();
      const nextWidth = Math.max(0, Math.round(box.width));
      const nextHeight = Math.max(0, Math.round(box.height));
      const deviceDpr = Number.isFinite(window.devicePixelRatio) && window.devicePixelRatio > 0 ? window.devicePixelRatio : 1;
      // A DPR cap alone still allocates huge buffers on 4K/8K displays. All
      // three surfaces share this density, which may fall below one there.
      const nextDpr = Math.min(2, deviceDpr, Math.sqrt(MAX_BUFFER_PIXELS / Math.max(1, nextWidth * nextHeight)));
      if (width === nextWidth && height === nextHeight && dpr === nextDpr && background) return;
      width = nextWidth; height = nextHeight; dpr = nextDpr;
      sizeBuffer(canvas, width, height, dpr);
      rebuildBackground();
      paint();
    };
    const finishArt = () => {
      if (disposed) return;
      artLoaded = true;
      rebuildBackground();
      paint();
      ready();
    };
    art.onload = finishArt;
    art.onerror = finishArt;
    art.src = '/assets/grebes/atlas-dusk-shoreline.webp';
    draw.current = paint;
    resize();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    observer?.observe(canvas);
    window.addEventListener('resize', resize);
    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      art.onload = null;
      art.onerror = null;
      if (background) sizeBuffer(background, 1, 1);
      background = null;
      sizeBuffer(canvas, 1, 1);
      draw.current = null;
    };
  }, []);

  useEffect(() => { elapsed.current = elapsedMs; draw.current?.(); }, [elapsedMs]);
  return <canvas ref={canvasRef} className={className} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }} />;
}
