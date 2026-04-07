import type { Metadata } from 'next';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

export const metadata: Metadata = {
  title: 'About | Ben Labaschin',
  description: 'Background, current work, and the through-line across Ben Labaschin’s writing, talks, and engineering work.',
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

const proofPoints = [
  'O’Reilly reports on AI agents and memory systems',
  'AEA Papers and Proceedings publication on firm-level exposure to GPTs',
  'Conference and community talks on memory, validation, and production AI systems',
  'Hands-on platform work spanning LLM APIs, analytics infrastructure, and deployment',
];

export default function AboutPage() {
  return (
    <EditorialPageFrame currentPath="/about">
      <section className="editorial-page-hero editorial-about-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">About</p>
          <h1 className="editorial-page-title">Ben Labaschin</h1>
          <p className="editorial-page-copy">
            I work at the intersection of AI systems, technical writing, and research. This site is where those threads meet: essays, talks, reports, and the forthcoming book on agent memory.
          </p>
          <div className="editorial-chip-row">
            <span className="editorial-chip">AI systems</span>
            <span className="editorial-chip">Writing</span>
            <span className="editorial-chip">Research</span>
            <span className="editorial-chip">Speaking</span>
          </div>
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

      <section className="editorial-home-proof-strip" aria-label="About summary">
        <span>Principal ML Engineer</span>
        <span>/</span>
        <span>writer and speaker</span>
        <span>/</span>
        <span>AI systems + memory</span>
        <span>/</span>
        <span>economics background</span>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Current focus</p>
          <h2 className="editorial-page-section-title">The through-line is practical AI systems that actually work.</h2>
        </div>
        <div className="editorial-two-column">
          <article className="editorial-home-card">
            <p className="editorial-home-card-label">What I spend time on</p>
            <h3>Production AI, memory, retrieval, and the messy middle.</h3>
            <p>
              Most of my work sits between research ideas and the engineering realities of enterprise systems: memory management, async LLM infrastructure, evaluation, developer workflows, and the trade-offs that appear once systems leave the demo stage.
            </p>
          </article>
          <article className="editorial-home-card">
            <p className="editorial-home-card-label">What this site is for</p>
            <h3>A public platform, not just a resume.</h3>
            <p>
              I still keep the professional signal here, but the point of the site is to make the writing, talks, reports, and upcoming book feel like one coherent body of work.
            </p>
            <a href="/benjamin_labaschin_resume.pdf" download className="editorial-post-link">
              Download resume
            </a>
          </article>
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Proof</p>
          <h2 className="editorial-page-section-title">The strongest signals to put in front of a new visitor.</h2>
        </div>
        <div className="editorial-proof-list">
          {proofPoints.map((item) => (
            <div key={item} className="editorial-proof-item">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Experience</p>
          <h2 className="editorial-page-section-title">A shorter version of the operating history.</h2>
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
