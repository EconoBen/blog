import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

export const metadata: Metadata = {
  title: 'About | ECONOBEN.DEV',
  description: 'Ben Labaschin’s CV, contact details, and work history on ECONOBEN.DEV.',
};

const experience = [
  {
    role: 'Principal Machine Learning Engineer',
    company: 'Workhelix',
    period: '2022 to present',
    summary:
      'Founding engineer on enterprise GenAI and agent systems. I build async LLM infrastructure, retrieval, memory, and internal tools used in customer workflows.',
    highlights: [
      'Agent memory and retrieval systems',
      'Production tooling for enterprise workflows',
      'Technical writing on AI systems in practice',
    ],
  },
  {
    role: 'Senior Data Scientist',
    company: 'Hopper',
    period: '2021 to 2022',
    summary:
      'Led machine-learning work for Hopper Cloud partnerships and helped build platform systems for travel products and partner workflows.',
    highlights: [
      'Cloud partnership workflows',
      'Travel product experimentation',
      'Platform ML and analytics',
    ],
  },
  {
    role: 'Data Science and economics roles',
    company: 'XPO Logistics, Revantage, Arity',
    period: '2017 to 2021',
    summary:
      'Worked across forecasting, experimentation, optimization, and business-facing ML systems, alongside economics and transportation writing.',
    highlights: [
      'Forecasting and optimization',
      'Business-facing analytics',
      'Writing across economics and transportation',
    ],
  },
];

const quickLinks = [
  {
    label: 'Resume',
    href: '/benjamin_labaschin_resume.pdf',
    action: 'Download PDF',
    note: 'Fastest route to the full CV.',
    download: true,
  },
  {
    label: 'Publications',
    href: '/publications',
    action: 'View writing',
    note: 'Books, reports, and papers.',
  },
  {
    label: 'Talks',
    href: '/talks',
    action: 'View sessions',
    note: 'Recordings and transcripts.',
  },
  {
    label: 'Contact',
    href: 'mailto:benjaminlabaschin@gmail.com',
    action: 'Email me',
    note: 'Best for work or speaking inquiries.',
  },
];

const contactLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/econoben',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/benjamin-labaschin',
  },
  {
    label: 'Email',
    href: 'mailto:benjaminlabaschin@gmail.com',
  },
  {
    label: 'Publications',
    href: '/publications',
  },
  {
    label: 'Talks',
    href: '/talks',
  },
];

