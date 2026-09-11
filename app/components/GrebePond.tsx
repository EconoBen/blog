'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { StudyScene } from '../pond-studies/StudyScene';
import type { StudyEssay } from '../pond-studies/studyContent';
import { useFieldPond } from './FieldPondProvider';
import { ReturningBookmark } from './ReadingMemory';
import '../styles/field-pond-discovery.css';

type DivePhase = 'idle' | 'diving' | 'surfacing' | 'revealing';
const motionPreference = () => window.matchMedia('(prefers-reduced-motion: reduce)');
const essayDate = (essay: StudyEssay) => new Date(essay.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export function GrebePond() {
  const { essays, selected, hasFound, selectionRevision, discover } = useFieldPond();
  const [phase, setPhase] = useState<DivePhase>('idle');
  const [take, setTake] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const [announcementRequest, setAnnouncementRequest] = useState(0);
  const deliveredAnnouncement = useRef(0);
  const busy = useRef(false);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const sceneButton = useRef<HTMLButtonElement>(null);
  const clearTimers = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);
  const settle = useCallback(() => {
    sceneButton.current?.style.setProperty('--field-bird-x', '0px');
    sceneButton.current?.style.setProperty('--field-bird-turn', '0deg');
    sceneButton.current?.style.setProperty('--grebe-neck-look', '0deg');
  }, []);
  const cancel = useCallback(() => { clearTimers(); busy.current = false; setPhase('idle'); settle(); }, [clearTimers, settle]);
  useEffect(() => {
    const motion = motionPreference();
    const visibility = () => { if (document.hidden) cancel(); };
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', cancel);
    return () => { document.removeEventListener('visibilitychange', visibility); motion.removeEventListener('change', cancel); clearTimers(); };
  }, [cancel, clearTimers]);
  // Choosing another thought in the atlas takes precedence over a pending dive.
  useEffect(() => { cancel(); }, [selectionRevision, cancel]);
  useEffect(() => {
    if (!selected || deliveredAnnouncement.current === announcementRequest) return;
    deliveredAnnouncement.current = announcementRequest;
    setAnnouncement(`Article selected: ${selected.title}.`);
  }, [announcementRequest, selected]);

  const dive = () => {
    if (busy.current || document.hidden || !selected) return;
    settle(); setAnnouncement('');
    if (motionPreference().matches) { discover(); setAnnouncementRequest(value => value + 1); return; }
    busy.current = true; setPhase('diving'); setTake(value => value + 1);
    timers.current = [
      setTimeout(() => setPhase('surfacing'), 2100),
      setTimeout(() => { discover(); setAnnouncementRequest(value => value + 1); setPhase('revealing'); }, 3150),
      setTimeout(() => { busy.current = false; timers.current = []; setPhase('idle'); }, 3800),
    ];
  };
  const pointer = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse' || busy.current || motionPreference().matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (!box.width) return;
    const approach = .5 - Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
    event.currentTarget.style.setProperty('--field-bird-x', `${approach * 24}px`);
    event.currentTarget.style.setProperty('--field-bird-turn', `${approach * 2.5}deg`);
    event.currentTarget.style.setProperty('--grebe-neck-look', `${approach * 5}deg`);
  };
  const waiting = phase === 'diving' || phase === 'surfacing';
  return (
    <div className={`field-pond${phase !== 'idle' ? ' is-diving' : ''}${hasFound ? ' has-found' : ''}${phase === 'revealing' ? ' is-revealing' : ''}`}>
      {selected ? <>
        <button ref={sceneButton} type="button" className="field-pond-scene" aria-label="Find an article" aria-disabled={phase !== 'idle'} onClick={dive} onPointerMove={pointer} onPointerLeave={settle}>
          <StudyScene key={take} direction="atlas-dusk" arrivalResident />
          <span className="field-pond-invitation">{phase === 'diving' ? 'Finding an article…' : phase === 'surfacing' ? 'Retrieving an article…' : phase === 'revealing' ? 'Article selected' : 'Find an article'}<span aria-hidden="true">↓</span></span>
        </button>
        <article className="field-pond-note" aria-busy={waiting}>
          <p className="field-pond-note-label">{waiting ? 'Finding an article…' : 'Suggested article'}</p>
          <div className="field-pond-note-stack">
            {essays.map(essay => <div key={essay.slug} className="field-pond-note-size" aria-hidden="true"><p className="field-pond-date">{essayDate(essay)}{essay.readingTime ? ` · ${essay.readingTime} minute read` : ''}</p><span className="field-pond-note-title">{essay.title}</span><p className="field-pond-summary">{essay.summary}</p></div>)}
            <div className="field-pond-note-content">
              <p className="field-pond-date">{essayDate(selected)}{selected.readingTime ? ` · ${selected.readingTime} minute read` : ''}</p>
              <h2>{selected.title}</h2>
              <p className="field-pond-summary">{selected.summary}</p>
            </div>
          </div>
          <div className="field-pond-note-links"><Link href={selected.href} className="field-pond-read">Read article <span aria-hidden="true">↗</span></Link><a href="#field-atlas" className="field-pond-atlas-link">Related articles <span aria-hidden="true">↓</span></a></div>
        </article>
        <p role="status" className="field-pond-announcement">{announcement}</p>
      </> : <p className="field-pond-empty"><Link href="/posts">Explore the essays</Link></p>}
      <ReturningBookmark />
    </div>
  );
}
