import type { Metadata } from 'next';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { SubscribeForm } from '../components/SubscribeForm';

export const metadata: Metadata = {
  title: 'Agent Memory | Book | ECONOBEN.DEV',
  description: 'Agent Memory: Building Stateful AI Agents That Remember, Adapt, and Work Across Time. An O\'Reilly book by Ben Labaschin, now in Early Release.',
};

const OREILLY_BOOK_URL =
  'https://www.oreilly.com/library/view/agent-memory/0642572370473/?utm_source=econoben&utm_medium=book_page&utm_campaign=early_release';
const OREILLY_TRIAL_URL =
  'https://www.oreilly.com/start-trial/?type=individual&utm_source=econoben&utm_medium=book_page&utm_campaign=early_release';

const audiences = [
  {
    title: 'Engineers building agents',
    desc: "You’re past the prompt-and-pray stage. You need memory that works across sessions, handles corrections, and doesn’t rot as it grows.",
  },
  {
    title: 'Teams shipping AI products',
    desc: 'Your agent works in demos but breaks in production. This book covers the operational patterns that make memory reliable at scale.',
  },
  {
    title: 'Anyone designing stateful AI',
    desc: "If you’re deciding how an AI system should remember, forget, and share information, this is the architectural reference.",
  },
];

const questions = [
  {
    q: 'How do I stop my agent from forgetting everything between sessions?',
    a: 'The book separates context from memory and shows how to build retention that survives session boundaries without polluting future interactions.',
    ref: 'Chapters 1 – 2',
  },
  {
    q: 'What should my agent actually remember?',
    a: 'Not everything. The book defines practical rules for what to keep, what to compress, and what to deliberately forget.',
    ref: 'Chapter 3',
  },
  {
    q: 'How do I write memory without filling it with noise?',
    a: 'Write triggers, thresholds, restraint. The book covers when to write, when to wait, and how to avoid memory pollution.',
    ref: 'Chapter 4',
  },
  {
    q: 'My retrieval keeps pulling the wrong memories. Now what?',
    a: 'The book covers query formation, ranking, context loading, semantic caching, and how to evaluate whether retrieval is helping or hurting.',
    ref: 'Chapter 6',
  },
  {
    q: 'How do I keep memory useful as it grows?',
    a: 'Rollups, summaries, corrections, versioning, duplicate detection, and maintenance strategies that prevent memory rot.',
    ref: 'Chapter 7',
  },
  {
    q: 'What happens when memory goes wrong?',
    a: 'Poisoning, leakage, staleness, over-trust. The book closes with detection, repair, rollback, and designing memory to fail safely.',
    ref: 'Chapter 10',
  },
];

const concepts = [
  { title: 'Design a memory API', desc: 'Give your agent the verbs it needs: write, retrieve, update, forget, consolidate' },
  { title: 'Decide what to keep', desc: 'Build practical retention rules instead of storing everything and hoping' },
  { title: 'Retrieve without hallucinating', desc: 'Form better queries, rank candidates, and measure whether recall is helping' },
  { title: 'Resume interrupted work', desc: 'Checkpoints, durable state, and handoff patterns for long-running agents' },
  { title: 'Maintain memory at scale', desc: 'Prevent rot, resolve duplicates, and keep memory useful as it grows' },
  { title: 'Share memory safely', desc: 'Ownership, boundaries, and coordination across agents and teams' },
  { title: 'Design for failure', desc: 'Poisoning, leakage, rollback, and guardrails that limit blast radius' },
  { title: 'Evaluate memory quality', desc: 'Baselines, regressions, and knowing when memory is making things worse' },
];

