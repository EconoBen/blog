'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useFieldPond } from './FieldPondProvider';
import { connectionsFor, type StudyEssay } from '../pond-studies/studyContent';
import '../styles/field-atlas-explorer.css';

const essayDate = (essay: StudyEssay) => new Date(essay.date).toLocaleDateString('en-US', {
  month: 'long', year: 'numeric', timeZone: 'UTC',
});

export function FieldAtlasExplorer() {
  const { essays, connections, selected, selectEssay } = useFieldPond();
  const heading = useRef<HTMLHeadingElement>(null);
  const pending = useRef<{ slug: string; path: string[] } | null>(null);
  const [trail, setTrail] = useState<string[]>(selected ? [selected.slug] : []);
  const selectedSlug = selected?.slug;

  useEffect(() => {
    if (!selectedSlug) return;
    const intent = pending.current;
    pending.current = null;
    if (intent?.slug === selectedSlug) {
      setTrail(intent.path);
      // A followed button can disappear when its essay becomes the new root.
      // Move focus to that root, and let the browser reveal it on small screens.
      heading.current?.focus();
    } else {
      // A new find from the grebe is not necessarily a connection in this trail.
      setTrail([selectedSlug]);
    }
  }, [selectedSlug]);

  if (!selected) return null;
  const neighbors = connectionsFor(selected.slug, essays, connections).slice(0, 3);
  const trailEssays = trail.flatMap(slug => essays.find(essay => essay.slug === slug) ?? []);
  const choose = (slug: string, path: string[]) => {
    if (slug === selected.slug) {
      pending.current = null;
      selectEssay(slug);
      setTrail(path);
      heading.current?.focus();
      return;
    }
    pending.current = { slug, path };
    selectEssay(slug);
  };
  const follow = (slug: string) => {
    const previous = trail.indexOf(slug);
    choose(slug, previous >= 0 ? trail.slice(0, previous + 1) : [...trail, slug]);
  };

  return (
    <section id="field-atlas" className="field-atlas" aria-labelledby="field-atlas-title">
      <header className="field-atlas-heading">
        <h2 id="field-atlas-title">Related articles</h2>
        <p>Based on shared topics and references in the writing.</p>
      </header>

      {trailEssays.length > 1 && <nav className="field-atlas-trail" aria-label="Previous selections">
        <p>Previous selections</p>
        <ol>{trailEssays.slice(0, -1).map((essay, index) => <li key={essay.slug}>
          <button type="button" onClick={() => choose(essay.slug, trail.slice(0, index + 1))}>{essay.shortTitle}</button>
        </li>)}</ol>
      </nav>}

      <div id="field-atlas-results" className="field-atlas-map">
        <article className="field-atlas-selected" aria-labelledby="field-atlas-selected-title">
          <p className="field-atlas-location">Selected article</p>
          <h3 id="field-atlas-selected-title" ref={heading} tabIndex={-1}>{selected.title}</h3>
          <p className="field-atlas-meta"><time dateTime={selected.date}>{essayDate(selected)}</time>{selected.readingTime && <span>{selected.readingTime} minute read</span>}</p>
          <p className="field-atlas-summary">{selected.summary}</p>
          <Link className="field-atlas-read" href={selected.href}>Read article</Link>
        </article>

        {neighbors.length > 0 ? <ul className="field-atlas-neighbors" aria-label={`Articles related to ${selected.title}`}>
          {neighbors.map(({ essay, connection, label }) => <li key={essay.slug} className="field-atlas-neighbor" data-connection-kind={connection.kind}>
              <h3>{essay.title}</h3>
              <p className="field-atlas-reason"><span>Why related</span>{label}</p>
              <div className="field-atlas-neighbor-actions">
                <Link href={essay.href} aria-label={`Read article: ${essay.title}`}>Read article</Link>
                <button type="button" onClick={() => follow(essay.slug)} aria-label={`View related articles for ${essay.title}`} aria-controls="field-atlas-results">View related articles</button>
              </div>
          </li>)}
        </ul> : <p className="field-atlas-empty">No related articles in this selection. Browse the articles below to select another.</p>}
      </div>

      <details className="field-atlas-index">
        <summary>Browse these {essays.length} articles</summary>
        <ul>{essays.map(essay => <li key={essay.slug}>
          <div><Link href={essay.href}>{essay.title}</Link><span>{essayDate(essay)}</span></div>
          <button type="button" onClick={() => choose(essay.slug, [essay.slug])} aria-label={`View related articles for ${essay.title}`} aria-pressed={essay.slug === selected.slug} aria-controls="field-atlas-results">View related articles{essay.slug === selected.slug && <span>Selected article</span>}</button>
        </li>)}</ul>
      </details>
    </section>
  );
}
