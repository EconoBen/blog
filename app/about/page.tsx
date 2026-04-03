import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { publicationsConfig } from '../config/publicationsConfig';
import { talksConfig } from '../config/talksConfig';

export const metadata: Metadata = {
  title: 'About | ECONOBEN.DEV',
  description: "Ben Labaschin's CV, contact details, publications, and work history on ECONOBEN.DEV.",
};

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  summary: string;
  bullets: string[];
  tags: string[];
};

const experience: ExperienceItem[] = [
  {
    role: 'Principal Machine Learning Engineer',
    company: 'Workhelix',
    period: '2022 to present',
    summary:
      'Founding engineer on enterprise GenAI and agent systems. I build async LLM infrastructure, retrieval, memory, and internal tools used in customer workflows.',
    bullets: [
      'Built core platform work for scalable async LLM APIs and custom embedding systems used by Fortune 50 customers.',
      'Shipped agent memory, retrieval, and workflow tooling for production use, with a focus on reliability and maintainability.',
      'Developed analysis and evaluation systems that helped quantify how GenAI changes engineering workflows and organizational productivity.',
      'Engineered high-throughput GitHub and GitLab extraction flows with asyncio rate limiting and GraphQL cursor pagination, reducing repository processing time from 30 minutes to 2 minutes.',
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
      'Worked across product, engineering, and data teams to keep the partnership architecture understandable enough for repeated release cycles.',
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
      'Helped translate ML results into changes that operations teams could actually use without a separate data-science handoff.',
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
      'Worked on tools that made large, slow-moving real-estate decisions easier to defend with numbers.',
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
      'Kept the curriculum practical and project-oriented instead of drifting into abstract lecture-only material.',
    ],
    tags: ['Teaching', 'Python', 'AI/ML', 'Curriculum'],
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

const patents = [
  'Shared Mobility Simulation and Prediction System, USPTO 20190347941',
  'Matching Drivers With Shared Vehicles To Optimize Shared Vehicle Services, USPTO 20190347582',
];

const selectedWriting = [
  ...publicationsConfig.publications.map((publication) => ({
    date: publication.date,
    title: publication.title,
    venue: publication.venue ?? publication.type,
    year: String(publication.year),
  })),
  ...talksConfig.talks.map((talk) => ({
    date: talk.date,
    title: talk.title,
    venue: talk.event,
    year: String(new Date(talk.date).getFullYear()),
  })),
]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 8);

export default function AboutPage() {
  return (
    <EditorialPageFrame currentPath="/about">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1440px] px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
          {/* Left column */}
          <div className="space-y-5">
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">About / CV</span>
            <h1 className="max-w-4xl font-headline text-5xl font-black tracking-tighter text-on-surface md:text-7xl">
              Ben Labaschin
            </h1>
            <p className="max-w-2xl font-body text-lg leading-relaxed text-on-surface md:text-xl">
              Principal machine learning engineer building production AI systems, writing about how they work in the real
              world, and keeping the CV readable enough that people can get to the useful part quickly.
            </p>
            <p className="max-w-2xl font-body text-base leading-relaxed text-on-surface md:text-lg">
              The through-line is practical: enterprise GenAI platforms, retrieval and memory systems, evaluation, APIs,
              and the surrounding deployment work that turns experiments into systems teams can actually use.
            </p>

            <ul className="space-y-2 pt-2">
              {[
                'Enterprise GenAI systems that stay usable after the prototype phase.',
                'Retrieval, memory, evaluation, and orchestration for agentic workflows.',
                'Production ML plumbing that makes analysis, search, and deployment repeatable.',
                'Writing about the practical constraints that appear once these systems ship.',
              ].map((item) => (
                <li key={item} className="flex gap-3 font-body text-base leading-relaxed text-on-surface">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 pt-3">
              <a
                href="/benjamin_labaschin_resume.pdf"
                download
                className="rounded-lg bg-on-surface px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-surface transition-transform hover:-translate-y-1"
              >
                Download resume
              </a>
              <a
                href="#career"
                className="rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
              >
                Work history
              </a>
              <Link
                href="/publications"
                className="rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
              >
                Publications
              </Link>
              <a
                href="mailto:benjaminlabaschin@gmail.com"
                className="rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
              >
                Email
              </a>
            </div>
          </div>

          {/* Photo sidebar */}
          <aside className="overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-highest shadow-[0_18px_50px_rgba(29,28,22,0.04)] lg:self-start">
            <img src="/assets/atlas_and_I.jpg" alt="Ben Labaschin with Atlas" className="aspect-[4/5] w-full object-cover" />
            <div className="p-5">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Current role</p>
              <p className="mt-2 font-headline text-lg font-bold text-on-surface">Principal ML Engineer at Workhelix</p>
              <p className="mt-1 font-body text-sm text-on-surface">AI systems, memory, retrieval, evaluation</p>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Career ── */}
      <section className="border-t border-outline-variant/20" id="career">
        <div className="mx-auto max-w-[1440px] px-8 py-12 md:py-16">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Work history</p>
          <h2 className="mt-3 max-w-2xl font-headline text-3xl font-bold tracking-tight text-on-surface">
            Recent roles and the work attached to them.
          </h2>

          <div className="mt-8 rounded-2xl border border-outline-variant/15 bg-surface-container-highest shadow-[0_18px_50px_rgba(29,28,22,0.04)]">
            {experience.map((item, idx) => (
              <article
                key={`${item.company}-${item.role}`}
                className={`p-6 md:p-8${idx < experience.length - 1 ? ' border-b border-outline-variant/20' : ''}`}
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                  <div>
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{item.company}</p>
                    <h3 className="mt-1 font-headline text-xl font-bold tracking-tight text-on-surface md:text-2xl">{item.role}</h3>
                  </div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface">{item.period}</span>
                </div>
                <p className="mt-3 max-w-4xl font-body text-base leading-relaxed text-on-surface">{item.summary}</p>
                <ul className="mt-3 space-y-2">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 font-body text-sm leading-relaxed text-on-surface md:text-base">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-primary" aria-hidden="true" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills, Education & Patents ── */}
      <section className="border-t border-outline-variant/20">
        <div className="mx-auto max-w-[1440px] px-8 py-12 md:py-16">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Skills, education & patents</p>
          <h2 className="mt-3 font-headline text-3xl font-bold tracking-tight text-on-surface">The stack and the credentials.</h2>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Skills grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((group) => (
                <div key={group.category} className="rounded-2xl border border-outline-variant/15 bg-surface-container-highest p-5 shadow-[0_18px_50px_rgba(29,28,22,0.04)]">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{group.category}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Education + Patents column */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-highest p-6 shadow-[0_18px_50px_rgba(29,28,22,0.04)]">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Education</p>
                <p className="mt-3 font-headline text-xl font-bold tracking-tight text-on-surface">B.A. Economics, cum laude</p>
                <p className="mt-1 font-body text-base text-on-surface">Lake Forest College &middot; Lake Forest, Illinois &middot; 2016</p>
              </div>

              <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-highest p-6 shadow-[0_18px_50px_rgba(29,28,22,0.04)]">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Patents</p>
                <ul className="mt-3 space-y-2">
                  {patents.map((patent) => (
                    <li key={patent} className="font-body text-sm leading-relaxed text-on-surface">
                      {patent}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Publications & Talks ── */}
      <section className="border-t border-outline-variant/20">
        <div className="mx-auto max-w-[1440px] px-8 py-12 md:py-16">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Publications & talks</p>
          <h2 className="mt-3 font-headline text-3xl font-bold tracking-tight text-on-surface">The public work.</h2>
          <p className="mt-4 max-w-3xl font-body text-lg leading-relaxed text-on-surface">
            Books, reports, papers, and recorded talks. The clearest route to the ideas behind the engineering work.
          </p>

          <div className="mt-8 space-y-3">
            {selectedWriting.map((pub) => (
              <div
                key={`${pub.year}-${pub.title}`}
                className="flex flex-col gap-2 rounded-2xl border border-outline-variant/15 bg-surface-container-highest px-6 py-4 shadow-[0_18px_50px_rgba(29,28,22,0.04)] md:flex-row md:items-baseline md:justify-between"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{pub.year}</span>
                  <h3 className="font-headline text-base font-bold leading-snug text-on-surface md:text-lg">{pub.title}</h3>
                </div>
                <p className="shrink-0 font-body text-sm text-on-surface md:text-right">{pub.venue}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/publications"
              className="rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
            >
              All publications
            </Link>
            <Link
              href="/talks"
              className="rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
            >
              All talks
            </Link>
            <a
              href="/benjamin_labaschin_resume.pdf"
              download
              className="rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
            >
              Resume
            </a>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="border-t border-outline-variant/20">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-4 px-8 py-10">
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Get in touch</span>
          <a
            href="mailto:benjaminlabaschin@gmail.com"
            className="rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
          >
            Email
          </a>
          <a
            href="https://github.com/econoben"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/benjamin-labaschin"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </EditorialPageFrame>
  );
}