const chapters = [
  { part: 'I', partTitle: 'Agents, Memory, and the Act of Remembering', chapters: [
    { num: '01', title: 'The Work of Remembering', desc: 'What memory means for an agent, how it differs from context, and why continuity changes everything.', status: 'live' },
    { num: '02', title: 'What the Agent Can Read and Write', desc: 'Where memory lives, the five working verbs, and giving the agent a memory API.', status: 'live' },
  ]},
  { part: 'II', partTitle: 'Building and Managing Agent Memory', chapters: [
    { num: '03', title: 'Choosing What Becomes Memory', desc: 'Rules for retention, compression, forgetting, and knowing when memory helps.', status: 'submitted' },
    { num: '04', title: 'How Memory Gets Written', desc: 'Write triggers, normalization, correction, and failure modes in the write path.', status: 'writing' },
    { num: '05', title: 'Where Memory Lives and Who Controls It', desc: 'Client vs server, portability, inspectability, and the control model.', status: '' },
    { num: '06', title: 'Finding the Right Memory', desc: 'Retrieval, ranking, context loading, caching, and evaluating quality.', status: '' },
    { num: '07', title: 'Keeping Memory Useful Over Time', desc: 'Rollups, corrections, versioning, duplicates, and maintenance strategies.', status: '' },
    { num: '08', title: 'More Than Memory: State and Resumability', desc: 'Checkpoints, durable work, resume, replay, and human pause points.', status: '' },
  ]},
  { part: 'III', partTitle: 'Shared Memory, Risk, and Recovery', chapters: [
    { num: '09', title: 'Shared Memory: Coordination, Boundaries, and Conflict', desc: 'Ownership, leakage, multi-agent coordination, and provenance.', status: '' },
    { num: '10', title: 'Dangerous Memory: Risk, Failure, and Recovery', desc: 'Poisoning, detection, repair, rollback, and designing memory to fail safely.', status: '' },
  ]},
];

const statusLabels: Record<string, string> = {
  live: 'Live now',
  submitted: 'Submitted',
  writing: 'Writing',
};

