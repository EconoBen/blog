import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

const bookThesis = [
  {
    label: 'Working thesis',
    title: 'Memory is not a feature add-on. It is the control surface that keeps an agent useful over time.',
    summary:
      'The book treats memory as a runtime problem: what to store, when to retrieve, how to compress, and how to keep the system explainable after it starts changing state.',
  },
  {
    label: 'Grounding',
    title: 'The page stays tied to the same site family, not to a separate product story.',
    summary:
      'It points back to the posts, publications, and talks that already exist here, so the book feels like part of an ongoing practice rather than a standalone launch page.',
  },
];

const chapterInsights = [
  {
    label: 'Chapter insight 01',
    title: 'Start with simple memory primitives before layering policy on top.',
    summary:
      'The useful part is not the store itself; it is the decision tree that decides what should survive, what should be retrieved, and what should be summarized away.',
  },
  {
    label: 'Chapter insight 02',
    title: 'Retrieval is where the system stops being generic and starts having opinions.',
    summary:
      'Relevance, freshness, cost, and context length all compete here. The book should make that tradeoff visible instead of hiding it behind a single vector search story.',
  },
  {
    label: 'Chapter insight 03',
    title: 'Compression only helps if the agent can still explain what it kept and why.',
    summary:
      'Summaries, pruning, and handoff rules are useful only when they preserve enough structure for the next turn, the next tool, or the next person who has to debug the system.',
  },
];

const followUpLinks = [
  { href: '/posts', label: 'Browse posts', summary: 'See the day-to-day thinking that feeds the book.' },
  { href: '/publications', label: 'Read publications', summary: 'Follow the longer-form work around the same technical arc.' },
  { href: '/talks', label: 'Watch talks', summary: 'See how the ideas are presented publicly.' },
];

export default function BookPage() {
  return (
    <EditorialPageFrame currentPath="/book">
      <section className="editorial-page-hero editorial-book-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Forthcoming O&apos;Reilly book</p>
          <h1 className="editorial-page-title">Agent Memory</h1>
          <p className="editorial-page-copy">
            A practical guide to how AI systems should remember, retrieve, compress, and act on information in production.
          </p>
          <p className="editorial-post-summary" style={{ marginTop: '14px', maxWidth: '62ch' }}>
            The page reflects the book as a working project. It stays honest about the current status and keeps the focus on the ideas rather than on launch-day copy.
          </p>

          <div className="editorial-home-actions">
            <a
              href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates"
              className="editorial-home-button editorial-home-button-primary"
            >
              Get book updates
            </a>
            <Link href="/publications" className="editorial-home-button editorial-home-button-secondary">
              See related work
            </Link>
          </div>

          <div className="editorial-chip-row">
            <span className="editorial-chip">In progress</span>
            <span className="editorial-chip">Memory</span>
            <span className="editorial-chip">Retrieval</span>
            <span className="editorial-chip">Compression</span>
            <span className="editorial-chip">Action</span>
          </div>
        </div>

        <aside className="editorial-page-aside" style={{ display: 'grid', gap: '16px' }}>
          <p className="editorial-home-card-label">Current status</p>
          <h2 style={{ margin: 0, fontSize: '2rem', lineHeight: 1.02 }}>
            <Link href="/publications">Works best as part of the same editorial site.</Link>
          </h2>
          <p className="editorial-post-summary">
            The site keeps the book grounded in ongoing posts, talks, and publications instead of pretending it is already a finished product.
          </p>

          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">Working draft</span>
              <span className="editorial-page-metric-label">status</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">O&apos;Reilly</span>
              <span className="editorial-page-metric-label">publisher</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">Updates by email</span>
              <span className="editorial-page-metric-label">follow-up</span>
            </div>
          </div>

          <div className="editorial-link-row">
            <Link href="/posts" className="editorial-post-link">
              Browse posts
            </Link>
            <Link href="/publications" className="editorial-post-link">
              Read publications
            </Link>
            <Link href="/talks" className="editorial-post-link">
              Watch talks
            </Link>
          </div>
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Thesis</p>
          <h2 className="editorial-page-section-title">The book should explain why memory matters before it tries to prescribe a single architecture.</h2>
        </div>

        <div className="editorial-two-column" style={{ alignItems: 'stretch' }}>
          {bookThesis.map((item) => (
            <article key={item.label} className="editorial-home-card" style={{ display: 'grid', gap: '14px' }}>
              <p className="editorial-home-card-label">{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Chapter insights</p>
          <h2 className="editorial-page-section-title">Working chapter directions, not fake table-of-contents copy.</h2>
        </div>

        <div className="editorial-two-column">
          {chapterInsights.map((item) => (
            <article key={item.label} className="editorial-home-card" style={{ display: 'grid', gap: '14px' }}>
              <p className="editorial-home-card-label">{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-home-cta-band">
        <div>
          <p className="editorial-home-card-label">Follow along</p>
          <h3>Get updates when the book changes, then keep reading the rest of the site for the current work.</h3>
          <p>
            The book page stays small on purpose. It gives you a clear path to updates, while the posts, publications, and talks carry the live context.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          <a
            href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates"
            className="editorial-home-button editorial-home-button-primary"
          >
            Get book updates
          </a>
          <Link href="/publications" className="editorial-home-button editorial-home-button-secondary">
            See publications
          </Link>
          <div className="editorial-chip-row" style={{ marginTop: 0 }}>
            <span className="editorial-chip">No release-date promise</span>
            <span className="editorial-chip">Grounded in current work</span>
          </div>
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Read next</p>
          <h2 className="editorial-page-section-title">Use the rest of the site as context for the book.</h2>
        </div>

        <div className="editorial-post-grid">
          {followUpLinks.map((item) => (
            <article key={item.href} className="editorial-post-card">
              <div className="editorial-post-meta">
                <span>{item.label}</span>
                <span>current work</span>
              </div>
              <h3>
                <Link href={item.href}>{item.label}</Link>
              </h3>
              <p className="editorial-post-summary">{item.summary}</p>
              <Link href={item.href} className="editorial-post-link">
                Open {item.label.toLowerCase()}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
