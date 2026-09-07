'use client';

import { useState, type CSSProperties } from 'react';
import { chapters, OREILLY_LINKS } from '../book/bookData';
import { TrackedAction } from './TrackedAction';
import '../styles/chapter-shoreline.css';

const shorelineChapters = chapters.flatMap((part) =>
  part.chapters.map((chapter) => ({ ...chapter, part: part.part })),
);
const waterHeights = [90, 75, 55, 60, 85, 105, 100, 75, 55, 65];
const nextChapter = shorelineChapters.find((chapter) => chapter.status !== 'live');
const newestChapter = shorelineChapters.filter((chapter) => chapter.status === 'live').at(-1);

export function ChapterShoreline() {
  const [selectedNumber, setSelectedNumber] = useState(newestChapter?.num ?? '01');
  const selected = shorelineChapters.find((chapter) => chapter.num === selectedNumber)!;
  const selectedIsNext = selected.num === nextChapter?.num;
  const status = selected.status === 'live' ? 'Available now' : selectedIsNext ? 'Next release' : 'Planned';

  return (
    <section className="chapter-shoreline" aria-labelledby="shoreline-title">
      <div className="chapter-shoreline-heading">
        <h2 id="shoreline-title">Explore the chapters</h2>
        <p>Select a chapter to see its summary and availability.</p>
      </div>

      <div className="chapter-shoreline-scroll">
        <div className="chapter-shoreline-map" role="group" aria-label="Explore the book chapters">
          <svg className="chapter-shoreline-water" viewBox="0 0 1000 180" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-20 97 C70 100 118 83 150 75 S221 50 250 55 S321 51 350 60 S421 78 450 85 S521 109 550 105 S621 110 650 100 S721 85 750 75 S821 48 850 55 S921 51 950 65 S1010 85 1030 74" />
            <path className="chapter-shoreline-echo" d="M-20 111 C98 123 155 88 248 80 S366 80 452 108 S593 144 658 124 S806 70 857 78 S967 112 1030 99" />
            <path className="chapter-shoreline-echo" d="M-20 124 C105 146 168 108 249 103 S371 105 450 126 S587 165 664 145 S810 96 857 102 S966 132 1030 124" />
          </svg>
          {shorelineChapters.map((chapter, index) => {
            const live = chapter.status === 'live';
            const next = chapter.num === nextChapter?.num;
            return (
              <button
                key={chapter.num}
                type="button"
                className={`chapter-shoreline-stop${live ? ' chapter-shoreline-stop--live' : ''}${next ? ' chapter-shoreline-stop--next' : ''}`}
                style={{ '--stop-x': `${index * 10 + 5}%`, '--stop-y': `${waterHeights[index]}px` } as CSSProperties}
                aria-label={`Chapter ${Number(chapter.num)}: ${chapter.title}. ${live ? 'Available now' : next ? 'Next release' : 'Planned'}`}
                aria-pressed={selectedNumber === chapter.num}
                aria-controls="shoreline-chapter-detail"
                onClick={() => setSelectedNumber(chapter.num)}
              >
                <span className="chapter-shoreline-number">{chapter.num}</span>
                <span className="chapter-shoreline-stop-status">{live ? 'Live' : next ? 'Next' : 'Planned'}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="chapter-shoreline-scroll-hint">Scroll horizontally to view all ten chapters.</p>

      <div id="shoreline-chapter-detail" className="chapter-shoreline-detail" aria-live="polite" aria-atomic="true">
        <div className="chapter-shoreline-position">
          <span>Chapter {selected.num}</span>
          <span className={selected.status === 'live' ? 'chapter-shoreline-live-label' : ''}>{status}</span>
        </div>
        <div className="chapter-shoreline-copy">
          <p className="chapter-shoreline-part">Part {selected.part}</p>
          <h3>{selected.title}</h3>
          <p>{selected.desc}</p>
          {selected.status === 'live' ? (
            <TrackedAction
              href={OREILLY_LINKS.bookPage}
              eventName="oreilly_read_click"
              eventProperties={{ source: 'book', placement: 'shoreline', chapter: selected.num }}
              target="_blank"
              rel="noopener noreferrer"
              className="chapter-shoreline-link"
            >
              Open the book on O’Reilly <span aria-hidden="true">↗</span>
            </TrackedAction>
          ) : (
            <a className="chapter-shoreline-link" href="#subscribe">Get chapter updates</a>
          )}
        </div>
      </div>
    </section>
  );
}
