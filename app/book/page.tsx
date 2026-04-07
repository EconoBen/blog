import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';

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
              Get updates
            </a>
            <Link href="/publications" className="editorial-home-button editorial-home-button-secondary">
              See related work
            </Link>
          </div>
        </div>

        <aside className="editorial-home-book-card">
          <p className="editorial-home-card-label">Working direction</p>
          <h2>Why it belongs here</h2>
          <p>
            One domain, one body of work, one list. The book should strengthen the platform, not split it into a second identity.
          </p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">one</span>
              <span className="editorial-page-metric-label">coherent public arc</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">O&apos;Reilly</span>
              <span className="editorial-page-metric-label">publisher and home base</span>
            </div>
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

      <section className="editorial-home-grid">
        <article className="editorial-home-card">
          <p className="editorial-home-card-label">What belongs here</p>
          <h3>Context, audience, and updates.</h3>
          <p>
            Explain why the book matters, who it is for, and why readers should follow the project now instead of waiting for launch week.
          </p>
        </article>
        <article className="editorial-home-card">
          <p className="editorial-home-card-label">How it connects</p>
          <h3>The reports, talks, and book should read as one arc.</h3>
          <p>
            This page should point back to the O&apos;Reilly reports, talks, and essays so the book feels like the next step in the same public body of work.
          </p>
        </article>
      </section>
    </EditorialPageFrame>
  );
}
