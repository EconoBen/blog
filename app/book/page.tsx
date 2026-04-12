import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

export const metadata: Metadata = {
  title: 'Agent Memory | Book | ECONOBEN.DEV',
  description: 'The forthcoming Agent Memory book page on ECONOBEN.DEV.',
};

const bookSubtitle =
  'How AI systems remember, retrieve, compress, and act on information in production.';

const chapterInsights = [
  {
    label: 'What the book covers',
    title: 'How memory, retrieval, compression, and action fit together in production agents.',
    summary:
      'The book is a practical guide to the mechanics behind durable agent behavior: storing useful context, retrieving it at the right time, and keeping the system understandable once it is in production.',
  },
  {
    label: 'Why it belongs here',
    title: 'It extends the same technical arc as the posts, reports, and talks.',
    summary:
      'The page should make the book easy to understand before launch without turning it into a separate identity. The subject, audience, and point of view stay tied to the rest of the site.',
  },
  {
    label: 'What readers should take away',
    title: 'Practical patterns for building memory systems people can trust.',
    summary:
      'The emphasis is on system design, operational trade-offs, and the architectural choices that determine whether long-running agents stay useful or become opaque.',
  },
];

const bookFacts = [
  ['Status', 'In progress'],
  ['Publisher', "O'Reilly Media"],
  ['Format', 'Print + digital'],
  ['Focus', 'Agent memory systems'],
] as const;

export default function BookPage() {
  return (
    <EditorialPageFrame currentPath="/book">
      <main className="mx-auto max-w-[1440px] px-8">
        {/* Book facts */}
        <section className="sticky-note mt-6 grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 sm:gap-10 sm:p-10 md:grid-cols-4 md:p-12">
          {bookFacts.map(([label, value]) => (
            <div key={label} className="space-y-2">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                {label}
              </p>
              <p className="font-headline text-lg font-bold text-on-surface">{value}</p>
            </div>
          ))}
        </section>

        {/* Hero */}
        <header className="grid grid-cols-1 items-start gap-8 pb-4 pt-12 md:grid-cols-12 md:items-center md:gap-12 md:pb-6 md:pt-16">
          <div className="order-1 space-y-8 md:col-span-7 md:order-none">
            {/* Status badge */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#0035a0] px-3.5 py-1.5 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_4px_12px_rgba(0,53,160,0.25)]">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                In progress
              </span>
              <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface/40">
                O&apos;Reilly Media
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="font-headline text-5xl font-black tracking-tight text-on-surface md:text-6xl">
                Agent Memory
              </h1>
              <p className="max-w-lg font-body text-xl leading-relaxed text-on-surface/70 md:text-2xl">
                {bookSubtitle}
              </p>
            </div>

            {/* Key details */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 border-l-2 border-[#0035a0]/20 pl-5">
              <div>
                <p className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface/40">Format</p>
                <p className="font-headline text-sm font-bold text-on-surface">Print + Digital</p>
              </div>
              <div>
                <p className="font-label text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface/40">Focus</p>
                <p className="font-headline text-sm font-bold text-on-surface">Agent memory systems</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates"
                className="inline-flex items-center justify-center rounded-lg border border-[#0035a0]/20 bg-white px-8 py-4 font-label text-[11px] font-bold uppercase tracking-widest text-[#0035a0] transition-all hover:-translate-y-1 hover:border-[#0035a0]/40 hover:shadow-[0_8px_20px_rgba(0,53,160,0.1)]"
              >
                Get book updates
              </a>
              <Link
                href="/publications"
                className="inline-flex items-center justify-center rounded-lg border border-[#0035a0]/20 bg-white px-8 py-4 font-label text-[11px] font-bold uppercase tracking-widest text-[#0035a0] transition-all hover:-translate-y-1 hover:border-[#0035a0]/40 hover:shadow-[0_8px_20px_rgba(0,53,160,0.1)]"
              >
                See related work
              </Link>
            </div>

            {/* Follow the research — inline */}
            <div className="border-t border-outline-variant/15 pt-6">
              <p className="max-w-lg font-body text-sm leading-relaxed text-on-surface/50">
                No fake signup form — just email if you want updates on Agent Memory or want to talk about the posts, talks, or publications that feed into it.
              </p>
            </div>
          </div>

          {/* Book illustration */}
          <div className="order-2 flex items-center justify-center md:col-span-5 md:order-none">
            <img
              src="/assets/book-illustration.svg"
              alt="Agent Memory book"
              className="h-auto w-full max-w-[320px] md:max-w-[380px]"
            />
          </div>
        </header>

        {/* Central thesis */}
        <section className="py-2 md:py-3">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            <div className="sticky-note flex min-h-[300px] flex-col justify-between p-6 sm:p-10 md:col-span-2 md:min-h-[400px] md:p-12">
              <div className="max-w-xl">
                <span className="mb-4 block font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Central Thesis
                </span>
                <h3 className="mb-4 font-headline text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
                  The memory problem is really a systems problem.
                </h3>
                <p className="font-body text-base leading-relaxed text-on-surface/70 sm:text-xl">
                  The book is about the mechanics that sit between a one-shot model call and a
                  durable agent: what should be remembered, how it should be compressed, when it
                  should be retrieved, and how those choices affect reliability once the system is
                  live.
                </p>
              </div>
              <div className="mt-7 inline-flex items-center gap-3 rounded-lg border border-outline-variant/15 px-4 py-3">
                <span className="font-headline text-lg" aria-hidden="true">🧠</span>
                <span className="font-headline text-sm font-bold text-on-surface">Architectural Deep-Dive</span>
              </div>
            </div>
            <div className="sticky-note flex flex-col justify-center p-7 sm:p-10">
              <h4 className="mb-5 font-headline text-4xl font-black text-on-surface/10 sm:text-5xl">01.</h4>
              <p className="font-body text-base italic leading-relaxed text-on-surface/70 sm:text-lg">
                Memory is not just storage. It is the structure that decides what historical intent
                remains available to the agent when the next decision matters.
              </p>
            </div>
          </div>
        </section>

        {/* Chapter insights */}
        <section className="border-t border-outline-variant/20 py-12 md:py-16">
          <div className="flex flex-col gap-10 md:flex-row md:gap-16">
            <div className="md:w-1/3">
              <h2 className="font-headline text-3xl font-black tracking-tighter text-on-surface md:sticky md:top-32 md:text-4xl">
                Chapter
                <br />
                Insights.
              </h2>
            </div>
            <div className="space-y-12 md:w-2/3 md:space-y-16">
              {chapterInsights.map((item) => (
                <div key={item.label}>
                  <span className="mb-2 block font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                    {item.label}
                  </span>
                  <h4 className="mb-4 font-headline text-xl font-bold text-on-surface transition-colors hover:text-primary sm:text-2xl">
                    {item.title}
                  </h4>
                  <p className="max-w-2xl font-body text-base leading-relaxed text-on-surface/70 sm:text-lg">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>


      </main>
    </EditorialPageFrame>
  );
}
