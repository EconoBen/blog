'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrivalPond } from './ArrivalPond';
import { ArrivalSurface } from './ArrivalSurface';
import { ArrivalBird, ArrivalFeather, ARRIVAL_ART } from './ArrivalBird';
import { useGrebeArrival } from './useGrebeArrival';
import { useGrebeArrivalContext } from './GrebeArrivalContext';
import { arrivalPose, between, mix, smooth, type ArrivalTarget } from './arrivalChoreography';
import { ARRIVAL_BEATS as B } from './arrivalTimeline';
import { ArrivalBookFeature } from './ArrivalBookFeature';
import { AGENT_MEMORY } from '../book/bookData';
import '../styles/grebe-arrival.css';

const ASSETS = [...Object.values(ARRIVAL_ART), AGENT_MEMORY.coverSrc];
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function pondTarget(): ArrivalTarget | null {
  const resident=Array.from(document.querySelectorAll<SVGSVGElement>('.shell-home-page .arrival-resident-engraving')).find(node=>!node.closest('.study-reflection'));
  const residentMatrix=resident?.getScreenCTM?.();
  if(residentMatrix){const point=new DOMPoint(776,850).matrixTransform(residentMatrix);return {x:point.x,y:point.y,width:Math.abs(residentMatrix.a)*1536};}
  const svg = document.querySelector<SVGSVGElement>('.shell-home-page .field-pond-scene > .study-scene-art');
  if (!svg) return null;
  const matrix = svg.getScreenCTM?.();
  if (matrix) {
    const point = new DOMPoint(321, 263).matrixTransform(matrix);
    return { x: point.x, y: point.y, width: Math.abs(matrix.a) * 268*1536/1190 };
  }
  const box = svg.getBoundingClientRect();
  if (!box.width) return null;
  return { x: box.left + box.width * 321 / 800, y: box.top + box.height * 263 / 440, width: box.width * 268 / 800 * 1536/1190 };
}

