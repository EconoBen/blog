'use client';

import Link from 'next/link';
import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { pondMobileLayout, pondPositions, sharedTopics } from './nightPondGraph';
import '../styles/night-pond.css';

export type PondEssay = { slug: string; title: string; summary: string; tags: string[]; date: string; readingTime?: number };

export function NightPond({ essays }: { essays: PondEssay[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lights = useRef<Array<HTMLButtonElement | null>>([]);
  if (!essays.length) return null;
  const selected = essays[selectedIndex] ?? essays[0];
  const positions = pondPositions(essays.length);
  const mobile = pondMobileLayout(essays.length);
  const origin = positions[selectedIndex] ?? positions[0];
  const mobileOrigin = mobile.positions[selectedIndex] ?? mobile.positions[0];
  const related = essays.map((essay, index) => ({essay, index, topics: sharedTopics(selected.tags, essay.tags)}))
    .filter(item => item.index !== selectedIndex && item.topics.length > 0);
  const relatedIndices = new Set(related.map(item => item.index));
  const followRelated = (index: number) => {
    setSelectedIndex(index);
    lights.current[index]?.focus({ preventScroll: true });
  };
  const moveSelection = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % essays.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + essays.length) % essays.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = essays.length - 1;
    else return;
    event.preventDefault(); setSelectedIndex(next); lights.current[next]?.focus();
  };

  return (
    <section id="night-pond" className="night-pond" aria-labelledby="night-pond-title">
      <div className="night-pond-heading">
        <div><p>Writing after the water settles</p><h2 id="night-pond-title">Follow a thought.</h2></div>
        <p>Each light is an essay. Choose one to find the ideas it shares with the others.</p>
      </div>
      <p className="night-pond-mobile-selection"><span>Selected essay</span><Link href={`/posts/${encodeURIComponent(selected.slug)}`}>{selected.title} <span aria-hidden="true">↗</span></Link></p>
      <div className="night-pond-explorer">
        <div className="night-pond-map" style={{ '--pond-mobile-height': `${mobile.height}px` } as CSSProperties} role="group" aria-label="Essays connected by shared topics" aria-describedby="pond-map-help">
          <svg className="night-pond-water" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="300" cy="220" rx="255" ry="100"/><ellipse cx="300" cy="224" rx="290" ry="128"/><ellipse cx="300" cy="228" rx="338" ry="156"/>
          </svg>
          <svg className="night-pond-connections night-pond-connections--wide" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {related.map(({index}) => <path key={`${selected.slug}-${index}`} pathLength="1" d={`M${origin.x} ${origin.y} Q50 86 ${positions[index].x} ${positions[index].y}`} />)}
          </svg>
          <svg className="night-pond-connections night-pond-connections--narrow" viewBox={`0 0 100 ${mobile.height}`} preserveAspectRatio="none" aria-hidden="true">
            {related.map(({index}) => <path key={`${selected.slug}-${index}`} pathLength="1" d={`M${mobileOrigin.x} ${mobileOrigin.y} Q50 ${mobile.height * .86} ${mobile.positions[index].x} ${mobile.positions[index].y}`} />)}
          </svg>
          {essays.map((essay, index) => (
            <button key={essay.slug} ref={element => { lights.current[index] = element; }} type="button"
              className={`night-pond-light${index === selectedIndex ? ' is-selected' : relatedIndices.has(index) ? ' is-related' : ''}`}
              style={{ '--light-x': `${positions[index].x}%`, '--light-y': `${positions[index].y}%`, '--light-mobile-x': `${mobile.positions[index].x}%`, '--light-mobile-y': `${mobile.positions[index].y}px` } as CSSProperties}
              aria-label={essay.title} aria-pressed={index === selectedIndex} aria-controls="night-pond-story"
              tabIndex={index === selectedIndex ? 0 : -1}
              onClick={() => setSelectedIndex(index)} onKeyDown={event => moveSelection(event,index)}>
              <span className="night-pond-light-core"/><span className="night-pond-light-title" aria-hidden="true">{essay.title}</span>
            </button>
          ))}
          <span className="night-pond-grebe" aria-hidden="true"><span className="pond-sprite pond-sprite--swim" /></span>
          <p id="pond-map-help"><span className="night-pond-keyboard-help">Use the arrow keys to move between lights.</span><span className="night-pond-touch-help">Tap a light to explore an essay.</span><br />Lines follow shared topics.</p>
        </div>
        <div id="night-pond-story" className="night-pond-story" aria-live="polite" aria-atomic="true">
          <p className="night-pond-date">{new Date(selected.date).toLocaleDateString('en-US',{year:'numeric',month:'long',timeZone:'UTC'})}{selected.readingTime ? ` · ${selected.readingTime} min read` : ''}</p>
          <h3><Link href={`/posts/${encodeURIComponent(selected.slug)}`}>{selected.title}</Link></h3>
          <p className="night-pond-summary">{selected.summary}</p>
          <div className="night-pond-topics">{selected.tags.slice(0,4).map(tag=><Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>
          <Link className="night-pond-read" href={`/posts/${encodeURIComponent(selected.slug)}`}>Read this essay <span aria-hidden="true">↗</span></Link>
          {related.length > 0 && <div className="night-pond-related"><p>Keep following the thought</p>{related.slice(0,2).map(({essay,index,topics}) => <button key={essay.slug} type="button" onClick={()=>followRelated(index)}><span>{essay.title}</span><small>{topics.slice(0,2).join(', ')}</small></button>)}</div>}
        </div>
      </div>
      <details className="night-pond-index"><summary>Browse all {essays.length} essays as a list</summary><nav aria-label="All essays in the night pond">{essays.map(essay=><Link key={essay.slug} href={`/posts/${encodeURIComponent(essay.slug)}`}>{essay.title}</Link>)}</nav></details>
    </section>
  );
}
