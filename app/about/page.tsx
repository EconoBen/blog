import type { Metadata } from 'next';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

export const metadata: Metadata = {
  title: 'About | Ben Labaschin',
  description: "Background, current work, and the through-line across Ben Labaschin's writing, talks, and engineering work.",
};

const experience = [
  {
    role: 'Principal Machine Learning Engineer',
    company: 'Workhelix',
    period: '2022 to present',
    summary:
      'Founding engineer on enterprise-scale GenAI and agent systems, building async LLM infrastructure, analytics platforms, and production workflows for major customers.',
  },
  {
    role: 'Senior Data Scientist',
    company: 'Hopper',
    period: '2021 to 2022',
    summary:
      'Led machine-learning work for Hopper Cloud partnerships and helped build the platform systems that supported travel intelligence products at scale.',
  },
  {
    role: 'Earlier data science work',
    company: 'XPO Logistics, Revantage, Arity',
    period: '2017 to 2021',
    summary:
      'Worked across forecasting, experimentation, optimization, and business-facing ML systems, with a parallel thread of economics and transportation writing.',
  },
];

const currentFocus = [
  {
    label: 'What I spend time on',
    title: 'Production AI, memory, retrieval, and the messy middle.',
    summary:
      'Most of my current work sits between research ideas and the engineering realities of enterprise systems: memory management, async LLM infrastructure, evaluation, developer workflows, and the trade-offs that show up once systems leave the demo stage.',
  },
  {
    label: 'What this site is for',
    title: 'A public record, not just a resume.',
    summary:
      'The site keeps the professional signal, but its job is to make the writing, talks, reports, and upcoming book read as one coherent body of work.',
  },
];

export default function AboutPage() {
  return (
    <EditorialPageFrame currentPath="/about">
      <section className="editorial-page-hero editorial-about-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">About</p>
          <h1 className="editorial-page-title">Ben Labaschin</h1>
          <p className="editorial-page-copy">
            I work where AI systems, technical writing, and research meet. This site is the public record of that work: essays, talks, reports, and the forthcoming book on agent memory.
          </p>
          <div className="editorial-chip-row">
            <span className="editorial-chip">AI systems</span>
            <span className="editorial-chip">Writing</span>
            <span className="editorial-chip">Research</span>
            <span className="editorial-chip">Speaking</span>
          </div>
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Current focus</p>
          <h2 className="editorial-page-section-title">The through-line is practical AI systems that keep working after the demo.</h2>
        </div>
        <div className="editorial-two-column">
          {currentFocus.map((item) => (
            <article key={item.label} className="editorial-home-card">
              <p className="editorial-home-card-label">{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              {item.label === 'What this site is for' && (
                <a href="/benjamin_labaschin_resume.pdf" download className="editorial-post-link">
                  Download resume
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-home-proof-strip" aria-label="About summary">
        <span>Principal ML Engineer</span>
        <span>/</span>
        <span>writer and speaker</span>
        <span>/</span>
        <span>AI systems and memory</span>
        <span>/</span>
        <span>economics background</span>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">At a glance</p>
          <h2 className="editorial-page-section-title">A small visual pause before the work history.</h2>
        </div>
        <aside className="editorial-page-aside editorial-about-photo-card">
          <img src="/assets/atlas_and_I.jpg" alt="Ben Labaschin with Atlas" />
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">systems</span>
              <span className="editorial-page-metric-label">AI platforms and memory</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">public</span>
              <span className="editorial-page-metric-label">writing, talks, and reports</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Experience</p>
          <h2 className="editorial-page-section-title">A concise view of the operating history behind the public work.</h2>
        </div>
        <div className="editorial-timeline">
          {experience.map((item) => (
            <article key={`${item.company}-${item.role}`} className="editorial-timeline-item">
              <div className="editorial-post-meta">
                <span>{item.company}</span>
                <span>{item.period}</span>
              </div>
              <h3>{item.role}</h3>
              <p className="editorial-post-summary">{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
