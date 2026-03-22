import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

export const metadata: Metadata = {
  title: 'About | Ben Labaschin',
  description: 'Practical CV and contact page for Ben Labaschin, with resume download, work history, education, and links.',
};

const experience = [
  {
    role: 'Principal Machine Learning Engineer',
    company: 'Workhelix',
    period: 'Apr. 2022 - Present',
    summary:
      'Founding engineer leading core platform development, async LLM APIs, custom embedding systems, and the internal agent deployment platform for enterprise customers.',
    highlights: ['Async LLM APIs', 'Embedding systems', 'Agent deployment platform'],
  },
  {
    role: 'Adjunct Lecturer',
    company: 'Chapman University',
    period: 'Aug. 2023 - Dec. 2024',
    summary:
      'Developed and taught a Python-based AI/ML curriculum for about 30 students, bridging academic concepts with industry use cases.',
    highlights: ['Python-based curriculum', 'AI/ML instruction', '30+ students'],
  },
  {
    role: 'Senior Data Scientist',
    company: 'Hopper',
    period: 'Aug. 2021 - Apr. 2022',
    summary:
      'Led ML engineering for the Capital One Travel partnership and helped build multi-tenant ML systems and MLOps workflows for Hopper Cloud.',
    highlights: ['Capital One Travel', 'Multi-tenant ML systems', 'MLOps'],
  },
  {
    role: 'Data Scientist',
    company: 'XPO Logistics',
    period: 'Jan. 2021 - Aug. 2021',
    summary:
      'Delivered cost optimization and automated pricing work that contributed to $8M in savings through testing and ML initiatives.',
    highlights: ['Cost optimization', 'Automated pricing', '$8M in savings'],
  },
  {
    role: 'Data Scientist',
    company: 'Revantage (Blackstone)',
    period: 'Oct. 2019 - Jan. 2021',
    summary:
      'Led A/B testing, power analysis, and regression modeling for investment decisions while building Python analytics pipelines for ROI analysis.',
    highlights: ['A/B testing', 'Regression modeling', 'Python analytics'],
  },
  {
    role: 'Economist Researcher / Data Scientist',
    company: 'Arity (Allstate)',
    period: 'Sept. 2017 - Oct. 2019',
    summary:
      'Pioneered telematics-based risk modeling for shared mobility companies and contributed to two patent applications.',
    highlights: ['Telematics risk modeling', 'Two patent applications', 'NLP hackathon win'],
  },
];

const education = [
  {
    degree: 'B.A. Economics, cum laude',
    school: 'Lake Forest College',
    period: '2016',
    location: 'Lake Forest, Illinois',
  },
];

const skillGroups = [
  {
    label: 'Programming',
    items: ['Python', 'Java', 'C#', 'R', 'SQL', 'Shell', 'JavaScript'],
  },
  {
    label: 'AI / ML',
    items: ['GenAI', 'LLMs', 'PyTorch', 'TensorFlow', 'Transformers', 'NLP', 'Fine-tuning'],
  },
  {
    label: 'Cloud and deployment',
    items: ['AWS', 'GCP', 'Azure', 'GitHub Actions', 'GitLab', 'Docker', 'FastAPI', 'Flask', 'Modal'],
  },
  {
    label: 'Data systems',
    items: ['PostgreSQL', 'MySQL', 'DuckDB', 'BigQuery', 'Databricks', 'Snowflake', 'Athena'],
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
          <div style={{ padding: '20px 24px 24px' }}>
            <p className="editorial-home-card-label">Profile</p>
            <p className="editorial-post-summary">
              Principal ML engineer at Workhelix. Earlier work spans Hopper, logistics, teaching, and applied data science.
            </p>
            <div className="editorial-home-book-meta">
              <span>Apr. 2022 to present</span>
              <span>Workhelix</span>
              <span>Principal MLE</span>
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
          </div>
        </aside>
      </section>

      <section id="work-history" className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Experience</p>
          <h2 className="editorial-page-section-title">Work history, teaching, and the jobs attached to them.</h2>
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
              <div className="editorial-chip-row">
                {item.highlights.map((highlight) => (
                  <span key={highlight} className="editorial-chip">
                    {highlight}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Education</p>
          <h2 className="editorial-page-section-title">The degree and the school, kept plain.</h2>
        </div>
        <div className="editorial-timeline">
          {education.map((item) => (
            <article key={`${item.school}-${item.degree}`} className="editorial-timeline-item">
              <div className="editorial-post-meta">
                <span>{item.school}</span>
                <span>{item.period}</span>
              </div>
              <h3>{item.degree}</h3>
              <p className="editorial-post-summary">{item.location}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Skills</p>
          <h2 className="editorial-page-section-title">The stack I use most often.</h2>
        </div>
        <div className="editorial-two-column">
          {skillGroups.map((group) => (
            <article key={group.label} className="editorial-home-card">
              <p className="editorial-home-card-label">{group.label}</p>
              <div className="editorial-chip-row">
                {group.items.map((item) => (
                  <span key={item} className="editorial-chip">
                    {item}
                  </span>
                ))}
              </div>
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
            <h3>Publications, talks, and contact.</h3>
            <p>If you want the longer version of the profile, these pages show the writing, speaking, and contact routes.</p>
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
