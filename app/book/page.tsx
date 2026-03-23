import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

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
        <header className="grid grid-cols-1 items-center gap-12 py-20 md:grid-cols-12 md:py-32">
          <div className="space-y-8 md:col-span-7">
            <div className="inline-block rounded-sm bg-[#bdc7db] px-3 py-1">
              <span className="font-label text-xs font-bold uppercase tracking-widest text-[#121c2b]">
                Forthcoming O&apos;Reilly Book
              </span>
            </div>
            <h1 className="font-headline text-6xl font-black leading-none tracking-tighter text-[#1d1c16] md:text-8xl">
              Agent
              <br />
              Memory.
            </h1>
            <p className="max-w-xl font-body text-2xl italic leading-relaxed text-[#555f70] md:text-3xl">
              A practical guide to how AI systems should remember, retrieve, compress, and act on
              information in production.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <a
                href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates"
                className="rounded-lg bg-[#2563eb] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-white shadow-[0_24px_40px_rgba(37,99,235,0.1)] transition-opacity hover:opacity-90"
              >
                Get book updates
              </a>
              <Link
                href="/publications"
                className="rounded-lg border border-[#c3c6d7] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider transition-colors hover:bg-[#f8f3e9]"
              >
                See related work
              </Link>
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl bg-[#e7e2d8] p-12 shadow-[0_24px_40px_rgba(29,28,22,0.05)]">
              <div className="relative z-10 flex h-full w-full flex-col justify-between rounded-sm bg-[#1d1c16] p-8 text-[#fef9ef]">
                <div className="space-y-1">
                  <p className="font-headline text-[10px] uppercase tracking-[0.3em] opacity-60">
                    Working Manuscript
                  </p>
                  <h2 className="font-headline text-4xl font-black leading-none">
                    AGENT
                    <br />
                    MEMORY
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="font-body text-lg italic opacity-80">
                    Practical memory systems for production agents.
                  </p>
                  <div className="h-px w-12 bg-[#fef9ef]/20" />
                  <p className="font-headline text-xs font-bold uppercase tracking-widest">
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

        <section className="py-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex min-h-[400px] flex-col justify-between rounded-xl bg-[#f8f3e9] p-12 md:col-span-2">
              <div className="max-w-xl">
                <span className="mb-4 block font-label text-xs font-bold uppercase tracking-widest text-[#004ac6]">
                  Central Thesis
                </span>
                <h3 className="mb-6 font-headline text-4xl font-bold tracking-tight text-[#1d1c16]">
                  The memory problem is really a systems problem.
                </h3>
                <p className="font-body text-xl leading-relaxed text-[#434655]">
                  The book is about the mechanics that sit between a one-shot model call and a
                  durable agent: what should be remembered, how it should be compressed, when it
                  should be retrieved, and how those choices affect reliability once the system is
                  live.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dbe1ff] text-[#00174b]">
                  <span className="font-headline text-[10px] font-black uppercase tracking-[0.25em]">
                    AM
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="block font-headline text-sm font-bold uppercase tracking-tight text-[#1d1c16]">
                    Architectural Deep-Dive
                  </span>
                  <span className="block font-label text-[10px] uppercase tracking-widest text-[#555f70]">
                    Memory systems, retrieval, and production trade-offs
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-xl bg-[#e7e2d8] p-10">
              <h4 className="mb-6 font-headline text-5xl font-black text-[#1d1c16]/10">01.</h4>
              <p className="font-body text-lg italic text-[#434655]">
                Memory is not just storage. It is the structure that decides what historical intent
                remains available to the agent when the next decision matters.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-[#1d1c16]/5 py-20">
          <div className="flex flex-col gap-16 md:flex-row">
            <div className="md:w-1/3">
              <h2 className="sticky top-32 font-headline text-4xl font-black tracking-tighter text-[#1d1c16]">
                Chapter
                <br />
                Insights.
              </h2>
            </div>
            <div className="space-y-16 md:w-2/3">
              {chapterInsights.map((item) => (
                <div key={item.label}>
                  <span className="mb-2 block font-label text-xs uppercase tracking-widest text-[#555f70]">
                    {item.label}
                  </span>
                  <h4 className="mb-4 font-headline text-2xl font-bold text-[#1d1c16] transition-colors hover:text-[#004ac6]">
                    {item.title}
                  </h4>
                  <p className="max-w-2xl font-body text-lg leading-relaxed text-[#434655]">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="my-20 grid grid-cols-1 gap-12 rounded-xl bg-[#f8f3e9] p-12 md:grid-cols-4">
          {bookFacts.map(([label, value]) => (
            <div key={label} className="space-y-2">
              <p className="font-label text-[10px] font-bold uppercase tracking-widest text-[#555f70]">
                {label}
              </p>
              <p className="font-headline text-lg font-bold text-[#1d1c16]">{value}</p>
            </div>
          ))}
        </section>

        <section className="flex justify-center py-32">
          <div className="w-full max-w-3xl space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="font-headline text-5xl font-black tracking-tighter text-[#1d1c16]">
                Follow the research.
              </h2>
              <p className="font-body text-xl text-[#555f70]">
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
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#555f70]">
              Posts, talks, and publications will keep carrying the work in the meantime.
            </p>
          </div>
        </section>
      </main>
    </EditorialPageFrame>
  );
}
