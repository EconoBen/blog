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
        {/* Hero */}
        <header className="grid grid-cols-1 items-start gap-8 py-12 md:grid-cols-12 md:items-center md:gap-12 md:py-16">
          <div className="order-1 space-y-6 md:col-span-7 md:order-none">
            <div className="flex items-center gap-3">
              <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Book / Research
              </span>
              <span className="h-px w-8 bg-outline-variant/20" aria-hidden="true" />
              <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface/50">
                Early release direction
              </span>
            </div>
            <h1 className="max-w-none font-headline text-4xl font-black tracking-tight text-on-surface md:max-w-[7ch] md:text-5xl">
              Agent Memory
            </h1>
            <p className="max-w-xl font-body text-lg italic leading-relaxed text-on-surface/60 sm:text-xl md:text-3xl">
              {bookSubtitle}
            </p>
            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap sm:gap-4 md:gap-6 md:pt-4">
              <a
                href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates"
                className="inline-flex items-center justify-center rounded-lg bg-primary-container px-7 py-4 font-label text-[11px] font-bold uppercase tracking-widest text-on-primary transition-transform hover:-translate-y-1"
              >
                Get book updates
              </a>
              <Link
                href="/publications"
                className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-7 py-4 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
              >
                See related work
              </Link>
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
        <section className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            <div className="flex min-h-[300px] flex-col justify-between rounded-2xl border border-outline-variant/15 bg-surface-container-highest p-6 shadow-[0_18px_50px_rgba(29,28,22,0.04)] sm:p-10 md:col-span-2 md:min-h-[400px] md:p-12">
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
              <div className="mt-7 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container">
                  <span className="material-symbols-outlined text-on-primary" aria-hidden="true">
                    psychology
                  </span>
                </div>
                <span className="max-w-[18ch] font-label text-[11px] font-bold uppercase tracking-widest text-on-surface">
                  Architectural Deep-Dive
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-2xl border border-outline-variant/15 bg-surface-container-low p-7 shadow-[0_18px_50px_rgba(29,28,22,0.04)] sm:p-10">
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

        {/* Book facts */}
        <section className="my-12 grid grid-cols-1 gap-8 rounded-2xl border border-outline-variant/15 bg-surface-container-highest p-8 shadow-[0_18px_50px_rgba(29,28,22,0.04)] sm:grid-cols-2 sm:gap-10 sm:p-10 md:my-16 md:grid-cols-4 md:p-12">
          {bookFacts.map(([label, value]) => (
            <div key={label} className="space-y-2">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                {label}
              </p>
              <p className="font-headline text-lg font-bold text-on-surface">{value}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="border-t border-outline-variant/20 py-12 md:py-16">
          <div className="mx-auto w-full max-w-3xl space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="font-headline text-4xl font-black tracking-tighter text-on-surface sm:text-5xl">
                Follow the research.
              </h2>
              <p className="font-body text-lg text-on-surface/60 sm:text-xl">
                There is no fake signup form here. Email if you want updates on Agent Memory or
                want to talk about the posts, talks, or publications that feed into it.
              </p>
            </div>
            <div className="flex justify-center">
              <a
                href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates"
                className="rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
              >
                Email for updates
              </a>
            </div>
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Posts, talks, and publications will keep carrying the work in the meantime.
            </p>
          </div>
        </section>
      </main>
    </EditorialPageFrame>
  );
}
