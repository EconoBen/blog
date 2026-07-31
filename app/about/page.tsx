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
  bullets: string[];
  tags: string[];
};

const experience: ExperienceItem[] = [
  {
    role: 'Staff AI/ML Engineer',
    company: 'Workhelix',
    period: 'Apr 2022 \u2014 Present',
    bullets: [
      'Founding Engineer: Leads core platform development at Workhelix, parallelizing highly scalable async LLM APIs and custom SOTA embedding systems, building and maintaining our internal LLM and agent deployment platform for Fortune 50 enterprise customers.',
      'ML/GenAI Analytics Platform: Architects multi-container Docker system for real-time data embedding and workflow analysis, combining proprietary "task" classification algorithms with predictive models (PyTorch, FastAPI, AWS ECR/ECS).',
      'Analytics & Insights: Develops novel complexity metrics to quantify and forecast GenAI\u2019s impact on engineering workflows, enabling data-driven insights on productivity for enterprise customers.',
      'API Architecture & Data Pipeline Engineering: Engineers high-throughput GitHub/GitLab extraction system with async rate limiting and GraphQL cursor pagination, building robust task queues/concurrency controls that reduced repository processing time from 30 to 2 minutes.',
      'Seed to Series A Growth: Drives critical technical development that enabled Workhelix\u2019s growth from seed to Series A ($75M valuation), attracting investment from AI leaders including Andrew Ng, Mira Murati, and Yann LeCun.',
    ],
    tags: ['PyTorch', 'FastAPI', 'AWS', 'Docker', 'GraphQL', 'LLM', 'Causal Inference'],
  },
  {
    role: 'Senior Data Scientist',
    company: 'Hopper',
    period: 'Aug 2021 \u2014 Apr 2022',
    bullets: [
      'Strategic Partnership Leadership: Led ML engineering for Capital One Travel partnership, creating foundational ML systems that helped secure a $96M investment and drove Hopper Cloud to 40% of company revenue.',
      'Technical Architecture: Designed and implemented multi-tenant ML systems including multi-arm bandits and price freeze algorithms using GCP, enabling secure and scalable travel booking solutions for enterprise partners.',
      'MLOps Innovation: Spearheaded DevOps/MLOps implementation for Hopper Cloud, establishing CI/CD pipelines and orchestration workflows with GitHub Actions and Kubeflow to support rapid scaling of the B2B platform.',
    ],
    tags: ['GCP', 'MLOps', 'Kubeflow', 'Multi-arm Bandits'],
  },
  {
    role: 'Data Scientist',
    company: 'XPO Logistics',
    period: 'Jan 2021 \u2014 Aug 2021',
    bullets: [
      'Cost Optimization & ML Systems: Delivered $8M in savings through optimized shipment prioritization and automated pricing systems, a result from spearheading A/B testing and ML initiatives using XGBoost.',
    ],
    tags: ['XGBoost', 'A/B Testing', 'Python'],
  },
  {
    role: 'Data Scientist',
    company: 'Revantage (Blackstone)',
    period: 'Oct 2019 \u2014 Jan 2021',
    bullets: [
      'Investment Analytics: Led A/B testing with power analysis and regression modeling to optimize real estate investment decisions, driving multi-million dollar property savings.',
      'Analytics Engineering: Developed Python analytics pipeline (scipy, scikit-learn) for apartment renovation ROI analysis and geodata-based warehouse investment models.',
    ],
    tags: ['SciPy', 'scikit-learn', 'Regression', 'Geodata'],
  },
  {
    role: 'Economist Researcher / Data Scientist',
    company: 'Arity (Allstate)',
    period: 'Sep 2017 \u2014 Oct 2019',
    bullets: [
      'Risk Innovation: Pioneered telematics-based risk modeling for shared mobility companies, resulting in two patent applications and creating a new business vertical.',
      'Innovation Recognition: Won 2019 Hackathon for AWS-based NLP modeling, with research featured in Business Insider.',
    ],
    tags: ['Telematics', 'Risk Models', 'NLP', 'AWS'],
  },
  {
    role: 'Adjunct Lecturer',
    company: 'Chapman University',
    period: 'Aug 2023 \u2014 Dec 2024',
    bullets: [
      'Developed and taught Python-based AI/ML curriculum to 30+ students, bridging academic concepts with industry applications, lessons and course materials.',
    ],
    tags: ['Python', 'AI/ML', 'Education'],
  },
];

