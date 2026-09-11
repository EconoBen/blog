import type { Metadata } from 'next';
import Link from 'next/link';
import '../styles/book-experience.css';
import { BookCover } from '../components/BookCover';
import { ChapterShoreline } from '../components/ChapterShoreline';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { TrackedAction } from '../components/TrackedAction';
import {
  AGENT_MEMORY,
  OREILLY_LINKS,
  buildOutcomes,
  chapters,
  chapterStatusLabels,
  chapterFeedbackHref,
  earlyReleaseNotes,
} from './bookData';

const bookDescription =
  'Agent Memory: Building Stateful AI Agents That Remember, Adapt, and Work Across Time. Now in Early Release from O’Reilly Media.';

export const metadata: Metadata = {
  title: 'Agent Memory | Early Release | ECONOBEN.DEV',
  description: bookDescription,
  alternates: { canonical: '/book' },
  openGraph: {
    title: 'Agent Memory — Early Release',
    description: bookDescription,
    url: 'https://econoben.dev/book',
    type: 'website',
    images: [
      {
        url: AGENT_MEMORY.coverSrc,
        width: 1080,
        height: 1350,
        alt: AGENT_MEMORY.coverAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agent Memory — Early Release',
    description: bookDescription,
    images: [AGENT_MEMORY.coverSrc],
  },
};

const liveChapterCount = chapters
  .flatMap((part) => part.chapters)
  .filter((chapter) => chapter.status === 'live').length;

export default function BookPage() {
  return (
    <EditorialPageFrame currentPath="/book" pageClassName="editorial-book-page book-experience-page">
      <div className="grebe-page-content book-experience">
        <header className="book-intro">
          <div className="book-intro-copy">
            <p className="book-release"><span>{AGENT_MEMORY.releaseLabel}</span> {AGENT_MEMORY.publisher}</p>
            <h1 className="book-title">Agent <br />Memory</h1>
            <p className="book-subtitle">{AGENT_MEMORY.subtitle}</p>
            <p className="book-author">By {AGENT_MEMORY.author}</p>
            <p className="book-availability">{AGENT_MEMORY.availability}</p>
            <div className="book-actions">
              <TrackedAction
                href={OREILLY_LINKS.bookPage}
                eventName="oreilly_read_click"
                eventProperties={{ source: 'book', placement: 'hero' }}
                target="_blank"
                rel="noopener noreferrer"
                className="book-primary-action"
              >Read chapters 1–3 <span aria-hidden="true">↗</span></TrackedAction>
              <a href="#subscribe" className="book-secondary-action">Get chapter updates</a>
            </div>
            <p className="book-access-note">
              O&rsquo;Reilly subscription required. Your company or university may provide access, or you can{' '}
              <TrackedAction
                href={OREILLY_LINKS.trial}
                eventName="oreilly_trial_click"
                eventProperties={{ source: 'book' }}
                target="_blank"
                rel="noopener noreferrer"
              >start a free 10-day trial</TrackedAction>.
            </p>
          </div>
          <div className="book-intro-cover"><BookCover eager /></div>
        </header>

        <section className="book-release-status" aria-label="Current Early Release status">
          <div>
            <p><span>Available now</span><strong>{liveChapterCount} chapters live</strong></p>
            <p><span>Coming next</span><strong>Chapter 4</strong></p>
            <p><span>Reader feedback</span><a href="#shoreline-title">Choose a chapter to comment on</a></p>
          </div>
        </section>

        <ChapterShoreline />

        <section className="book-section book-early-release" aria-labelledby="book-early-title">
          <div>
            <h2 id="book-early-title">Read it early.<br />Help make it better.</h2>
            <p className="book-section-intro">The architecture and examples are available while the manuscript is still taking shape. Your questions and experience can improve the final book.</p>
          </div>
          <div className="book-release-notes">
            {earlyReleaseNotes.map((note) => (
              <article key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="book-outcomes" aria-labelledby="book-outcomes-title">
          <div className="book-section">
            <div className="book-section-heading">
              <h2 id="book-outcomes-title">Build memory you can inspect, maintain, and trust.</h2>
              <p>From choosing what to remember to recovering when memory fails.</p>
            </div>
            <div className="book-outcome-grid">
              {buildOutcomes.map((outcome) => (
                <article key={outcome.verb}>
                  <p className="book-chapter-reference">{outcome.chapters}</p>
                  <h3>{outcome.verb} {outcome.title}</h3>
                  <p>{outcome.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="book-section book-contents-section" aria-labelledby="book-contents-title">
          <div>
            <h2 id="book-contents-title">Ten chapters.<br />Three parts.</h2>
            <p className="book-section-intro">Part I establishes the contracts. Part II turns them into systems. Part III handles coordination, risk, and recovery.</p>
          </div>
          <details className="field-book-contents">
            <summary>Read the complete table of contents <span aria-hidden="true">+</span></summary>
            <div className="book-contents-parts">
              {chapters.map((part) => (
                <section key={part.part} aria-labelledby={`part-${part.part}`}>
                  <div className="book-part-heading">
                    <h3 id={`part-${part.part}`}>Part {part.part}</h3><p>{part.partTitle}</p>
                  </div>
                  {part.chapters.map((chapter) => (
                    <article key={chapter.num} className="book-contents-chapter">
                      <span className="book-contents-number">{chapter.num}</span>
                      <div>
                        <div className="book-contents-title">
                          <h4>{chapter.title}</h4>
                          {chapter.status && <span className={`book-chapter-status book-chapter-status--${chapter.status}`}>{chapterStatusLabels[chapter.status]}</span>}
                        </div>
                        <p>{chapter.desc}</p>
                        {chapter.status === 'live' && <div className="book-chapter-actions">
                          <TrackedAction
                            href={chapter.readHref ?? OREILLY_LINKS.bookPage}
                            eventName="oreilly_read_click"
                            eventProperties={{ source: 'book', placement: 'contents', chapter: chapter.num }}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Read chapter ${Number(chapter.num)} on O’Reilly`}
                          >Read on O’Reilly <span aria-hidden="true">↗</span></TrackedAction>
                          <a href={chapterFeedbackHref(chapter)} aria-label={`Email feedback on chapter ${Number(chapter.num)}: ${chapter.title}`}>Send feedback</a>
                        </div>}
                      </div>
                    </article>
                  ))}
                </section>
              ))}
            </div>
          </details>
        </section>
      </div>
    </EditorialPageFrame>
  );
}
