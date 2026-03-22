import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

export const metadata: Metadata = {
  title: 'About | Ben Labaschin',
  description: 'Practical CV and contact page for Ben Labaschin, with resume download and work history.',
};

const experience = [
  {
    role: 'Principal Machine Learning Engineer',
    company: 'Workhelix',
    period: '2022 to present',
    summary:
      'Founding engineer on enterprise GenAI and agent systems. I build async LLM infrastructure, retrieval, memory, and internal tools used in customer workflows.',
  },
  {
    role: 'Senior Data Scientist',
    company: 'Hopper',
    period: '2021 to 2022',
    summary:
      'Led machine-learning work for Hopper Cloud partnerships and helped build platform systems for travel products and partner workflows.',
  },
  {
    role: 'Earlier data science work',
    company: 'XPO Logistics, Revantage, Arity',
    period: '2017 to 2021',
    summary:
      'Worked across forecasting, experimentation, optimization, and business-facing ML systems, alongside economics and transportation writing.',
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
      <section className="editorial-page-hero editorial-about-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">About / CV</p>
          <h1 className="editorial-page-title">Ben Labaschin</h1>
          <p className="editorial-page-copy">
            I build practical AI systems and write about the trade-offs that show up once they have to work in production.
            Use the resume download for the fastest version, or jump to the work history if you want the fuller CV.
          </p>
          <div className="editorial-home-actions">
            <a href="/benjamin_labaschin_resume.pdf" download className="editorial-home-button editorial-home-button-primary">
              Download resume
            </a>
            <a href="#work-history" className="editorial-home-button editorial-home-button-secondary">
              Work history
            </a>
            <Link href="/publications" className="editorial-home-button editorial-home-button-secondary">
              Publications
            </Link>
          </div>
        </div>
        <aside className="editorial-page-aside editorial-about-photo-card">
          <img src="/assets/atlas_and_I.jpg" alt="Ben Labaschin with Atlas" />
          <div className="editorial-post-summary">
            Principal ML engineer at Workhelix. Earlier work spans Hopper, logistics, and applied data science.
          </div>
          <div className="editorial-link-row">
            {contactLinks.slice(0, 3).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="editorial-post-link"
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </aside>
      </section>

      <section id="work-history" className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Work history</p>
          <h2 className="editorial-page-section-title">Recent roles and the work attached to them.</h2>
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

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Useful links</p>
          <h2 className="editorial-page-section-title">The rest of the profile, without hunting around the site.</h2>
        </div>
        <div className="editorial-two-column">
          <article className="editorial-home-card">
            <p className="editorial-home-card-label">Resume</p>
            <h3>Keep the PDF handy.</h3>
            <p>The fastest version of the CV is still the downloadable resume, followed by the work history above.</p>
            <a href="/benjamin_labaschin_resume.pdf" download className="editorial-post-link">
              Download resume
            </a>
          </article>
          <article className="editorial-home-card">
            <p className="editorial-home-card-label">More context</p>
            <h3>Publications and talks.</h3>
            <p>If you want the longer version of the profile, those pages show the writing and speaking side of the work.</p>
            <div className="editorial-link-row">
              {contactLinks.slice(3).map((link) => (
                <Link key={link.label} href={link.href} className="editorial-post-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
    </EditorialPageFrame>
  );
}
