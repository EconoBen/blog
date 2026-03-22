import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

const bookSections = [
  {
    label: 'What it covers',
    title: 'How AI systems remember, retrieve, compress, and decide what to act on.',
    summary:
      'The book is a practical guide to the mechanics behind durable agent behavior: storing useful context, retrieving it at the right time, and keeping the system understandable once it is in production.',
  },
  {
    label: 'Why it belongs here',
    title: 'It extends the same practical arc as the posts, reports, and talks.',
    summary:
      'The page stays within the same site family. It introduces the book, but it also points back to the rest of the work so the project reads as one body of writing instead of a separate brand.',
  },
  {
    label: 'What to read next',
    title: 'Use the rest of the site as context for the book.',
    summary:
      'Posts explain the day-to-day thinking, publications show the longer-form work, and talks show how the ideas are presented live.',
  },
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
            <span className="editorial-chip">Memory</span>
            <span className="editorial-chip">Retrieval</span>
            <span className="editorial-chip">Compression</span>
            <span className="editorial-chip">Action</span>
          </div>
        </div>

        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Working direction</p>
          <p className="editorial-post-summary" style={{ marginTop: '10px' }}>
            The book stays inside the same site family and points back to the rest of the work instead of standing apart as a separate product.
          </p>
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
          <p className="editorial-home-section-label">Book focus</p>
          <h2 className="editorial-page-section-title">The page should answer what the book is, why it matters, and where it connects.</h2>
        </div>

        <div className="editorial-two-column">
          {bookSections.map((item) => (
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
          <p className="editorial-home-section-label">Read next</p>
          <h2 className="editorial-page-section-title">Use the rest of the site as context for the book.</h2>
        </div>

        <div className="editorial-post-grid">
          <article className="editorial-post-card">
            <div className="editorial-post-meta">
              <span>Posts</span>
              <span>ongoing writing</span>
            </div>
            <h3>
              <Link href="/posts">Browse the posts</Link>
            </h3>
            <p className="editorial-post-summary">
              The posts show the day-to-day thinking that feeds into the book and keep the site grounded in current work.
            </p>
            <Link href="/posts" className="editorial-post-link">
              Open posts
            </Link>
          </article>

          <article className="editorial-post-card">
            <div className="editorial-post-meta">
              <span>Publications</span>
              <span>reports and longer work</span>
            </div>
            <h3>
              <Link href="/publications">Read the publications</Link>
            </h3>
            <p className="editorial-post-summary">
              Publications give the longer-form context around the same technical arc and help separate the book from prior work.
            </p>
            <Link href="/publications" className="editorial-post-link">
              Open publications
            </Link>
          </article>

          <article className="editorial-post-card">
            <div className="editorial-post-meta">
              <span>Talks</span>
              <span>live appearances</span>
            </div>
            <h3>
              <Link href="/talks">Watch the talks</Link>
            </h3>
            <p className="editorial-post-summary">
              Talks show how the ideas are explained out loud and give the book a public trail back to the site.
            </p>
            <Link href="/talks" className="editorial-post-link">
              Open talks
            </Link>
          </article>
        </div>
      </section>
    </EditorialPageFrame>
  );
}
