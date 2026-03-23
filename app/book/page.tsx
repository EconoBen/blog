import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

export const metadata: Metadata = {
  title: 'Agent Memory | Book | ECONOBEN.DEV',
  description: 'The forthcoming Agent Memory book page on ECONOBEN.DEV.',
};

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
      <main className="mx-auto max-w-7xl px-8">
        <header className="grid grid-cols-1 items-start gap-6 py-12 md:grid-cols-12 md:items-center md:gap-12 md:py-28">
          <div className="order-1 space-y-6 md:col-span-7 md:order-none">
            <div className="inline-flex items-center gap-3 rounded-sm bg-[#bdc7db] px-3 py-1">
              <span className="font-label text-xs font-bold uppercase tracking-[0.28em] text-[#121c2b]">
                Book / Research
              </span>
              <span className="h-px w-8 bg-[#121c2b]/25" aria-hidden="true" />
              <span className="font-label text-[10px] font-bold uppercase tracking-[0.24em] text-[#3d4758]">
                Working title
              </span>
            </div>
            <h1 className="max-w-none font-headline text-4xl font-black leading-[0.92] tracking-tighter text-[#1d1c16] sm:text-5xl md:max-w-[7ch] md:text-8xl md:leading-none">
              Agent Memory
            </h1>
            <p className="max-w-xl font-body text-lg italic leading-relaxed text-[#555f70] sm:text-xl md:text-3xl">
              A practical guide to how AI systems should remember, retrieve, compress, and act on
              information in production.
            </p>
            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap sm:gap-4 md:gap-6 md:pt-4">
              <a
                href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates"
                className="inline-flex items-center justify-center rounded-lg bg-[#2563eb] px-7 py-4 font-headline text-sm font-bold uppercase tracking-wider text-white shadow-[0_24px_40px_rgba(37,99,235,0.1)] transition-opacity hover:opacity-90"
              >
                Get book updates
              </a>
              <Link
                href="/publications"
                className="inline-flex items-center justify-center rounded-lg border border-[#c3c6d7] px-7 py-4 font-headline text-sm font-bold uppercase tracking-wider transition-colors hover:bg-[#f8f3e9]"
              >
                See related work
              </Link>
            </div>
          </div>

          <div className="relative order-2 mt-0 hidden md:col-span-5 md:order-none md:mt-0 md:block">
            <div className="relative mx-auto flex aspect-[4/5] max-w-[12.5rem] items-center justify-center overflow-hidden rounded-xl bg-[#e7e2d8] p-3 shadow-[0_24px_40px_rgba(29,28,22,0.05)] sm:max-w-[18rem] sm:p-6 md:max-w-none md:p-12">
              <div className="relative z-10 flex h-full w-full flex-col justify-between rounded-sm bg-[#1d1c16] p-4 text-[#fef9ef] sm:p-8">
                <div className="space-y-2">
                  <p className="font-headline text-[10px] uppercase tracking-[0.34em] opacity-60">
                    Working manuscript
                  </p>
                  <h2 className="max-w-[7ch] font-headline text-xl font-black leading-[0.9] tracking-tight sm:text-4xl">
                    AGENT MEMORY
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="max-w-[15ch] font-body text-[0.8rem] italic leading-relaxed opacity-80 sm:text-lg">
                    Practical memory systems for production agents.
                  </p>
                  <div className="h-px w-12 bg-[#fef9ef]/20" />
                  <p className="font-headline text-[11px] font-bold uppercase tracking-[0.22em]">
                    ECONOBEN.DEV
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay">
                <div className="absolute -mr-32 -mt-32 h-64 w-64 rounded-full border-[40px] border-[#004ac6]" />
              </div>
            </div>
          </div>
        </header>

        <section className="md:hidden">
          <div className="mx-auto mt-2 flex max-w-[15rem] items-center justify-center overflow-hidden rounded-xl bg-[#e7e2d8] p-3 shadow-[0_24px_40px_rgba(29,28,22,0.05)]">
            <div className="relative z-10 flex h-full w-full flex-col justify-between rounded-sm bg-[#1d1c16] p-4 text-[#fef9ef]">
              <div className="space-y-2">
                <p className="font-headline text-[10px] uppercase tracking-[0.34em] opacity-60">
                  Working manuscript
                </p>
                <h2 className="font-headline text-lg font-black leading-[0.9] tracking-tight">
                  AGENT MEMORY
                </h2>
              </div>
              <div className="space-y-3">
                <p className="max-w-[15ch] font-body text-[0.8rem] italic leading-relaxed opacity-80">
                  Practical memory systems for production agents.
                </p>
                <div className="h-px w-12 bg-[#fef9ef]/20" />
                <p className="font-headline text-[11px] font-bold uppercase tracking-[0.22em]">
                  ECONOBEN.DEV
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            <div className="flex min-h-[300px] flex-col justify-between rounded-xl bg-[#f8f3e9] p-6 sm:p-10 md:col-span-2 md:min-h-[400px] md:p-12">
              <div className="max-w-xl">
                <span className="mb-4 block font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#004ac6]">
                  Central Thesis
                </span>
                <h3 className="mb-4 font-headline text-3xl font-bold tracking-tight text-[#1d1c16] sm:text-4xl">
                  The memory problem is really a systems problem.
                </h3>
                <p className="font-body text-base leading-relaxed text-[#434655] sm:text-xl">
                  The book is about the mechanics that sit between a one-shot model call and a
                  durable agent: what should be remembered, how it should be compressed, when it
                  should be retrieved, and how those choices affect reliability once the system is
                  live.
                </p>
              </div>
              <div className="mt-7 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dbe1ff]">
                  <span className="material-symbols-outlined text-[#00174b]" aria-hidden="true">
                    psychology
                  </span>
                </div>
                <span className="max-w-[18ch] font-headline text-sm font-bold uppercase tracking-tight text-[#1d1c16]">
                  Architectural Deep-Dive
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-xl bg-[#e7e2d8] p-7 sm:p-10">
              <h4 className="mb-5 font-headline text-4xl font-black text-[#1d1c16]/10 sm:text-5xl">01.</h4>
              <p className="font-body text-base italic leading-relaxed text-[#434655] sm:text-lg">
                Memory is not just storage. It is the structure that decides what historical intent
                remains available to the agent when the next decision matters.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#1d1c16]/5 py-16 md:py-20">
          <div className="flex flex-col gap-10 md:flex-row md:gap-16">
            <div className="md:w-1/3">
              <h2 className="font-headline text-3xl font-black tracking-tighter text-[#1d1c16] md:sticky md:top-32 md:text-4xl">
                Chapter
                <br />
                Insights.
              </h2>
            </div>
            <div className="space-y-12 md:w-2/3 md:space-y-16">
              {chapterInsights.map((item) => (
                <div key={item.label}>
                  <span className="mb-2 block font-label text-[10px] uppercase tracking-[0.22em] text-[#555f70]">
                    {item.label}
                  </span>
                  <h4 className="mb-4 font-headline text-xl font-bold text-[#1d1c16] transition-colors hover:text-[#004ac6] sm:text-2xl">
                    {item.title}
                  </h4>
                  <p className="max-w-2xl font-body text-base leading-relaxed text-[#434655] sm:text-lg">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="my-16 grid grid-cols-1 gap-8 rounded-xl bg-[#f8f3e9] p-8 sm:grid-cols-2 sm:gap-10 sm:p-10 md:my-20 md:grid-cols-4 md:p-12">
          {bookFacts.map(([label, value]) => (
            <div key={label} className="space-y-2">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-[#555f70]">
                {label}
              </p>
              <p className="font-headline text-lg font-bold text-[#1d1c16]">{value}</p>
            </div>
          ))}
        </section>

        <section className="flex justify-center py-20 md:py-32">
          <div className="w-full max-w-3xl space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="font-headline text-4xl font-black tracking-tighter text-[#1d1c16] sm:text-5xl">
                Follow the research.
              </h2>
              <p className="font-body text-lg text-[#555f70] sm:text-xl">
                There is no fake signup form here. Email if you want updates on Agent Memory or
                want to talk about the posts, talks, or publications that feed into it.
              </p>
            </div>
            <div className="flex justify-center">
              <a
                href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates"
                className="rounded-md bg-[#1d1c16] px-8 py-4 font-headline text-xs font-bold uppercase tracking-widest text-[#fef9ef] transition-colors hover:bg-[#004ac6]"
              >
                Email for updates
              </a>
            </div>
            <p className="font-label text-[10px] uppercase tracking-[0.22em] text-[#555f70]">
              Posts, talks, and publications will keep carrying the work in the meantime.
            </p>
          </div>
        </section>
      </main>
    </EditorialPageFrame>
  );
}
