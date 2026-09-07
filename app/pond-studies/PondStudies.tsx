'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { connectionsFor, type StudyEssay, type StudyConnection } from './studyContent';
import { StudyScene, type StudyDirection } from './StudyScene';
import { useStudyWaterSound } from './useStudyWaterSound';
import './pond-studies.css';

const directions: Array<{id:StudyDirection;name:string;title:string;description:string;strength:string;tradeoff:string}> = [
  {id:'atlas-dusk',name:'Atlas at dusk',title:'Atlas at dusk',description:'An engraved landscape, warm paper, and a connected article browser.',strength:'The selected combination: the naturalist atlas’s clarity with the dusk pond’s depth, reeds, and reflections.',tradeoff:'Keep the scenery concentrated around the grebe so the illustrations and the writing both have room.'},
  {id:'dusk',name:'Pond at dusk',title:'Pond at dusk',description:'An engraved grebe, a reed-lined bank, and a reflection that belongs to the water. Warm, quiet, and alive.',strength:'The closest evolution of the existing site: a recognisable place, with the grebe at its centre.',tradeoff:'The scene needs careful contrast and restraint so its atmosphere never competes with an essay.'},
  {id:'atlas',name:'Field atlas',title:'Field atlas',description:'Paper, ink, and an annotated waterway. Article links are labelled by shared topics and references.',strength:'The clearest expression of the O’Reilly-inspired identity, and the easiest map to read.',tradeoff:'More editorial and less cinematic. Its delight comes from fine detail and meaningful navigation.'},
  {id:'cutaway',name:'Below the surface',title:'Underwater cutaway',description:'The grebe dives through a visible waterline and returns with an article.',strength:'The most theatrical direction: the surface, depth, and return become one continuous story.',tradeoff:'It asks for the strongest illustration and motion craft; the quieter parts must keep it grounded.'},
];