const selectedWriting = [
  ...publicationsConfig.publications
    .filter((pub) => !pub.id.startsWith('economics-shared-mobility') && pub.id !== 'future-report')
    .map((publication) => ({
      date: publication.date,
      title: publication.title,
      venue: publication.venue ?? publication.type,
      year: String(publication.year),
      href: '/publications',
    })),
  ...talksConfig.talks
    .filter((talk) => talk.id !== 'stream-java-linked-list-practice' && talk.id !== 'stream-java-linked-lists-and-cycle-detection' && talk.id !== 'stream-java-array-merge-and-two-sum' && talk.id !== 'stream-java-dsa-from-scratch')
    .map((talk) => ({
      date: talk.date,
      title: talk.title,
      venue: talk.event === 'Twitch Stream' ? 'YouTube Workshop' : talk.event,
      year: String(new Date(talk.date).getFullYear()),
      href: `/talks#${talk.id}`,
    })),
]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const skillCategories = [
  { label: 'Programming', items: 'Python, Java, C#, R, SQL, Shell, JavaScript, CSS, HTML' },
  { label: 'AI / ML', items: 'GenAI (Llama, Mistral, OpenAI, Claude), Fine-Tuning, PyTorch, TensorFlow, Deep Learning, Transformers, NLP, Machine Learning, Ensemble Methods, Boosted Trees' },
  { label: 'Distributed Systems', items: 'PySpark, Hadoop' },
  { label: 'Cloud', items: 'AWS, GCP, Azure' },
  { label: 'Deployment', items: 'GitHub Actions, GitLab, Docker, FastAPI, Flask, Modal' },
  { label: 'Databases', items: 'PostgreSQL, MySQL, DuckDB, BigQuery, Databricks, Snowflake, Athena' },
];

