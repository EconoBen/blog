import { Metadata } from 'next';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { publicationsConfig, Publication } from '../config/publicationsConfig';

export const metadata: Metadata = {
  title: 'Publications | Ben Labaschin',
  description: 'Reports, research, and long-form publications across AI systems and economics.',
};

export default function PublicationsPage() {
  const { publications } = publicationsConfig;
  const sortedPublications = [...publications].sort((a, b) => b.year - a.year);
  const featuredPublications = sortedPublications.filter(pub => pub.featured);
  const otherPublications = sortedPublications.filter(pub => !pub.featured);

  return (
    <EditorialPageFrame currentPath="/publications">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Public record</p>
          <h1 className="editorial-page-title">Publications</h1>
          <p className="editorial-page-copy">
            O&apos;Reilly work, formal research, and longer-form pieces that anchor the writing and talks elsewhere on the site.
          </p>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">What&apos;s here</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{publications.length}</span>
              <span className="editorial-page-metric-label">major publications</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">2025</span>
              <span className="editorial-page-metric-label">latest release year</span>
            </div>
          </div>
        </aside>
      </section>

      {featuredPublications.length > 0 && (
        <section className="editorial-list-section">
          <div className="editorial-list-heading">
            <p className="editorial-home-section-label">Featured</p>
            <h2 className="editorial-page-section-title">The work most likely to orient a first-time reader.</h2>
          </div>
          <div className="editorial-publication-grid">
            {featuredPublications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} featured />
            ))}
          </div>
        </section>
      )}

      {otherPublications.length > 0 && (
        <section className="editorial-list-section">
          <div className="editorial-list-heading">
            <p className="editorial-home-section-label">Archive</p>
            <h2 className="editorial-page-section-title">Background reports and earlier writing.</h2>
          </div>
          <div className="editorial-publication-grid">
            {otherPublications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        </section>
      )}
    </EditorialPageFrame>
  );
}

function PublicationCard({ publication, featured = false }: { 
  publication: Publication; 
  featured?: boolean;
}) {
  const displayType = (() => {
    if (publication.venue === "O'Reilly Media") {
      return "O'Reilly report";
    }
    const labels: Record<Publication['type'], string> = {
      book: 'Book',
      journal: 'Journal',
      conference: 'Conference',
      report: 'Report',
      workshop: 'Workshop',
      other: 'Writing',
    };
    return labels[publication.type];
  })();

  const actionHref = publication.url || publication.pdfUrl || (publication.doi ? `https://doi.org/${publication.doi}` : undefined);
  const actionLabel = publication.url ? 'View publication' : publication.pdfUrl ? 'Open PDF' : publication.doi ? 'View DOI' : undefined;

  return (
    <article
      id={publication.id}
      className={`editorial-publication-card ${featured ? 'is-featured' : ''}`}
    >
      {publication.coverImage && (
        <div className="editorial-publication-cover">
          <img
            src={publication.coverImage}
            alt={`Cover for ${publication.title}`}
          />
        </div>
      )}
      <div className="editorial-publication-content">
        <div className="editorial-post-meta">
          <span>{displayType}</span>
          <span>{publication.year}</span>
        </div>

        <h3>{publication.title}</h3>
        <p className="editorial-publication-authors">{publication.authors}</p>
        {publication.venue && <p className="editorial-publication-venue">{publication.venue}</p>}
        {publication.abstract && <p className="editorial-post-summary">{publication.abstract}</p>}

        <div className="editorial-chip-row">
          {publication.topics.slice(0, 4).map((topic) => (
            <span key={topic} className="editorial-chip">
              {topic}
            </span>
          ))}
        </div>

        {actionHref && actionLabel && (
          <a
            href={actionHref}
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-post-link"
          >
            {actionLabel}
          </a>
        )}
      </div>
    </article>
  );
}