export function GrebeArrival() {
  const { active, loading, elapsedMs, phase, skip, replay } = useGrebeArrival({ assetUrls: ASSETS });
  const { setOpening } = useGrebeArrivalContext();
  const [view, setView] = useState({ width: 1440, height: 900 });
  const [hydrated,setHydrated]=useState(false);
  useEffect(()=>setHydrated(true),[]);
  const [target, setTarget] = useState<ArrivalTarget>({ x: 1060, y: 390, width: 200 });
  const skipButton = useRef<HTMLButtonElement>(null);
  const replayFocus = useRef<HTMLElement | null>(null);
  const camera = useRef({ initialX: 0, initialY: 0, landingY: 0, resizeFromY: 0, resizeAtMs: null as number | null });
  const timeRef = useRef(elapsedMs);
  timeRef.current = elapsedMs;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => { setOpening(active || loading); }, [active, loading, setOpening]);
  useEffect(() => () => setOpening(false), [setOpening]);

  useBrowserLayoutEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const page = document.querySelector<HTMLElement>('.shell-home-page');
    const previous = replayFocus.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const previousInert = page?.inert ?? false;
    const previousOverflow = root.style.overflow;
    const previousBehavior = root.style.scrollBehavior;
    const previousPadding = root.style.paddingRight;
    const previousArrival = root.getAttribute('data-grebe-arrival');
    const initialHref = window.location.href;
    let navigationInterrupted = false;
    const navigation = () => { navigationInterrupted = true; };
    const gap = Math.max(0, window.innerWidth - root.clientWidth);
    camera.current = { initialX: window.scrollX, initialY: window.scrollY, landingY: window.scrollY, resizeFromY: window.scrollY, resizeAtMs: null };
    root.style.scrollBehavior = 'auto';
    root.style.overflow = 'hidden';
    if (gap) root.style.paddingRight = `${gap}px`;
    root.setAttribute('data-grebe-arrival', 'opening');
    if (page) page.inert = true;
    skipButton.current?.focus({ preventScroll: true });

    const measure = () => {
      setView({ width: window.innerWidth, height: window.innerHeight });
      const measured = pondTarget();
      if (measured) {
        setTarget(measured);
        if (phaseRef.current !== 'settle' && phaseRef.current !== 'done') {
          if (timeRef.current >= B.featherContact-550) {
            camera.current.resizeFromY = window.scrollY;
            camera.current.resizeAtMs = timeRef.current;
          }
          let top=measured.y-measured.width*800/1536;
          let bottom=measured.y+18;
          const headerBottom=document.querySelector<HTMLElement>('.field-topbar')?.getBoundingClientRect().bottom ?? 0;
          const viewportTop=Math.max(90,headerBottom+18),viewportBottom=window.innerHeight-18;
          const invitation=page?.querySelector<HTMLElement>('.field-pond-invitation')?.getBoundingClientRect();
          if(invitation && invitation.width>0 && invitation.height>0){
            const combinedTop=Math.min(top,invitation.top);
            const combinedBottom=Math.max(bottom,invitation.bottom);
            // Include the visible action, not the larger pond button. On a
            // viewport too short for both, retain the existing full-bird fit.
            if(combinedBottom-combinedTop<=viewportBottom-viewportTop){
              top=combinedTop;
              bottom=combinedBottom;
            }
          }
          const adjustment=bottom>viewportBottom?bottom-viewportBottom:top<viewportTop?top-viewportTop:0;
          camera.current.landingY=Math.max(0,window.scrollY+adjustment);
        }
      }
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); skip(); }
      if (event.key === 'Tab') { event.preventDefault(); skipButton.current?.focus({ preventScroll: true }); }
    };
    measure();
    window.addEventListener('resize', measure);
    document.addEventListener('keydown', keyboard);
    window.addEventListener('hashchange', navigation);
    window.addEventListener('popstate', navigation);
    window.addEventListener('pagehide', navigation);
    return () => {
      window.removeEventListener('resize', measure);
      document.removeEventListener('keydown', keyboard);
      window.removeEventListener('hashchange', navigation);
      window.removeEventListener('popstate', navigation);
      window.removeEventListener('pagehide', navigation);
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPadding;
      if (previousArrival === null) root.removeAttribute('data-grebe-arrival');
      else root.setAttribute('data-grebe-arrival', previousArrival);
      page?.style.removeProperty('--arrival-resident');
      page?.style.removeProperty('--arrival-water');
      if (page) page.inert = previousInert;
      // A route change owns its own scroll/focus; only restore an opening on home.
      if (!navigationInterrupted && window.location.href === initialHref) {
        if(timeRef.current<B.duration){
          window.scrollTo(camera.current.initialX, camera.current.initialY);
          if (previous?.isConnected && previous !== document.body) previous.focus({ preventScroll: true });
        }else{
          page?.querySelector<HTMLElement>('.field-pond-scene')?.focus({preventScroll:true});
        }
      }
      root.style.scrollBehavior = previousBehavior;
      replayFocus.current = null;
    };
  }, [active, skip]);

  useBrowserLayoutEffect(() => {
    if (!active) return;
    const current = camera.current;
    const travel = smooth(between(elapsedMs,B.featherContact-550,B.rippleEnd-220));
    const intendedY = mix(current.initialY,current.landingY,travel);
    const resizeDuration = current.resizeAtMs === null ? 360 : Math.min(360, Math.max(80,B.waterContact-current.resizeAtMs));
    const scrollY = current.resizeAtMs === null ? intendedY : mix(current.resizeFromY, intendedY, smooth(between(elapsedMs, current.resizeAtMs, current.resizeAtMs + resizeDuration)));
    if (Math.abs(window.scrollY - scrollY) > .5) window.scrollTo(current.initialX, scrollY);
    const measured = pondTarget();
    if (measured) setTarget(old => Math.abs(old.x - measured.x) + Math.abs(old.y - measured.y) + Math.abs(old.width - measured.width) > .1 ? measured : old);
    const page = document.querySelector<HTMLElement>('.shell-home-page');
    page?.style.setProperty('--arrival-resident',elapsedMs>=B.landEnd?'1':'0');
    page?.style.setProperty('--arrival-water',String(smooth(between(elapsedMs,B.landEnd-30,B.landEnd+500))));
  }, [active, elapsedMs]);

  const pose = arrivalPose(elapsedMs, view, target);
  const bird = pose.hero;
  const landing = pose.returning;
  const openingBird = elapsedMs < B.launchEnd;
  // Keep one prepared character throughout the film. Its hidden interval does
  // no drawing, and phase changes update the pose without loading new artwork.
  const actor = openingBird
    ? { ...bird, opacity: 1, facing: 1 as const }
    : elapsedMs >= B.secondPassEnd
      ? { ...landing, awake: 1, flight: 1 - landing.upright, reflectionOpacity: 0, facing: -1 as const }
      : { ...(elapsedMs >= B.secondPassStart ? pose.secondCrossing : pose.crossing), awake: 1, wings: 1, flight: 1, immersion: 1, reflectionOpacity: 0, facing: 1 as const };
  const ripple = pose.landingRipple;
  const revealX=mix(-view.width*.2,view.width*1.2,pose.reveal);
  const revealClip=pose.reveal===0?undefined:pose.reveal===1?'inset(0 0 0 100%)':`path("M ${revealX-100} 0 C ${revealX-65} ${view.height*.2}, ${revealX+100} ${view.height*.31}, ${revealX+30} ${view.height*.5} S ${revealX-65} ${view.height*.82}, ${revealX-100} ${view.height} L ${view.width+400} ${view.height} L ${view.width+400} 0 Z")`;
  return <>
    {hydrated && <button type="button" className="arrival-replay" aria-disabled={loading || active} onClick={event => {
      if (loading || active) return;
      replayFocus.current = event.currentTarget;
      replay();
    }}>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 6a6 6 0 1 1-1 6M5 2v4H1" /></svg>
      {loading ? 'Preparing opening…' : 'Replay opening'}
    </button>}
    {active && createPortal(<div className="arrival-dialog" role="dialog" aria-modal="true" aria-label="Grebe opening" data-phase={phase} data-elapsed={Math.round(elapsedMs)}>
      <div className="arrival-landscape" aria-hidden="true" style={{clipPath:revealClip}}>
        <ArrivalPond elapsedMs={elapsedMs} />
      </div>
      <div className="arrival-actors" aria-hidden="true">
        <ArrivalBookFeature style={{position:'absolute',left:pose.book.x,top:pose.book.y,opacity:pose.book.opacity,transform:`translate(-50%, -50%) rotate(${pose.book.rotate}deg)`,willChange:'transform'}} />
      </div>
      <div className={`arrival-actors ${openingBird ? 'arrival-hero-layer' : 'arrival-flight-layer'}`} aria-hidden="true">
        {elapsedMs < B.landEnd && <ArrivalBird elapsedMs={elapsedMs} {...actor} clipAtWaterline={openingBird} onError={skip} />}
        {openingBird && <ArrivalSurface elapsedMs={elapsedMs} x={view.width * .5} y={view.height * .63} size={pose.surface.size} />}
      </div>
      <div className="arrival-actors arrival-flight-layer" aria-hidden="true">
        <div className="arrival-feather" style={{ left: pose.feather.x, top: pose.feather.y, opacity: pose.feather.opacity, transform: `translate(-53.333333%, -99.411765%) perspective(500px) rotate(${pose.feather.rotate}deg) rotateY(${pose.feather.tilt}deg) scale(${pose.feather.scale})` }}><ArrivalFeather /></div>
        {elapsedMs >= B.waterContact && <svg className="arrival-contact" width={target.width * 2.8} height={target.width * .8} viewBox="0 0 560 160" style={{ left: target.x, top: target.y, opacity: 1 - smooth(between(elapsedMs,B.duration-500,B.duration)) }}>
          {[0,1,2].map(i=>{
            const p=Math.max(0,ripple-i*.12);if(!p)return null;
            return <ellipse key={i} cx="280" cy="80" rx={76+p*180} ry={5+p*22} fill="none" stroke={i===1?'#d9e4d1':'#548f82'} strokeWidth={i===1?1.7:1} opacity={smooth(p/.07)*(1-ripple)*.48}/>;
          })}
          {Array.from({length:6},(_,i)=>{
            const p=between(elapsedMs,B.waterContact+i*32,B.waterContact+i*32+430);
            if(p<=0||p>=1)return null;
            return <ellipse key={i} cx={280+(i-2.5)*(20+p*11)} cy={80-Math.sin(p*Math.PI)*(16+i%3*7)} rx={.9} ry={1.7} fill="#749e89" opacity={Math.sin(p*Math.PI)*.7}/>;
          })}
        </svg>}
      </div>
      <button type="button" className="arrival-skip" aria-label="Skip opening" ref={skipButton} onClick={skip}><span>Skip<span className="arrival-skip-word"> opening</span></span><span aria-hidden="true">↗</span></button>
    </div>, document.body)}
  </>;
}
