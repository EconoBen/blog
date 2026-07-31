import type { Metadata } from 'next';
import { BookCover } from '../components/BookCover';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { TrackedAction } from '../components/TrackedAction';
import {
  AGENT_MEMORY,
  OREILLY_LINKS,
  buildOutcomes,
  chapters,
  chapterStatusLabels,
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
    <EditorialPageFrame currentPath="/book">
      <div className="grebe-page-content">
        <header className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 px-5 pb-16 pt-12 md:px-8 md:pb-20 md:pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#b9140b] px-3.5 py-1.5 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                {AGENT_MEMORY.releaseLabel}
              </span>
              <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#555f70]">
                {AGENT_MEMORY.publisher}
              </span>
            </div>

            <h1 className="mt-7 max-w-[8ch] font-headline text-[clamp(3.3rem,7.5vw,6.4rem)] font-black leading-[0.9] tracking-[-0.055em] text-[#211e1f]">
              Agent Memory
            </h1>
            <p className="mt-7 max-w-2xl font-body text-xl leading-relaxed text-[#555f70] md:text-[1.65rem]">
              {AGENT_MEMORY.subtitle}
            </p>
            <p className="mt-5 max-w-xl font-body text-lg leading-relaxed text-[#211e1f]">
              {AGENT_MEMORY.availability}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <TrackedAction
                href={OREILLY_LINKS.bookPage}
                eventName="oreilly_read_click"
                eventProperties={{ source: 'book', placement: 'hero' }}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#176b69] px-7 py-3.5 font-headline text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_14px_28px_rgba(23,107,105,0.18)] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#176b69]/35 focus:ring-offset-2"
                style={{ color: '#fff', WebkitTextFillColor: '#fff' }}
              >
                Read chapters 1 &amp; 2
              </TrackedAction>
              <a
                href="#subscribe"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#176b69]/25 bg-[#fffdf8]/70 px-7 py-3.5 font-headline text-sm font-bold uppercase tracking-[0.08em] text-[#176b69] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#176b69]/25 focus:ring-offset-2"
              >
                Get chapter updates
              </a>
            </div>

            <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-[#555f70]">
              No O&rsquo;Reilly access?{' '}
              <TrackedAction
                href={OREILLY_LINKS.trial}
                eventName="oreilly_trial_click"
                eventProperties={{ source: 'book' }}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#176b69] underline decoration-[#84b8b1] underline-offset-4"
              >
                Start a free 10-day trial
              </TrackedAction>
              . Many companies and universities already provide access.
            </p>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute -left-2 top-10 hidden h-28 w-28 rounded-full border border-[#84b8b1]/35 lg:block" />
            <BookCover eager className="relative" />
          </div>
        </header>

        <section aria-label="Current Early Release status" className="border-y border-[#211e1f]/10 bg-[#fffdf8]/72">
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 divide-y divide-[#211e1f]/10 px-5 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-8">
            <div className="py-6 md:pr-8">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#d95a2e]">Available now</p>
              <p className="mt-2 font-headline text-2xl font-black text-[#211e1f]">{liveChapterCount} chapters live</p>
            </div>
            <div className="py-6 md:px-8">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#d95a2e]">Next in line</p>
              <p className="mt-2 font-headline text-2xl font-black text-[#211e1f]">Chapter 3 submitted</p>
            </div>
            <div className="py-6 md:pl-8">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#d95a2e]">Still shapeable</p>
              <p className="mt-2 font-headline text-2xl font-black text-[#211e1f]">Reader feedback is open</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1320px] gap-10 px-5 py-20 md:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 lg:py-28">
          <div>
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.25em] text-[#d95a2e]">
              Why read the rough version?
            </p>
            <h2 className="mt-4 max-w-[10ch] font-headline text-4xl font-black tracking-[-0.03em] text-[#211e1f] md:text-5xl">
              Early means useful now—and changeable.
            </h2>
            <p className="mt-6 max-w-lg font-body text-lg leading-relaxed text-[#555f70]">
              This is a working technical book, not a polished preview. You get the architecture and examples early; I get the chance to make the final book answer the questions builders actually have.
            </p>
          </div>
          <div className="border-t border-[#211e1f]/12">
            {earlyReleaseNotes.map((note, index) => (
              <article
                key={note.title}
                className="grid gap-4 border-b border-[#211e1f]/12 py-7 sm:grid-cols-[3.5rem_1fr]"
              >
                <span className="font-headline text-3xl font-black text-[#84b8b1]">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-headline text-2xl font-bold text-[#211e1f]">{note.title}</h3>
                  <p className="mt-2 max-w-2xl font-body text-base leading-relaxed text-[#555f70]">{note.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#176b69]/14 bg-[#edf2ea]/86">
          <div className="mx-auto max-w-[1320px] px-5 py-20 md:px-8 md:py-24">
            <div className="max-w-3xl">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.25em] text-[#d95a2e]">
                What you will learn to build
              </p>
              <h2 className="mt-4 font-headline text-4xl font-black tracking-[-0.03em] text-[#211e1f] md:text-5xl">
                A memory system you can inspect, operate, and trust.
              </h2>
            </div>

            <div className="mt-12 grid border-t border-[#176b69]/18 md:grid-cols-2">
              {buildOutcomes.map((outcome, index) => (
                <article
                  key={outcome.verb}
                  className={[
                    'border-b border-[#176b69]/18 py-8',
                    index % 2 === 0 ? 'md:border-r md:pr-10' : 'md:pl-10',
                  ].join(' ')}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#176b69]">
                      {outcome.chapters}
                    </p>
                    <span className="font-headline text-3xl font-black text-[#176b69]/15">0{index + 1}</span>
                  </div>
                  <h3 className="mt-4 font-headline text-2xl font-black text-[#211e1f]">
                    <span className="text-[#176b69]">{outcome.verb}</span> {outcome.title}
                  </h3>
                  <p className="mt-3 max-w-xl font-body text-base leading-relaxed text-[#555f70]">{outcome.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.25em] text-[#d95a2e]">
                The current map
              </p>
              <h2 className="mt-4 font-headline text-4xl font-black tracking-[-0.03em] text-[#211e1f] md:text-5xl">
                Ten chapters across three parts.
              </h2>
              <p className="mt-5 max-w-md font-body text-lg leading-relaxed text-[#555f70]">
                Part I establishes the contracts. Part II turns them into systems. Part III handles coordination, risk, and recovery.
              </p>
            </div>

            <div className="space-y-12">
              {chapters.map((part) => (
                <section key={part.part} aria-labelledby={`part-${part.part}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-[#176b69] pb-3">
                    <h3 id={`part-${part.part}`} className="font-headline text-2xl font-black text-[#211e1f]">
                      Part {part.part}
                    </h3>
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.15em] text-[#176b69]">
                      {part.partTitle}
                    </p>
                  </div>

                  {part.chapters.map((chapter) => (
                    <article
                      key={chapter.num}
                      className="grid grid-cols-[3.25rem_1fr] gap-4 border-b border-[#211e1f]/10 py-6 sm:grid-cols-[4.5rem_1fr]"
                    >
                      <span className="font-headline text-3xl font-black text-[#84b8b1]">{chapter.num}</span>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-headline text-xl font-bold text-[#211e1f]">{chapter.title}</h4>
                          {chapter.status ? (
                            <span
                              className={
                                chapter.status === 'live'
                                  ? 'rounded-full bg-[#176b69] px-2.5 py-1 font-label text-[9px] font-bold uppercase tracking-[0.14em] text-white'
                                  : 'rounded-full border border-[#d95a2e]/35 bg-[#fffdf8]/70 px-2.5 py-1 font-label text-[9px] font-bold uppercase tracking-[0.14em] text-[#d95a2e]'
                              }
                            >
                              {chapterStatusLabels[chapter.status]}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-[#555f70]">{chapter.desc}</p>
                      </div>
                    </article>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </section>
      </div>
    </EditorialPageFrame>
  );
}