export default function AboutPage() {
  return (
    <EditorialPageFrame currentPath="/about">
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-8 pb-12 pt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
        <div className="space-y-4 lg:pt-6">
          <span className="mb-6 block font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">About / CV</span>
          <h1 className="max-w-4xl font-headline text-5xl font-black tracking-tighter text-on-surface md:text-7xl">
            Ben Labaschin
          </h1>
          <p className="max-w-2xl font-body text-lg leading-relaxed text-secondary md:text-xl">
            I build practical AI systems and write about the trade-offs that show up once they have to work in production.
            This page keeps the CV readable, the links obvious, and the story anchored in the ECONOBEN.DEV editorial system.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="/benjamin_labaschin_resume.pdf"
              download
              className="inline-flex items-center justify-center rounded-lg bg-on-surface px-6 py-3.5 font-label text-xs font-bold uppercase tracking-widest text-surface shadow-[0_18px_36px_rgba(29,28,22,0.12)]"
            >
              Download resume
            </a>
            <a
              href="#work-history"
              className="inline-flex items-center justify-center rounded-lg border border-outline-variant/25 bg-surface-container-low px-6 py-3.5 font-label text-xs font-bold uppercase tracking-widest text-on-surface"
            >
              Work history
            </a>
            <Link
              href="/publications"
              className="inline-flex items-center justify-center rounded-lg border border-outline-variant/25 bg-surface-container-low px-6 py-3.5 font-label text-xs font-bold uppercase tracking-widest text-on-surface"
            >
              Publications
            </Link>
          </div>
          <div className="hidden flex-wrap gap-3 pt-2 lg:flex">
            <span className="rounded-full bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-secondary">
              Principal ML Engineer
            </span>
            <span className="rounded-full bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-secondary">
              AI systems, memory, applied ML
            </span>
            <span className="rounded-full bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-secondary">
              Resume · Talks · Publications
            </span>
          </div>
        </div>

        <aside className="overflow-hidden rounded-2xl bg-surface-container-highest shadow-[0_24px_60px_rgba(29,28,22,0.06)] lg:self-start">
          <img src="/assets/atlas_and_I.jpg" alt="Ben Labaschin with Atlas" className="aspect-[4/5] w-full object-cover" />
          <div className="space-y-4 p-6 md:p-7">
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Current role</p>
              <p className="mt-2 font-headline text-lg font-bold text-on-surface">Principal Machine Learning Engineer at Workhelix</p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Resume</p>
              <p className="mt-2 font-headline text-lg font-bold text-on-surface">Download the PDF or scan the work history below</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard label="Focus" value="AI systems, memory, and applied ML" />
              <StatCard label="Contact" value="Email, LinkedIn, GitHub, talks" />
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-12">
          <article className="rounded-2xl bg-surface-container-low p-6 md:p-8 lg:col-span-7">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">What I do</p>
            <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-on-surface">Practical summary.</h2>
            <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-secondary">
              The work is usually some mix of agent memory, retrieval, evaluation, and the plumbing needed to make AI systems
              usable for actual teams. I write because the implementation details matter.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {quickLinks.map((item) => (
                <div key={item.label} className="rounded-xl bg-surface-container-highest p-4">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{item.label}</p>
                  <p className="mt-2 font-headline text-base font-bold leading-snug text-on-surface">{item.note}</p>
                  {item.download || item.href.startsWith('http') || item.href.startsWith('mailto:') ? (
                    <a
                      href={item.href}
                      className="mt-3 inline-flex items-center justify-center rounded-lg bg-on-surface px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-surface"
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                      download={item.download ? true : undefined}
                    >
                      {item.action}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="mt-3 inline-flex items-center justify-center rounded-lg bg-on-surface px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-surface"
                    >
                      {item.action}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </article>

          <aside className="rounded-2xl bg-surface-container-low p-6 md:p-8 lg:col-span-5">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Contact</p>
            <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-on-surface">Reach out directly.</h2>
            <p className="mt-4 font-body text-lg leading-relaxed text-secondary">
              Email is usually the fastest path. GitHub and LinkedIn are here if that is easier.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {contactLinks.map((link) => {
                const isExternal = link.href.startsWith('http') || link.href.startsWith('mailto:');

                return isExternal ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                    className="rounded-xl bg-surface-container-highest px-4 py-4 font-label text-xs font-bold uppercase tracking-widest text-secondary transition-colors hover:bg-secondary-container hover:text-primary"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-xl bg-surface-container-highest px-4 py-4 font-label text-xs font-bold uppercase tracking-widest text-secondary transition-colors hover:bg-secondary-container hover:text-primary"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-16" id="work-history">
        <div className="mb-7 grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">Work history</p>
            <h2 className="mt-3 font-headline text-3xl font-bold tracking-tight text-on-surface">
              Recent roles and the work attached to them.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="font-body text-base italic text-secondary">Kept short enough to scan, but specific enough to be useful.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {experience.map((item) => (
                <article key={`${item.company}-${item.role}`} className="rounded-2xl bg-surface-container-highest p-6 md:p-8">
                  <div className="flex flex-col gap-4 border-b border-outline-variant/20 pb-5 md:flex-row md:items-baseline md:justify-between">
                    <div>
                      <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{item.company}</p>
                      <h3 className="mt-2 font-headline text-2xl font-bold tracking-tight text-on-surface">{item.role}</h3>
                    </div>
                    <span className="font-label text-[10px] uppercase tracking-widest text-secondary">{item.period}</span>
                  </div>
                  <p className="mt-5 font-body text-base leading-relaxed text-secondary md:text-lg">{item.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.highlights.map((highlight) => (
                      <span key={highlight} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl bg-surface-container-low p-8">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Why this page exists</p>
              <p className="mt-4 font-body text-lg leading-relaxed text-secondary">
                The goal here is utility: quick contact paths, a readable CV, and enough context to understand what I work on.
              </p>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-8">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Useful links</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/talks" className="rounded-full bg-surface-container-high px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-secondary">
                  Talks
                </Link>
                <Link href="/publications" className="rounded-full bg-surface-container-high px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-secondary">
                  Publications
                </Link>
                <a href="mailto:benjaminlabaschin@gmail.com" className="rounded-full bg-surface-container-high px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-secondary">
                  Email
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </EditorialPageFrame>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-container-highest p-4">
      <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{label}</p>
      <p className="mt-2 font-headline text-lg font-bold leading-tight text-on-surface">{value}</p>
    </div>
  );
}