export default function AboutPage() {
  return (
    <EditorialPageFrame currentPath="/about">

      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-8 pb-16 pt-10 md:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px] lg:items-start">
          <div>
            <h1 className="font-headline text-[clamp(4rem,10vw,6rem)] font-black leading-[0.95] tracking-[-0.04em] text-[#1d1c16]" style={{ marginLeft: '-0.04em' }}>
              Ben<br />Labaschin
            </h1>
            <p className="font-label text-sm font-bold uppercase tracking-[0.15em] text-[#0035a0]" style={{ marginTop: '1rem' }}>
              Staff AI/ML Engineer &middot; Writer &middot; Speaker
            </p>
            <div className="mt-5 h-px w-[200px] bg-[#1d1c16]/12" />
            <p className="mt-5 max-w-[580px] font-body text-lg leading-relaxed text-[#555f70]">
              I&rsquo;m an MLE passionate about using machine learning and generative AI to transform technical challenges into high-impact solutions. I thrive on building software systems that deliver tangible results, pioneering enterprise-scale GenAI platforms, and developing ML systems that drive millions in business value.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#d2c8aa]/50 bg-[#fdf8ec]">
            <img
              src="/assets/atlas_and_I.jpg"
              alt="Ben Labaschin with Atlas"
              className="h-[280px] md:h-[400px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-8 pb-16">
        <div className="h-px w-full bg-[#1d1c16]/8" />
        <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Highlights</h2>
        <div className="mt-4 grid grid-cols-1 gap-x-16 md:grid-cols-2">
          <div>
            <div className="border-b border-[#1d1c16]/8 py-3 md:py-4">
              <p className="font-headline text-xl font-bold text-[#1d1c16]">Workhelix</p>
              <p className="mt-1 font-body text-sm leading-relaxed text-[#555f70]">
                Founding ML Engineer. Enterprise GenAI platforms from seed to <span className="font-headline font-black text-[#0035a0]">$75M</span> Series A, backed by Andrew Ng, Mira Murati, and Yann LeCun.
              </p>
            </div>
            <div className="border-b border-[#1d1c16]/8 py-3 md:py-4">
              <p className="font-headline text-xl font-bold text-[#1d1c16]">O&rsquo;Reilly Media</p>
              <p className="mt-1 font-body text-sm leading-relaxed text-[#555f70]">
                <span className="font-headline font-black text-[#0035a0]">2</span> published reports on AI agents. <span className="font-headline font-black text-[#0035a0]">1</span>{' '}book in Early Release: Agent Memory &mdash; Building Stateful AI Agents That Remember, Adapt, and Work Across Time.
              </p>
            </div>
            <div className="border-b border-[#1d1c16]/8 py-3 md:py-4 md:border-b-0">
              <p className="font-headline text-xl font-bold text-[#1d1c16]">AEA Papers &amp; Proceedings</p>
              <p className="mt-1 font-body text-sm leading-relaxed text-[#555f70]">
                <span className="font-headline font-black text-[#0035a0]">1</span>{' '}peer-reviewed publication extending &ldquo;GPTs Are GPTs&rdquo; to measure firm-level LLM exposure.
              </p>
            </div>
          </div>
          <div>
            <div className="border-b border-[#1d1c16]/8 py-3 md:py-4">
              <p className="font-headline text-xl font-bold text-[#1d1c16]">Talks &amp; Guest Lectures</p>
              <p className="mt-1 font-body text-sm leading-relaxed text-[#555f70]">
                <span className="font-headline font-black text-[#0035a0]">7</span> appearances across <span className="font-headline font-black text-[#0035a0]">6</span> venues: ODSC West, Wharton, AI.Science, Normconf, MLOps Community, and Into the Hopper podcast.
              </p>
            </div>
            <div className="border-b border-[#1d1c16]/8 py-3 md:py-4">
              <p className="font-headline text-xl font-bold text-[#1d1c16]">USPTO Patents</p>
              <p className="mt-1 font-body text-sm leading-relaxed text-[#555f70]">
                <span className="font-headline font-black text-[#0035a0]">2</span> patent applications: Shared Mobility Simulation and Prediction System, and Matching Drivers With Shared Vehicles.
              </p>
            </div>
            <div className="py-3 md:py-4">
              <p className="font-headline text-xl font-bold text-[#1d1c16]">Industry Experience</p>
              <p className="mt-1 font-body text-sm leading-relaxed text-[#555f70]">
                <span className="font-headline font-black text-[#0035a0]">9</span> years building production ML systems across <span className="font-headline font-black text-[#0035a0]">5</span> companies, from telematics risk modeling to enterprise LLM platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Current Focus ── */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-8 pb-14">
        <div className="h-px w-full bg-[#1d1c16]/8" />
        <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Current Focus</h2>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              label: 'Building',
              title: 'Enterprise GenAI',
              body: 'Founding engineer at Workhelix, building the Nucleus platform that helps enterprises measure and grow AI ROI. Async LLM APIs, embedding pipelines, and agent deployment for Fortune 50 customers like Autodesk and Nasdaq.',
              stat: 'Founding Engineer',
            },
            {
              label: 'Writing',
              title: 'An O\u2019Reilly Book on Agent Memory',
              body: 'Writing Agent Memory: Building Stateful AI Agents That Remember, Adapt, and Work Across Time for O\u2019Reilly. Chapters 1 and 2 are live now, and Chapter 3 is submitted.',
              stat: 'Early Release',
            },
            {
              label: 'Speaking',
              title: 'What\u2019s Next on Stage',
              body: 'Turning the Agent Memory book into live talks: how to build AI agents that persist state, manage context, and work across sessions. Speaking throughout 2026 at conferences and meetups. Interested in having me speak? Let\u2019s talk.',
              stat: '2026 engagements open',
            },
          ].map((item) => (
            <div key={item.label} className="sticky-note flex flex-col p-5 md:p-7">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#0035a0]">{item.label}</p>
              <h3 className="mt-3 font-headline text-2xl font-bold text-[#1d1c16]">{item.title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-[#555f70]">{item.body}</p>
              <p className="mt-auto pt-5 font-label text-[11px] font-bold uppercase tracking-[0.1em] text-[#0035a0]">{item.stat}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/talks"
            className="rounded-lg bg-[#0035a0] px-6 py-3 font-label text-[12px] font-bold uppercase tracking-[0.15em] text-white transition-transform hover:-translate-y-0.5"
            style={{ color: '#fff', WebkitTextFillColor: '#fff' }}
          >
            See talks
          </Link>
          <Link
            href="/publications"
            className="sticky-note rounded-lg px-6 py-3 font-label text-[12px] font-bold uppercase tracking-[0.15em] text-[#1d1c16] transition-transform hover:-translate-y-0.5"
          >
            Publications
          </Link>
          <a
            href="/benjamin_labaschin_resume.pdf"
            download
            className="sticky-note rounded-lg px-6 py-3 font-label text-[12px] font-bold uppercase tracking-[0.15em] text-[#1d1c16] transition-transform hover:-translate-y-0.5"
          >
            Download resume
          </a>
        </div>
      </section>

      {/* ── Career ── */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-8 pb-14">
        <div className="h-px w-full bg-[#1d1c16]/8" />
        <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Experience</h2>
        <div className="mt-4">
          {experience.map((item) => (
            <div key={`${item.company}-${item.role}`} className="border-b border-[#1d1c16]/6 py-6">
              <div className="flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-4">
                <h3 className="font-headline text-base md:text-lg font-bold text-[#1d1c16]">
                  {item.role}, {item.company}
                </h3>
                <span className="shrink-0 font-label text-[11px] md:text-[12px] font-medium text-[#555f70]">{item.period}</span>
              </div>
              {item.bullets.length > 0 && (
                <ul className="mt-3 space-y-2 pl-5" style={{ listStyleType: 'disc' }}>
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="font-body text-xs md:text-sm leading-relaxed text-[#555f70] marker:text-[#0035a0]">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-sm bg-[#0035a0]/8 px-2 py-0.5 font-label text-[10px] font-bold uppercase tracking-wider text-[#0035a0]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Publications & Talks ── */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-8 pb-14">
        <div className="h-px w-full bg-[#1d1c16]/8" />
        <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Publications &amp; Talks</h2>
        <div className="mt-4 space-y-0">
          {selectedWriting.map((pub) => (
            <Link key={`${pub.year}-${pub.title}`} href={pub.href} className="block border-b border-[#1d1c16]/6 py-4 transition-all hover:bg-[#fdf8ec] hover:pl-2 md:flex md:flex-row md:items-baseline md:justify-between">
              <div className="flex items-baseline gap-4">
                <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#0035a0]">{pub.year}</span>
                <h3 className="font-headline text-base font-bold text-[#1d1c16] transition-colors hover:text-[#0035a0] md:text-lg">{pub.title}</h3>
              </div>
              <p className="shrink-0 font-body text-sm text-[#555f70] md:text-right">{pub.venue}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/publications" className="sticky-note rounded-lg px-5 py-2.5 font-label text-[11px] font-bold uppercase tracking-[0.15em] text-[#1d1c16] transition-transform hover:-translate-y-0.5">
            All publications
          </Link>
          <Link href="/talks" className="sticky-note rounded-lg px-5 py-2.5 font-label text-[11px] font-bold uppercase tracking-[0.15em] text-[#1d1c16] transition-transform hover:-translate-y-0.5">
            All talks
          </Link>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-8 pb-14">
        <div className="h-px w-full bg-[#1d1c16]/8" />
        <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Technical Skills</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat) => (
            <div key={cat.label} className="sticky-note p-5">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-[#0035a0]">{cat.label}</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-[#555f70]">{cat.items}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Education ── */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-8 pb-14">
        <div className="h-px w-full bg-[#1d1c16]/8" />
        <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Education</h2>
        <div className="mt-4">
          <h3 className="font-headline text-lg font-bold text-[#1d1c16]">B.A. Economics, cum laude</h3>
          <p className="mt-1 font-body text-sm text-[#555f70]">Lake Forest College, Lake Forest, Illinois &mdash; 2016</p>
        </div>
      </section>

      {/* ── Patents ── */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-8 pb-14">
        <div className="h-px w-full bg-[#1d1c16]/8" />
        <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Patents</h2>
        <div className="mt-4 space-y-4">
          <div>
            <a href="https://patents.google.com/patent/US20190347941A1" target="_blank" rel="noreferrer noopener" className="font-headline text-base font-bold text-[#1d1c16] underline decoration-[#0035a0]/30 underline-offset-2 transition-colors hover:text-[#0035a0]">Shared Mobility Simulation and Prediction System</a>
            <p className="mt-1 font-body text-sm text-[#555f70]">USPTO 20190347941</p>
          </div>
          <div>
            <a href="https://patents.google.com/patent/US20190347582A1" target="_blank" rel="noreferrer noopener" className="font-headline text-base font-bold text-[#1d1c16] underline decoration-[#0035a0]/30 underline-offset-2 transition-colors hover:text-[#0035a0]">Matching Drivers With Shared Vehicles To Optimize Shared Vehicle Services</a>
            <p className="mt-1 font-body text-sm text-[#555f70]">USPTO 20190347582</p>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="mx-auto max-w-[1440px] px-5 md:px-8 pb-16">
        <div className="h-px w-full bg-[#1d1c16]/8" />
        <h2 className="font-headline text-2xl font-black" style={{ color: '#0035a0', marginTop: '1.5rem' }}>Contact</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a href="mailto:benjaminlabaschin@gmail.com" className="sticky-note rounded-lg px-4 py-2 font-label text-[11px] font-bold uppercase tracking-[0.15em] text-[#1d1c16] transition-transform hover:-translate-y-0.5">Email</a>
          <a href="https://github.com/econoben" target="_blank" rel="noreferrer noopener" className="sticky-note rounded-lg px-4 py-2 font-label text-[11px] font-bold uppercase tracking-[0.15em] text-[#1d1c16] transition-transform hover:-translate-y-0.5">GitHub</a>
          <a href="https://linkedin.com/in/benjamin-labaschin" target="_blank" rel="noreferrer noopener" className="sticky-note rounded-lg px-4 py-2 font-label text-[11px] font-bold uppercase tracking-[0.15em] text-[#1d1c16] transition-transform hover:-translate-y-0.5">LinkedIn</a>
        </div>
      </section>

    </EditorialPageFrame>
  );
}