export default function BookPage() {
  return (
    <EditorialPageFrame currentPath="/book">
      <main className="mx-auto max-w-[1440px] px-5 md:px-8">

        {/* ── Hero ── */}
        <header className="grid grid-cols-1 items-start gap-10 pb-8 pt-12 md:pb-12 md:pt-16 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#0035a0] px-3.5 py-1.5 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                Early Release
              </span>
              <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#555f70]">
                O&apos;Reilly Media
              </span>
            </div>
            <h1 className="mt-8 font-headline text-[clamp(3.5rem,8vw,5.5rem)] font-black leading-[0.95] tracking-[-0.03em] text-[#1d1c16]">
              Agent<br />Memory
            </h1>
            <p className="mt-6 max-w-xl font-body text-xl leading-relaxed text-[#555f70] md:text-2xl">
              Building Stateful AI Agents That Remember, Adapt, and Work Across Time
            </p>
            <p className="mt-5 max-w-xl font-body text-lg leading-relaxed text-[#1d1c16]">
              Chapters 1 and 2 are live on the O&rsquo;Reilly platform right now. New chapters land every four to six weeks.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={OREILLY_BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-[#0035a0] px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5"
                style={{ color: '#fff', WebkitTextFillColor: '#fff' }}
              >
                Read chapters 1 &amp; 2
              </a>
              <a
                href="#subscribe"
                className="inline-flex items-center justify-center rounded-lg border border-[#0035a0]/20 px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-[#0035a0] transition-all hover:-translate-y-0.5"
              >
                Get chapter updates
              </a>
            </div>
            <p className="mt-4 font-body text-sm leading-relaxed text-[#555f70]">
              No O&rsquo;Reilly account?{' '}
              <a
                href={OREILLY_TRIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0035a0] underline underline-offset-2"
              >
                Start a free 10-day trial
              </a>
              . Many companies and universities already provide access.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/assets/agent-memory-cover.png"
              alt="Agent Memory — O'Reilly book by Ben Labaschin"
              className="w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
              style={{ maxHeight: '480px', objectFit: 'contain' }}
            />
          </div>
        </header>

        {/* ── What Early Release Means ── */}
        <section className="pb-12 pt-4">
          <div className="h-px w-full bg-[#1d1c16]/8" />
          <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Reading It Early</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="sticky-note p-7">
              <h3 className="font-headline text-lg font-bold text-[#1d1c16]">It is raw and unedited</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-[#555f70]">
                Early Release chapters ship before copyedit. You get the material months early and you see the rough edges.
              </p>
            </div>
            <div className="sticky-note p-7">
              <h3 className="font-headline text-lg font-bold text-[#1d1c16]">Your feedback changes the book</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-[#555f70]">
                Tell me what landed and what was thin. Reading it now is the only window where what you say still shapes what ships.
              </p>
            </div>
            <div className="sticky-note p-7">
              <h3 className="font-headline text-lg font-bold text-[#1d1c16]">New chapters every 4 to 6 weeks</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-[#555f70]">
                Chapter 3 is submitted. Chapter 4 is being written now. Subscribe below and I&rsquo;ll tell you when each one lands.
              </p>
            </div>
          </div>
        </section>

        {/* ── Who This Book Is For ── */}
        <section className="pb-12">
          <div className="h-px w-full bg-[#1d1c16]/8" />
          <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Who This Book Is For</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {audiences.map((item) => (
              <div key={item.title} className="sticky-note p-7">
                <h3 className="font-headline text-lg font-bold text-[#1d1c16]">{item.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-[#555f70]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Questions This Book Answers ── */}
        <section className="pb-12">
          <div className="h-px w-full bg-[#1d1c16]/8" />
          <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Questions This Book Answers</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            {questions.map((item) => (
              <div key={item.q} className="sticky-note p-7">
                <h3 className="font-headline text-lg font-bold text-[#1d1c16]">{item.q}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-[#555f70]">{item.a}</p>
                <p className="mt-3 font-label text-[10px] font-bold uppercase tracking-[0.1em] text-[#0035a0]">{item.ref}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What You'll Learn to Build ── */}
        <section className="pb-12">
          <div className="h-px w-full bg-[#1d1c16]/8" />
          <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>What You&rsquo;ll Learn to Build</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {concepts.map((item) => (
              <div key={item.title} className="sticky-note p-5">
                <h3 className="font-headline text-base font-bold text-[#1d1c16]">{item.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-[#555f70]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── What the Book Covers ── */}
        <section className="pb-12">
          <div className="h-px w-full bg-[#1d1c16]/8" />
          <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>What the Book Covers</h2>
          <p className="mt-2 font-headline text-lg font-bold text-[#1d1c16]">10 chapters across 3 parts.</p>
          <div className="mt-6">
            {chapters.map((part) => (
              <div key={part.part}>
                <p className="pb-2 pt-5 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#0035a0]">
                  Part {part.part} &mdash; {part.partTitle}
                </p>
                {part.chapters.map((ch) => (
                  <div key={ch.num} className="grid grid-cols-[60px_1fr] gap-5 border-b border-[#1d1c16]/6 py-5">
                    <span className="font-headline text-3xl font-black text-[#0035a0]/15">{ch.num}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-headline text-lg font-bold text-[#1d1c16]">{ch.title}</h3>
                        {ch.status && (
                          <span
                            className={
                              ch.status === 'live'
                                ? 'rounded-full bg-[#0035a0] px-2.5 py-1 font-label text-[9px] font-bold uppercase tracking-[0.15em] text-white'
                                : 'rounded-full border border-[#0035a0]/25 px-2.5 py-1 font-label text-[9px] font-bold uppercase tracking-[0.15em] text-[#0035a0]'
                            }
                          >
                            {statusLabels[ch.status]}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-body text-sm leading-relaxed text-[#555f70]">{ch.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ── Subscribe ── */}
        <section id="subscribe" className="scroll-mt-24 pb-20">
          <div className="h-px w-full bg-[#1d1c16]/8" />
          <div className="pt-10">
            <SubscribeForm variant="light" />
          </div>
        </section>

      </main>
    </EditorialPageFrame>
  );
}
