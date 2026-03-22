import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

const bookNotes = [
  {
    label: 'What the book covers',
    title: 'How AI systems remember, retrieve, compress, and decide what to act on.',
    summary:
      'The book is a practical guide to the mechanics behind durable agent behavior: storing useful context, retrieving it at the right time, and keeping the system understandable once it is in production.',
  },
  {
    label: 'Why it belongs here',
    title: 'It extends the same practical arc as the posts, reports, and talks.',
    summary:
      'The page should make the book easy to understand before launch without turning it into a separate identity. The subject, audience, and technical point of view stay tied to the rest of the site.',
  },
];

export default function BookPage() {
  return (
    <EditorialPageFrame currentPath="/book">
      <section className="editorial-book-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Forthcoming O&apos;Reilly book</p>
          <h1 className="editorial-page-title">Agent Memory</h1>
          <p className="editorial-page-copy">
            A practical guide to how AI systems should remember, retrieve, compress, and act on information in production.
          </p>
          <div className="editorial-chip-row">
            <span className="editorial-chip">Memory</span>
            <span className="editorial-chip">Retrieval</span>
            <span className="editorial-chip">Compression</span>
            <span className="editorial-chip">Action</span>
          </div>
          <div className="editorial-home-actions">
            <a href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates" className="editorial-home-button editorial-home-button-primary">
              Get book updates
            </a>
            <Link href="/publications" className="editorial-home-button editorial-home-button-secondary">
              See related work
            </Link>
          </div>
        </div>

        <aside className="editorial-home-book-card">
          <p className="editorial-home-card-label">Working direction</p>
          <h2>Practical memory systems for production agents.</h2>
          <p>
            One domain, one body of work, one list. The book should reinforce the site&apos;s technical arc, not split it into a second identity.
          </p>
          <div className="editorial-home-book-meta">
            <span>in progress</span>
            <span>O&apos;Reilly</span>
            <span>agent memory</span>
          </div>
        </aside>
      </section>

      <section className="editorial-home-proof-strip" aria-label="Book summary">
        <span>Memory systems</span>
        <span>/</span>
        <span>retrieval design</span>
        <span>/</span>
        <span>compression strategies</span>
        <span>/</span>
        <span>production AI</span>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Working notes</p>
          <h2 className="editorial-page-section-title">The book page should answer three things quickly: what, why, and where it connects.</h2>
        </div>
        <div className="editorial-two-column">
          {bookNotes.map((item) => (
            <article key={item.label} className="editorial-home-card">
              <p className="editorial-home-card-label">{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
