import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

export const metadata: Metadata = {
  title: 'About | ECONOBEN.DEV',
  description: "Ben Labaschin's CV, contact details, publications, and work history on ECONOBEN.DEV.",
};

const experience = [
  {
    role: 'Principal Machine Learning Engineer',
    company: 'Workhelix',
    period: '2022 to present',
    summary:
      'Founding engineer on enterprise GenAI and agent systems. I build async LLM infrastructure, retrieval, memory, and internal tools used in customer workflows.',
    bullets: [
      'Built core platform work for scalable async LLM APIs and custom embedding systems used by Fortune 50 customers.',
      'Shipped agent memory, retrieval, and workflow tooling for production use, with a focus on reliability and maintainability.',
      'Developed analysis and evaluation systems that helped quantify how GenAI changes engineering workflows.',
      'Contributed technical writing on AI agents, memory, and practical deployment patterns alongside product work.',
    ],
    tags: ['LLMs', 'Embeddings', 'Retrieval', 'Agent memory', 'FastAPI', 'Docker', 'AWS'],
  },
  {
    role: 'Senior Data Scientist',
    company: 'Hopper',
    period: '2021 to 2022',
    summary:
      'Led machine-learning work for Hopper Cloud partnerships and helped build platform systems for travel products and partner workflows.',
    bullets: [
      'Owned ML engineering for the Capital One Travel partnership and supported the systems that made Hopper Cloud usable for enterprise partners.',
      'Designed multi-tenant ML flows, including bandit-style decisioning and price-freeze logic for travel booking experiences.',
      'Helped implement CI/CD and orchestration workflows with GitHub Actions and Kubeflow to keep partner releases moving quickly.',
    ],
    tags: ['GCP', 'MLOps', 'GitHub Actions', 'Kubeflow', 'Bandits', 'Travel platforms'],
  },
  {
    role: 'Data Scientist',
    company: 'XPO Logistics',
    period: '2021',
    summary:
      'Worked on forecasting, experimentation, and pricing systems that produced measurable cost savings and better shipment prioritization.',
    bullets: [
      'Delivered $8M in savings through optimized shipment prioritization and pricing systems.',
      'Used A/B testing and XGBoost-based models to turn operational rules into measurable decision systems.',
    ],
    tags: ['A/B testing', 'XGBoost', 'Pricing', 'Forecasting', 'Operations'],
  },
  {
    role: 'Data Scientist',
    company: 'Revantage (Blackstone)',
    period: '2019 to 2021',
    summary:
      'Built analytics and ROI tooling for real-estate investment decisions, renovation planning, and geodata-based warehouse models.',
    bullets: [
      'Led A/B testing, power analysis, and regression modeling to improve investment decisions and renovation economics.',
      'Built Python analytics pipelines with SciPy and scikit-learn for apartment ROI and warehouse investment analysis.',
    ],
    tags: ['SciPy', 'scikit-learn', 'Regression', 'Geo data', 'Investment analytics'],
  },
  {
    role: 'Economist Researcher / Data Scientist',
    company: 'Arity (Allstate)',
    period: '2017 to 2019',
    summary:
      'Worked on telematics-based risk modeling and new product ideas for shared mobility, with research that led to patents.',
    bullets: [
      'Pioneered telematics risk modeling for shared mobility, helping create a new business vertical.',
      'Won a hackathon for AWS-based NLP work and contributed to research that was later featured publicly.',
      'Helped seed two patent applications around shared-mobility simulation and driver/vehicle matching.',
    ],
    tags: ['Telematics', 'Risk modeling', 'NLP', 'AWS', 'Patents'],
  },
  {
    role: 'Adjunct Lecturer',
    company: 'Chapman University',
    period: '2023 to 2024',
    summary:
      'Developed and taught Python-based AI/ML curriculum for students who needed concrete, industry-facing context.',
    bullets: [
      'Built lessons that connected basic ML theory to production work and current AI practice.',
      'Taught Python, AI, and ML concepts to more than 30 students in a classroom setting.',
    ],
    tags: ['Teaching', 'Python', 'AI/ML', 'Curriculum'],
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

const skills = [
  {
    category: 'Programming',
    items: ['Python', 'SQL', 'JavaScript', 'Shell', 'R', 'Java', 'C#', 'HTML', 'CSS'],
  },
  {
    category: 'AI / ML',
    items: ['GenAI', 'Fine-tuning', 'PyTorch', 'TensorFlow', 'Transformers', 'NLP', 'Ensembles', 'Boosted trees'],
  },
  {
    category: 'Distributed systems',
    items: ['PySpark', 'Hadoop', 'Async APIs', 'Task queues', 'Concurrency controls'],
  },
  {
    category: 'Cloud and deployment',
    items: ['AWS', 'GCP', 'Azure', 'Docker', 'GitHub Actions', 'GitLab', 'FastAPI', 'Flask', 'Modal'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'DuckDB', 'BigQuery', 'Databricks', 'Snowflake', 'Athena'],
  },
];

const publications = [
  { year: '2025', title: 'Building Stateful AI Agents', venue: 'ODSC West (Talk)' },
  { year: '2025', title: 'Managing Memory for AI Agents', venue: "O'Reilly Media (Book)" },
  { year: '2025', title: 'Extending "GPTs Are GPTs" to Firms', venue: 'AEA Papers and Proceedings' },
  { year: '2024', title: 'Building With AI: How I Build Quick POCs with LLMs', venue: 'Wharton Guest Lecture' },
  { year: '2024', title: 'A Normie Approach to Validating LLM Outputs', venue: 'AI.Science Talk' },
  { year: '2023', title: 'What Are AI Agents?', venue: "O'Reilly Media (Book)" },
  { year: '2023', title: 'Building an HTTPS Model API for Cheap: AWS, Docker, and the Normconf API', venue: 'Talk' },
];

const patents = [
  'Shared Mobility Simulation and Prediction System, USPTO 20190347941',
  'Matching Drivers With Shared Vehicles To Optimize Shared Vehicle Services, USPTO 20190347582',
];

const highlights = [
  { label: 'Impact', value: '$8M+ savings in logistics and operations work' },
  { label: 'Research', value: "AEA Papers and Proceedings + O'Reilly books" },
  { label: 'Product', value: 'Enterprise GenAI platforms and internal tooling' },
  { label: 'Teaching', value: 'AI/ML curriculum for 30+ Chapman students' },
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
            <a
              href="mailto:benjaminlabaschin@gmail.com"
              className="inline-flex items-center justify-center rounded-lg border border-outline-variant/25 bg-surface-container-low px-6 py-3.5 font-label text-xs font-bold uppercase tracking-widest text-on-surface"
            >
              Email
            </a>
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((highlight) => (
            <div key={highlight.label} className="rounded-2xl bg-surface-container-low p-6">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">{highlight.label}</p>
              <p className="mt-3 font-headline text-xl font-bold leading-tight text-on-surface">{highlight.value}</p>
            </div>
          ))}
        </div>
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
              <p className="mt-5 max-w-4xl font-body text-base leading-relaxed text-secondary md:text-lg">{item.summary}</p>
              <ul className="mt-5 space-y-3">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 font-body text-base leading-relaxed text-on-surface md:text-lg">
                    <span className="mt-2 h-2 w-2 flex-none rounded-full bg-primary" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-8 pb-16 lg:grid-cols-12">
        <article className="rounded-2xl bg-surface-container-low p-6 md:p-8 lg:col-span-7">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Skills</p>
          <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-on-surface">The stack I keep returning to.</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {skills.map((group) => (
              <div key={group.category} className="rounded-xl bg-surface-container-highest p-5">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{group.category}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl bg-surface-container-low p-6 md:p-8">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Why this page exists</p>
            <p className="mt-4 font-body text-lg leading-relaxed text-secondary">
              The goal here is utility: quick contact paths, a readable CV, and enough context to understand what I work on.
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-low p-6 md:p-8">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Education</p>
            <p className="mt-4 font-headline text-2xl font-bold tracking-tight text-on-surface">B.A. Economics, cum laude</p>
            <p className="mt-2 font-body text-lg text-secondary">Lake Forest College · Lake Forest, Illinois · 2016</p>
          </div>
          <div className="rounded-2xl bg-surface-container-low p-6 md:p-8">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Patents</p>
            <ul className="mt-4 space-y-3">
              {patents.map((patent) => (
                <li key={patent} className="font-body text-base leading-relaxed text-secondary">
                  {patent}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-12">
          <article className="rounded-2xl bg-surface-container-low p-6 md:p-8 lg:col-span-8">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Publications & talks</p>
            <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-on-surface">The public work.</h2>
            <div className="mt-7 space-y-4">
              {publications.map((publication) => (
                <div
                  key={`${publication.year}-${publication.title}`}
                  className="flex flex-col gap-3 rounded-xl bg-surface-container-highest p-5 md:flex-row md:items-baseline md:justify-between"
                >
                  <div>
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-primary">{publication.year}</p>
                    <h3 className="mt-2 font-headline text-lg font-bold leading-snug text-on-surface md:text-xl">
                      {publication.title}
                    </h3>
                  </div>
                  <p className="max-w-md font-body text-sm leading-relaxed text-secondary md:text-right md:text-base">{publication.venue}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="rounded-2xl bg-surface-container-low p-6 md:p-8 lg:col-span-4">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Useful links</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/talks" className="rounded-full bg-surface-container-high px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-secondary">
                Talks
              </Link>
              <Link
                href="/publications"
                className="rounded-full bg-surface-container-high px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-secondary"
              >
                Publications
              </Link>
              <a href="/benjamin_labaschin_resume.pdf" download className="rounded-full bg-surface-container-high px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-secondary">
                Resume
              </a>
              <a href="mailto:benjaminlabaschin@gmail.com" className="rounded-full bg-surface-container-high px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-secondary">
                Email
              </a>
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