export function PondStudies({essays,connections}:{essays:StudyEssay[];connections:StudyConnection[]}) {
  const [direction,setDirection] = useState<StudyDirection>('atlas-dusk');
  const [phone,setPhone] = useState(false);
  const [selectedIndex,setSelectedIndex] = useState(0);
  const [phase,setPhase] = useState<'idle'|'diving'|'surfacing'|'revealing'>('idle');
  const [hasFound,setHasFound] = useState(false);
  const [take,setTake] = useState(0);
  const busy = useRef(false);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const title = useRef<HTMLHeadingElement>(null);
  const focusAfterSelection = useRef(false);
  const sound = useStudyWaterSound();
  const cancel = useCallback(() => {
    timers.current.forEach(clearTimeout); timers.current=[]; busy.current=false; setPhase('idle'); sound.stop();
  },[sound.stop]);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const visibility = () => {if(document.hidden) cancel();};
    document.addEventListener('visibilitychange',visibility);
    motion.addEventListener('change',cancel);
    return () => {document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',cancel);timers.current.forEach(clearTimeout);sound.stop();};
  },[cancel,sound.stop]);
  const focusEssay = useCallback(() => {
    const heading=title.current; if(!heading)return;
    heading.focus({preventScroll:true});
    const box=heading.getBoundingClientRect();
    if(box.top<0||box.bottom>window.innerHeight)heading.scrollIntoView?.({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  },[]);
  useEffect(()=>{if(focusAfterSelection.current){focusEssay();focusAfterSelection.current=false;}},[selectedIndex,focusEssay]);
  if(!essays.length) return <main className="pond-study-workbench"><h1>Pond studies</h1><p>The writing is unavailable. <Link href="/">Return to the site.</Link></p></main>;
  const selected = essays[selectedIndex] ?? essays[0];
  const neighbors = connectionsFor(selected.slug,essays,connections).slice(0,3);
  const treatment = directions.find(item=>item.id===direction)!;
  const chooseDirection = (value:StudyDirection) => {cancel();setDirection(value);};
  const selectEssay = (index:number) => {
    cancel(); setHasFound(true);
    if(index===selectedIndex){focusAfterSelection.current=false;focusEssay();}
    else {focusAfterSelection.current=true;setSelectedIndex(index);}
  };
  const dive = (replay=false) => {
    if(busy.current) return;
    const nextIndex = replay ? selectedIndex : (selectedIndex+1)%essays.length;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setSelectedIndex(nextIndex);setHasFound(true);return;}
    busy.current=true;setPhase('diving');setTake(value=>value+1);sound.play();
    timers.current=[
      setTimeout(()=>setPhase('surfacing'),2100),
      setTimeout(()=>{setSelectedIndex(nextIndex);setHasFound(true);setPhase('revealing');},3150),
      setTimeout(()=>{busy.current=false;timers.current=[];setPhase('idle');},3800),
    ];
  };
  const pointer = (event:PointerEvent<HTMLButtonElement>) => {
    if(event.pointerType!=='mouse'||busy.current||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const box=event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--study-bird-x',`${(0.5-(event.clientX-box.left)/box.width)*18}px`);
    event.currentTarget.style.setProperty('--grebe-neck-look',`${(0.5-(event.clientX-box.left)/box.width)*5}deg`);
    event.currentTarget.style.setProperty('--study-bird-turn',`${(0.5-(event.clientX-box.left)/box.width)*2}deg`);
  };
  const settle = (event:PointerEvent<HTMLButtonElement>) => {event.currentTarget.style.setProperty('--study-bird-x','0px');event.currentTarget.style.setProperty('--study-bird-turn','0deg');event.currentTarget.style.setProperty('--grebe-neck-look','0deg');};

  return (
    <main className="pond-study-workbench">
      <header className="study-workbench-header"><Link href="/">econoben.dev</Link><span>Round two · design studies</span><Link href="/">Back to the current site</Link></header>
      <div className="study-introduction"><h1>Atlas and dusk: combined design</h1><p>Your selected combination brings the paper and ink of the field atlas into a richer, more natural pond. The three original studies are here for comparison.</p></div>
      <div className="study-toolbar">
        <nav aria-label="Study directions">{directions.map(item=><button key={item.id} type="button" aria-pressed={direction===item.id} onClick={()=>chooseDirection(item.id)}>{item.name}</button>)}</nav>
        <div className="study-size-controls" aria-label="Preview width"><button type="button" aria-pressed={!phone} onClick={()=>setPhone(false)}>Full width</button><button type="button" aria-pressed={phone} onClick={()=>setPhone(true)}>Phone</button></div>
      </div>
      <section className={`study-preview${phone?' study-preview--phone':''}`} aria-label={`${treatment.name} interactive study`}>
        <div className={`study-world study-world--${direction}${phase!=='idle'?' is-diving':''}${hasFound?' has-found':''}${phase==='revealing'?' is-revealing':''}`}>
          <div className="study-world-heading"><p>{treatment.name}</p><h2>{treatment.title}</h2><p>{treatment.description}</p></div>
          <div className="study-discovery-layout">
            <div className="study-water-column">
              <button type="button" className="study-scene-button" aria-label="Find an article" aria-disabled={phase!=='idle'} onClick={()=>dive()} onPointerMove={pointer} onPointerLeave={settle}>
                <StudyScene key={`${direction}-${take}`} direction={direction}/>
                <span className="study-dive-invitation">{phase==='diving'?'Finding an article…':phase==='surfacing'?'Retrieving an article…':phase==='revealing'?'Article selected':'Find an article'}<span aria-hidden="true">↓</span></span>
              </button>
              <div className="study-scene-controls"><button type="button" onClick={()=>dive(true)} disabled={phase!=='idle'}>Replay animation</button><button type="button" onClick={sound.toggle} aria-pressed={sound.enabled}>{sound.enabled?'Water sound on':'Silent'}<span aria-hidden="true">{sound.enabled?'◖':'○'}</span></button></div>
              <p className="study-sound-hint">{sound.enabled?'The next dive will play the water audition.':'Enable water sound to compare it with silence.'}</p>
            </div>
            <article className="study-field-note" aria-busy={phase==='diving'||phase==='surfacing'}>
              <div className="study-note-binding" aria-hidden="true"/>
              <p className="study-note-state">{phase==='diving'||phase==='surfacing'?'Finding an article…':'Suggested article'}</p>
              <div className="study-note-stack">
              {essays.map(essay=><div className="study-note-size" key={essay.slug} aria-hidden="true"><p className="study-note-date">{new Date(essay.date).toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'})}{essay.readingTime?` · ${essay.readingTime} minute read`:''}</p><span className="study-note-title">{essay.title}</span><p className="study-note-summary">{essay.summary}</p><div className="study-note-tags">{essay.tags.slice(0,3).map(tag=><span key={tag}>{tag}</span>)}</div><span className="study-read-essay">Read article ↗</span></div>)}
              <div className="study-note-content" aria-live="polite" aria-atomic="true">
                <p className="study-note-date">{new Date(selected.date).toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'})}{selected.readingTime?` · ${selected.readingTime} minute read`:''}</p>
                <h3 ref={title} tabIndex={-1}>{selected.title}</h3>
                <p className="study-note-summary">{selected.summary}</p>
                <div className="study-note-tags">{selected.tags.slice(0,3).map(tag=><Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>
                <Link className="study-read-essay" href={selected.href}>Read article <span aria-hidden="true">↗</span></Link>
              </div>
              </div>
            </article>
          </div>
          <div className="study-connections">
            <div className="study-connection-intro"><h3>Related articles</h3><p>Articles connected by shared topics or references. Select an article to view its details.</p><p className="study-current-essay"><span>Selected article</span>{selected.shortTitle}</p></div>
            <div className="study-neighbors" aria-label={`Essays connected to ${selected.shortTitle}`}>
              {neighbors.map(({essay,connection,label},index)=><button key={essay.slug} type="button" className="study-neighbor" onClick={()=>selectEssay(essays.findIndex(item=>item.slug===essay.slug))} style={{'--neighbor-index':index} as CSSProperties}>
                <span className="study-neighbor-reason">{connection.kind==='shared-topic'?'Shared topics':'Referenced report'}</span><span className="study-neighbor-title">{essay.shortTitle}</span><span className="study-neighbor-label">{label}</span><span className="study-neighbor-arrow" aria-hidden="true">↗</span>
              </button>)}
              {neighbors.length===0&&<p className="study-no-neighbors">No related articles in this selection. Browse the articles below to select another.</p>}
            </div>
          </div>
          <details className="study-all-essays"><summary>Browse these {essays.length} articles</summary><div>{essays.map(essay=><button key={essay.slug} type="button" onClick={()=>selectEssay(essays.findIndex(item=>item.slug===essay.slug))}>{essay.title}</button>)}</div></details>
        </div>
      </section>
      <div className="study-design-notes"><div><h2>What this direction gives us</h2><p>{treatment.strength}</p></div><div><h2>What needs care</h2><p>{treatment.tradeoff}</p></div><p className="study-prototype-note">These comparisons remain available alongside the combined homepage design. The homepage pond is silent; optional sound can be auditioned here.</p></div>
    </main>
  );
}
